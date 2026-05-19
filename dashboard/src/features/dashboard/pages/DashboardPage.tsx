import { useRef } from "react";
import { useOrderStats, useOrders } from "../../orders/hooks/useOrders";
import { useProducts } from "../../products/hooks/useProducts";
import { ShoppingCart, DollarSign, Package, TrendingUp } from "lucide-react";

import { KPICard } from "../components/KPICard";
import { STATUS_COLORS } from "../../orders/types/constants";
import {
  OrderDetailModal,
  type OrderDetailModalRef,
} from "../../orders/components/OrderDetailModal";

export default function DashboardPage() {
  const modalRef = useRef<OrderDetailModalRef>(null);
  const { data: stats, isLoading: statsLoading } = useOrderStats();
  const { data: products, isLoading: productsLoading } = useProducts({
    limit: 1000,
  });
  const { data: recentOrders, isLoading: ordersLoading } = useOrders({
    limit: 5,
  });
  const activeProducts = products?.data.filter((p) => p.is_active).length ?? 0;

  if (statsLoading || productsLoading || ordersLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 h-28 animate-pulse border border-gray-100 dark:border-gray-700"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <KPICard
          title="Orders Today"
          value={stats?.ordersToday ?? 0}
          icon={ShoppingCart}
          color="bg-indigo-500"
          sub="new orders"
        />
        <KPICard
          title="Total Revenue"
          value={`$${(stats?.totalRevenue ?? 0).toFixed(2)}`}
          icon={DollarSign}
          color="bg-emerald-500"
          sub="all time"
        />
        <KPICard
          title="Total Orders"
          value={stats?.totalOrders ?? 0}
          icon={TrendingUp}
          color="bg-purple-500"
          sub="all time"
        />
        <KPICard
          title="Active Products"
          value={activeProducts}
          icon={Package}
          color="bg-amber-500"
          sub="in catalogue"
        />
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Recent Orders
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {recentOrders?.data.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition"
                >
                  <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {order.customer_name}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    ${Number(order.total_amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${STATUS_COLORS[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => modalRef.current?.open(order.id)}
                      className="text-indigo-500 hover:text-indigo-700 text-xs font-medium transition"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {(!recentOrders?.data || recentOrders.data.length === 0) && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <OrderDetailModal ref={modalRef} />
    </div>
  );
}
