export type OrderStatus = "pending" | "processing" | "delivered" | "cancelled";

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  customer_name: string;
  item_count?: number;
  items?: OrderItem[];
}
