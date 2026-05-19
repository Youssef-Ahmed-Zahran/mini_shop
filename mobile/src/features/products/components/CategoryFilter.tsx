import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import type { Category } from "../../categories/types";

interface Props {
  categories: Category[];
  selected: string | undefined;
  onSelect: (id: string | undefined) => void;
}

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
}: Props) {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          gap: 8,
        }}
      >
        <TouchableOpacity
          onPress={() => onSelect(undefined)}
          className={`px-4 py-2 rounded-full border ${
            !selected
              ? "bg-primary border-primary"
              : "bg-light-card dark:bg-surface-card border-light-input dark:border-surface-input"
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              !selected ? "text-white" : "text-light-muted dark:text-muted"
            }`}
          >
            All
          </Text>
        </TouchableOpacity>

        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => onSelect(cat.id)}
            className={`px-4 py-2 rounded-full border ${
              selected === cat.id
                ? "bg-primary border-primary"
                : "bg-light-card dark:bg-surface-card border-light-input dark:border-surface-input"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                selected === cat.id
                  ? "text-white"
                  : "text-light-muted dark:text-muted"
              }`}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
