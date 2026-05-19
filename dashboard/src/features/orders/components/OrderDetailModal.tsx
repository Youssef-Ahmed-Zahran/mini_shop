import { useState, forwardRef, useImperativeHandle } from "react";
import { useOrder, useUpdateOrderStatus } from "../hooks/useOrders";
import { X } from "lucide-react";
import { STATUS_COLORS, STATUS_OPTIONS } from "../types/constants";

export type OrderDetailModalRef = {
  open: (orderId: string) => void;
  close: () => void;
};

function OrderDetailModalInner({
  orderId,
  onClose,
}: {
  orderId: string;
  onClose: () => void;
}) {
  const { data: order, isLoading } = useOrder(orderId);
  const updateStatus = useUpdateOrderStatus();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Order Detail
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : order ? (
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Customer</p>
                <p className="font-semibold text-gray-900 dark:text-white mt-0.5">
                  {order.customer_name}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Total</p>
                <p className="font-semibold text-gray-900 dark:text-white mt-0.5">
                  ${Number(order.total_amount).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Placed</p>
                <p className="font-semibold text-gray-900 dark:text-white mt-0.5">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Status</p>
                <span
                  className={`inline-flex mt-0.5 px-2.5 py-1 rounded-lg text-xs font-medium ${STATUS_COLORS[order.status]}`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {/* Items */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Items
              </p>
              <div className="space-y-2">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3"
                  >
                    <img
                      src={
                        item.product_image ??
                        `https://placehold.co/40x40/e0e7ff/6366f1?text=${item.product_name[0]}`
                      }
                      alt={item.product_name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                        {item.product_name}
                      </p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs">
                        ×{item.quantity} @ ${item.unit_price}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      ${(item.quantity * item.unit_price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Update Status */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Update Status
              </p>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() =>
                      updateStatus.mutate({ id: order.id, status: s })
                    }
                    disabled={order.status === s || updateStatus.isPending}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      order.status === s
                        ? STATUS_COLORS[s] + " cursor-default"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export const OrderDetailModal = forwardRef<OrderDetailModalRef>(
  (props, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      open: (id) => {
        setOrderId(id);
        setIsOpen(true);
      },
      close: () => setIsOpen(false),
    }));

    if (!isOpen || !orderId) return null;

    return (
      <OrderDetailModalInner
        orderId={orderId}
        onClose={() => setIsOpen(false)}
      />
    );
  },
);
