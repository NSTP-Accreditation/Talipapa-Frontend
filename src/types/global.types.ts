export interface MaterialInterface {
  _id: string;
  name: string;
  description: string;
  pointsPerKg: number;
  createdAt: string;
}

export interface ImageInterface {
  key: string;
  mimetype: string;
  originalName: string;
  size: number;
  url: string
}