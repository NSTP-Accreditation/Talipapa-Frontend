import { ImageInterface } from '@/types/global.types';

export interface Slide {
  _id?: string;
  title: string;
  subTitle?: string;
  image?: ImageInterface;
  order?: number;
}
