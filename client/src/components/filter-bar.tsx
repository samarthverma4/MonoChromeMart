import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function FilterBar({ selectedCategory, onCategoryChange }: FilterBarProps) {
  const { data: categories = [] } = useQuery<string[]>({
    queryKey: ['/api/categories'],
  });

  return (
    <section className="sticky top-16 z-40 bg-white border-b border-neutral-gray py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-4 overflow-x-auto">
          <span className="text-sm font-medium whitespace-nowrap">Filter by:</span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCategoryChange("")}
            className={`px-4 py-2 border border-neutral-gray rounded-full text-sm hover:bg-neutral-gray transition-colors duration-150 whitespace-nowrap min-h-[44px] ${
              selectedCategory === "" ? "bg-near-black text-white" : ""
            }`}
            data-testid="filter-all"
          >
            All
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 border border-neutral-gray rounded-full text-sm hover:bg-neutral-gray transition-colors duration-150 whitespace-nowrap min-h-[44px] ${
                selectedCategory === category ? "bg-near-black text-white" : ""
              }`}
              data-testid={`filter-${category.toLowerCase()}`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
