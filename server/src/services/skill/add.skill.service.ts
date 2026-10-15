import { SkillRepository } from "@/repositories/skill.repository";
import { ProfileRepository } from "@/repositories/profile.repository";
import { CanonicalSkillRepository } from "@/repositories/canonical.skill.repository";
import { AddSkillInputTypes } from "@/schema/skill";
import { validateSkillInput } from "@/lib/gemini";
import { containsBlockedLanguage } from "@/utils/profanity.blocklist";

export const AddSkillService = async (data: AddSkillInputTypes, userId?: string) => {
  const skillRepository = new SkillRepository();
  const profileRepository = new ProfileRepository();
  const canonicalSkillRepository = new CanonicalSkillRepository();

  try {
    let targetProfileId = data.profileId;
    let effectiveUserId = userId;

    if (!targetProfileId && userId) {
      const profile = await profileRepository.getOrCreateProfileByUserId(userId);
      targetProfileId = profile.id;
    } else if (targetProfileId && !effectiveUserId) {
      const profile = await profileRepository.findByPk(targetProfileId);
      if (profile) effectiveUserId = profile.userId;
    }

    if (!targetProfileId) {
      return { status: "error", code: 400, message: "Profile ID could not be determined" };
    }

    // ── Input guard: Layer 0 → Layer 1 → Layer 2 ─────────────────────────
    // Runs before findOrCreate so junk names never reach the canonical table.
    const trimmedName = data.name.trim();

    // Layer 0 — structural shape (no AI): 2-60 chars and at least one letter.
    // Rejects whitespace-only, pure numbers, symbols-only, and emoji-only.
    if (trimmedName.length < 2 || trimmedName.length > 60 || !/\p{L}/u.test(trimmedName)) {
      return {
        status: "error",
        code: 400,
        message: `"${trimmedName}" doesn't look like a valid skill name. Please enter a real skill, technology, or technical method (2-60 characters).`,
        reason: "INVALID_SHAPE",
      };
    }

    // Layer 1 — local blocklist (no AI). Hard floor even when Gemini is down.
    const nameIsBlocked = containsBlockedLanguage(trimmedName);
    const descriptionIsBlocked = containsBlockedLanguage(data.description);
    if (nameIsBlocked || descriptionIsBlocked) {
      return {
        status: "error",
        code: 400,
        message: `That ${nameIsBlocked ? "skill name" : "description"} contains language that isn't allowed on AlumnAI.`,
        reason: "INAPPROPRIATE",
      };
    }

    // Layer 2 — Gemini semantic judge (single call for name + description).
    // Fails OPEN on outage (warning logged, save allowed); Layer 1 is the floor.
    const verdict = await validateSkillInput(trimmedName, data.description);
    if (verdict.isAbusive) {
      return {
        status: "error",
        code: 400,
        message: "That skill name or description contains language that isn't allowed on AlumnAI.",
        reason: "INAPPROPRIATE",
      };
    }
    if (!verdict.isTechnology) {
      return {
        status: "error",
        code: 400,
        message: `"${trimmedName}" doesn't look technology-related. Skills must be tools, technologies, or technical methods from any field.`,
        reason: "NOT_TECHNOLOGY",
      };
    }

    // Resolve skill name through the canonical system
    const canonical = await canonicalSkillRepository.findOrCreate(data.name);

    const response = await skillRepository.add({
      ...data,
      name: canonical.name, // Use the canonical display name
      profileId: targetProfileId,
      canonicalSkillId: canonical.id,
    });

    if (!response)
      return { status: "error", code: 400, message: "Unable to add skill" };

    // Clear skill gap analysis cache for user via repository
    if (effectiveUserId) {
      await skillRepository.invalidateSkillGapCache(effectiveUserId);
    }

    // Adding a skill changes the view-profile payload — drop cached copies.
    await profileRepository.invalidateCache();

    return { status: "success", code: 201, message: "Successfully add skill" };
  } catch (error) {
    console.error("AddSkillService", error);
    return { status: "error", code: 500, message: "Unable to add skill on profile" };
  }
};
