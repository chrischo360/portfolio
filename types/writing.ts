export interface Writing {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  publishedDate: string;
  lastModified?: string;
  tags?: string[];
}
