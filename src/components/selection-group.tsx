import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";

export interface SelectionItem {
  id: string;
  key: string;
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
  logoUri?: string;
  disabled?: boolean;
}

export interface SelectionGroupProps {
  title: string;
  items: SelectionItem[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  loading?: boolean;
  visibleCount?: number;
  titleIcon?: React.ComponentType<{ className?: string }>;
  titleIconColor?: string;
  showEmptyMessage?: boolean;
  emptyMessage?: string;
}

// Helper function to render item icon consistently
const renderItemIcon = (
  item: SelectionItem,
  className: string = "w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5"
) => {
  if (item.logoUri) {
    return (
      <Image
        src={item.logoUri}
        alt={`${item.name} logo`}
        className={`${className} object-contain`}
        width={16}
        height={16}
      />
    );
  }

  if (item.icon) {
    return <item.icon className={className} />;
  }

  return null;
};

// Helper function to render title with icon
const renderTitle = (
  title: string,
  titleIcon?: React.ComponentType<{ className?: string }>,
  titleIconColor: string = "text-gray-600"
) => (
  <p className="text-md font-semibold mb-3 flex items-center gap-2 text-gray-900 tracking-tight">
    {titleIcon &&
      React.createElement(titleIcon, {
        className: `w-4 h-4 sm:w-5 sm:h-5 ${titleIconColor}`,
      })}
    {title}
  </p>
);

// Helper function to get button styling based on selection state
const getButtonStyles = (isSelected: boolean, disabled: boolean = false) => {
  const baseStyles = "h-8 sm:h-9 px-2 sm:px-3 relative text-xs sm:text-sm";

  if (disabled) {
    return `${baseStyles} bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed`;
  }

  const selectedStyles =
    "bg-blue-50 text-blue-700 border-blue-500 hover:bg-blue-100";
  const defaultStyles =
    "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400";

  return `${baseStyles} ${isSelected ? selectedStyles : defaultStyles}`;
};

export function SelectionGroup({
  title,
  items,
  selectedKey,
  onSelect,
  loading = false,
  visibleCount = 3,
  titleIcon,
  titleIconColor = "text-gray-600",
  showEmptyMessage = false,
  emptyMessage,
}: SelectionGroupProps) {
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className="p-3 sm:p-5">
        <Skeleton className="h-6 w-32 mb-3" />
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Skeleton className="h-8 sm:h-9 w-20 sm:w-24" />
          <Skeleton className="h-8 sm:h-9 w-24 sm:w-28" />
          <Skeleton className="h-8 sm:h-9 w-28 sm:w-32" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-3 sm:p-5">
        {renderTitle(title, titleIcon, titleIconColor)}
        <div className="text-sm text-gray-500 italic ml-6 sm:ml-7 bg-gray-100 p-2 rounded-md self-start">
          {showEmptyMessage && emptyMessage
            ? emptyMessage
            : "No items available."}
        </div>
      </div>
    );
  }

  // Calculate items to display
  const selectedItem = items.find((item) => item.key === selectedKey);
  const initialVisibleItems = items.slice(0, visibleCount);
  const buttonItems =
    selectedItem &&
      !initialVisibleItems.find((item) => item.key === selectedItem.key)
      ? [...initialVisibleItems, selectedItem]
      : initialVisibleItems;

  // Remove duplicates while preserving order
  const uniqueButtonItems = buttonItems.filter(
    (item, index, self) => index === self.findIndex((t) => t.key === item.key)
  );

  // Get remaining items for dropdown
  const remainingItems = items.filter(
    (item) =>
      !uniqueButtonItems.find((buttonItem) => buttonItem.key === item.key)
  );

  return (
    <div className="p-3 sm:p-5">
      {!showEmptyMessage &&
        renderTitle(`Select ${title}`, titleIcon, titleIconColor)}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap ml-6 sm:ml-8">
        {/* Button items */}
        {uniqueButtonItems.map((item) => {
          const isSelected = item.key === selectedKey;
          return (
            <Button
              key={item.id}
              variant="outline"
              size="sm"
              className={getButtonStyles(isSelected, item.disabled)}
              onClick={() => !item.disabled && onSelect(item.key)}
              disabled={item.disabled}
            >
              {renderItemIcon(item)}
              <span className="truncate max-w-[80px] sm:max-w-[120px]">
                {item.name}
              </span>
              {isSelected && !item.disabled && (
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                </div>
              )}
            </Button>
          );
        })}

        {/* Dropdown for remaining items */}
        {remainingItems.length > 0 && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                role="combobox"
                aria-expanded={open}
                className="h-8 sm:h-9 px-2 sm:px-3 w-auto min-w-[100px] sm:min-w-[140px] bg-white text-gray-700 border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"
              >
                {`${remainingItems.length} more`}
                <ChevronsUpDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder={`Search ${title.toLowerCase()}...`}
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No items found.</CommandEmpty>
                  <CommandGroup>
                    {remainingItems.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.name}
                        onSelect={() => {
                          if (!item.disabled) {
                            onSelect(item.key);
                            setOpen(false);
                          }
                        }}
                        className={item.disabled ? "opacity-50 cursor-not-allowed" : ""}
                        disabled={item.disabled}
                      >
                        <div className="flex items-center gap-2">
                          {renderItemIcon(item, "w-4 h-4")}
                          {item.name}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
