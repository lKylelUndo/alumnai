import { Roboto, Roboto_Slab } from "next/font/google";

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const roboto_slab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});