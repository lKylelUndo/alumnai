import type { ElementType } from "react";
import type { LucideIcon } from "lucide-react";

export type Feature = {
  title: string;
  description: string;
  icon: LucideIcon | ElementType | string;
};
