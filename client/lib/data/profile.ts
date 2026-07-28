import { Profile } from "../types/profile";

export const profile: Profile = {
  id: "1",

  role: "Student",

  name: "Rose Gercan",

  studentId: "2026 5555 ", // (better if optional ata ni or di ma show?)

  email: "roseg14@gmail.com",

  github: "https://github.com/rosegercan",

  avatar: "/images/profile.jpg",

  about:
    "I'm a 3rd Year Student who's passionate about learning. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",

  skills: [
    {
      title: "Core Skills",
      skills: [
        {
          id: "1",
          name: "UI/UX Principles",
          level: "Intermediate",
        },
      ],
    },

    {
      title: "Tools & Technology",
      skills: [
        {
          id: "2",
          name: "Adobe",
          level: "Advanced",
        },

        {
          id: "3",
          name: "Figma",
          level: "Expert",
        },
      ],
    },

    {
      title: "Others",
      skills: [
        {
          id: "4",
          name: "Lovable AI",
          level: "Advanced",
        },

        {
          id: "5",
          name: "Google Gemini",
          level: "Advanced",
        },
      ],
    },
  ],

  mentors: [
    {
      id: "1",
      name: "Jameboy Escartin",
      position: "Senior Full Stack Developer",
      company: "Tech Corp",
      avatar: "/images/mentor.jpg",
    },

    {
      id: "2",
      name: "Jameboy Escartin",
      position: "Senior Full Stack Developer",
      company: "Tech Corp",
      avatar: "/images/mentor.jpg",
    },

    {
      id: "3",
      name: "Jameboy Escartin",
      position: "Senior Full Stack Developer",
      company: "Tech Corp",
      avatar: "/images/mentor.jpg",
    },
  ],

  certifications: [
    {
      id: "1",
      title: "TESDA Web Design",
      issuer: "TESDA",
    },
  ],
};