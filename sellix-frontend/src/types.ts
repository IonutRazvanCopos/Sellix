export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  images: { url: string }[];
  user: { username: string };
  category: { name: string };
  subcategory?: { name: string };
}