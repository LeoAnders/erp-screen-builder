"use client";

import { LayoutGrid, List, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type SortBy = "alphabetical" | "lastModified";
type Order = "newest" | "oldest";
type View = "cards" | "list";

type ListToolbarProps = {
  sortBy: SortBy;
  order: Order;
  view: View;
  onSortByChange: (value: SortBy) => void;
  onOrderChange: (value: Order) => void;
  onViewChange: (value: View) => void;
  className?: string;
};

export function ListToolbar({
  sortBy,
  order,
  view,
  onSortByChange,
  onOrderChange,
  onViewChange,
  className,
}: ListToolbarProps) {
  const sortLabel =
    sortBy === "alphabetical" ? "Alfabética" : "Última modificação";

  return (
    <div className={`flex items-center justify-end gap-2 ${className ?? ""}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="min-w-[220px] justify-between gap-2"
          >
            <span className="truncate">{sortLabel}</span>
            <ChevronDown className="size-4 shrink-0 opacity-70" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[240px]">
          <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={sortBy}
            onValueChange={(val) => onSortByChange(val as SortBy)}
          >
            <DropdownMenuRadioItem value="alphabetical">
              Alfabética
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="lastModified">
              Última modificação
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Ordem</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={order}
            onValueChange={(val) => onOrderChange(val as Order)}
          >
            <DropdownMenuRadioItem value="oldest">
              Mais antigas primeiro
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="newest">
              Mais novas primeiro
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ToggleGroup
        type="single"
        value={view}
        onValueChange={(val) => val && onViewChange(val as View)}
      >
        <ToggleGroupItem value="cards" aria-label="Ver em cards">
          <LayoutGrid className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="Ver em lista">
          <List className="size-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

