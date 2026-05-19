import { useCartStore } from "../../../store/cartStore";
import { useCreateOrder } from "../../orders/hooks/useOrders";
import { useAuthStore } from "../../../store/authStore";

export function useCartScreenModal() {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount } =
    useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { mutate: createOrder, isPending: isCheckingOut } = useCreateOrder();

  const checkout = () => {
    if (!isAuthenticated) return;
    const payload = {
      items: items.map((i) => ({
        product_id: i.product.id,
        quantity: i.quantity,
      })),
    };
    createOrder(payload);
  };

  return {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    total: total(),
    itemCount: itemCount(),
    isAuthenticated,
    checkout,
    isCheckingOut,
  };
}
