import { useMemo } from "react";

type SortBy = "alphabetical" | "lastModified";
type Order = "newest" | "oldest";

type SortConfig<T> = {
  items: T[];
  sortBy: SortBy;
  order: Order;
  getDate: (item: T) => string | undefined;
  getName: (item: T) => string;
};

export function useSorting<T>({
  items,
  sortBy,
  order,
  getDate,
  getName,
}: SortConfig<T>) {
  return useMemo(() => {
    const sorted = [...items];

    sorted.sort((a, b) => {
      if (sortBy === "alphabetical") {
        return getName(a).localeCompare(getName(b), "pt-BR");
      }

      const aDate = new Date(getDate(a) ?? 0).getTime();
      const bDate = new Date(getDate(b) ?? 0).getTime();
      return bDate - aDate;
    });

    return order === "oldest" ? sorted.reverse() : sorted;
  }, [getDate, getName, items, order, sortBy]);
}
