import { prisma } from "@/lib/prisma";
import { normalizeSkillName } from "@/utils/normalize.skill";

/**
 * Common canonical skills to seed the database with.
 * Each entry is the official/display name.
 */
const CANONICAL_SKILLS = [
  // Frontend Frameworks
  "React", "Next.js", "Vue.js", "Nuxt.js", "Angular", "Svelte", "SvelteKit",
  "Astro", "Gatsby", "Remix",

  // CSS / Styling
  "Tailwind CSS", "Bootstrap", "Sass", "Material UI", "Styled Components",
  "Chakra UI", "Ant Design",

  // Backend Frameworks
  "Node.js", "Express.js", "NestJS", "Fastify", "Hono",
  "Laravel", "Django", "Flask", "FastAPI",
  "Spring Boot", "Ruby on Rails", "ASP.NET",

  // Languages
  "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "C",
  "Go", "Rust", "Ruby", "PHP", "Kotlin", "Swift", "Dart",
  "R", "Scala", "Elixir",

  // Databases
  "PostgreSQL", "MySQL", "MongoDB", "SQLite", "Redis",
  "MariaDB", "Cassandra", "DynamoDB", "Supabase", "Firebase",
  "Prisma", "Drizzle",

  // Cloud & DevOps
  "AWS", "Google Cloud", "Azure", "Docker", "Kubernetes",
  "Terraform", "Ansible", "Jenkins", "GitHub Actions",
  "Vercel", "Netlify", "Railway", "Render",

  // Mobile
  "React Native", "Flutter", "Ionic", "Expo",

  // AI / ML
  "TensorFlow", "PyTorch", "scikit-learn", "OpenAI", "LangChain",
  "Hugging Face", "Large Language Models",

  // Tools
  "Git", "GitHub", "GitLab", "Bitbucket",
  "Figma", "Postman", "VS Code",
  "Jira", "Trello", "Notion",

  // Testing
  "Jest", "Vitest", "Cypress", "Playwright",

  // Other
  "GraphQL", "REST API", "WebSocket", "gRPC",
  "Linux", "Nginx", "Apache",
  "Elasticsearch", "RabbitMQ", "Kafka",

  // Soft Skills
  "Communication", "Leadership", "Problem Solving", "Teamwork",
  "Critical Thinking", "Time Management", "Adaptability",
  "Project Management", "Public Speaking", "Mentoring",
];

/**
 * Seed canonical skills into the database.
 * Skips any that already exist (by normalizedName).
 */
export async function seedCanonicalSkills() {
  let created = 0;
  let skipped = 0;

  for (const name of CANONICAL_SKILLS) {
    const normalized = normalizeSkillName(name);

    const existing = await prisma.canonicalSkill.findUnique({
      where: { normalizedName: normalized },
    });

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.canonicalSkill.create({
      data: { name, normalizedName: normalized },
    });
    created++;
  }

  console.log(`[SeedCanonicalSkills] Created: ${created}, Skipped: ${skipped}`);
  return { created, skipped };
}

// Allow running directly: npx tsx src/utils/seed.canonical.skills.ts
seedCanonicalSkills()
  .then(() => {
    console.log("Canonical skills seeded successfully.")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Seed failed:", error)
    process.exit(1)
  })
