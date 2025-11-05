import { ImageInterface } from "@/types/global.types";

interface Achievement {
  _id: string;
  title: string;
  description: string;
  link: string;
  image: ImageInterface;
  createdAt: string;
  updatedAt: string;
}
