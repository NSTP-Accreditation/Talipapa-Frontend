import { ImageInterface } from "@/types/global.types";

export interface Slide {
  _id?: string;
  title: string;
  subtitle?: string;
  image?: ImageInterface;
  link?: string;
  order?: number;
}
