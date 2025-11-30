import { Sprout, Trees, Flower } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'all', label: 'الكل', icon: null },
  { id: 'seedlings', label: 'الشتلات', icon: Sprout },
  { id: 'ready-plants', label: 'النباتات الجاهزة', icon: Trees },
  { id: 'herbs', label: 'الأعشاب', icon: Flower },
];

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300',
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
