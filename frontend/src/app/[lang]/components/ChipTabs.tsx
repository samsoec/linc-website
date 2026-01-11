"use client";

interface ChipTabsProps<T> {
  items: T[];
  activeIndex: number;
  onSelect: (index: number) => void;
  getLabel: (item: T) => string;
  className?: string;
}

export default function ChipTabs<T>({
  items,
  activeIndex,
  onSelect,
  getLabel,
  className = "",
}: ChipTabsProps<T>) {
  if (!items || items.length === 0) return null;

  return (
    <div
      className={`flex flex-nowrap overflow-x-auto scrollbar-hide m-2 md:flex-wrap md:justify-center ${className}`}
    >
      <div className="p-1.5 bg-primary/10 rounded-full gap-2 flex">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`
              whitespace-nowrap rounded-full px-6 py-3 text-sm font-medium transition-all
              ${
                activeIndex === index
                  ? "bg-accent text-white shadow-md"
                  : "bg-transparent text-accent hover:bg-primary/10"
              }
            `}
          >
            {getLabel(item)}
          </button>
        ))}
      </div>
    </div>
  );
}
