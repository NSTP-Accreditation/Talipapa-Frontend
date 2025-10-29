export interface Slide {
  _id?: string;
  title: string;
  subtitle?: string;
  image?: {
    url: string;
    publicId?: string;
  };
  link?: string;
  order?: number;
}
