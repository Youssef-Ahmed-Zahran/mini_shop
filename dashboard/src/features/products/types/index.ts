export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  image_urls: string[];       // all images (multi-image support)
  is_active: boolean;
  category_id: string;
  category_name: string;
  category_slug: string;
  created_at: string;
}
