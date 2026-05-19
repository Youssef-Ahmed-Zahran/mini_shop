import React from "react";
import { Tabs } from "expo-router";
import { Home, ShoppingCart, ShoppingBag, User } from "lucide-react-native";
import { View, Text } from "react-native";
import { useCartStore } from "../../src/store/cartStore";
import { useUIStore } from "../../src/store/uiStore";

function CartTabIcon({ color }: { color: string; focused: boolean }) {
  const itemCount = useCartStore((s) => s.itemCount());
  return (
    <View>
      <ShoppingCart size={22} color={color} />
      {itemCount > 0 && (
        <View
          style={{
            position: "absolute",
            top: -4,
            right: -6,
            backgroundColor: "#FF6584",
            borderRadius: 8,
            minWidth: 16,
            height: 16,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 3,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 9, fontWeight: "700" }}>
            {itemCount > 9 ? "9+" : itemCount}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function TabsLayout() {
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#27273A" : "#FFFFFF",
          borderTopColor: isDark ? "#313150" : "#E5E7EB",
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#6C63FF",
        tabBarInactiveTintColor: isDark ? "#8888AA" : "#9CA3AF",
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Shop",
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, focused }) => (
            <CartTabIcon color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => <ShoppingBag size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
