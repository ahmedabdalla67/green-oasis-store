import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Check } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

const categoryLabels: Record<string, string> = {
  seedlings: 'شتلات',
  'ready-plants': 'نباتات جاهزة',
  herbs: 'أعشاب',
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-md card-hover border border-border">
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
            {categoryLabels[product.category]}
          </Badge>
          {product.stock < 10 && (
            <Badge className="absolute top-3 left-3 bg-warning text-warning-foreground">
              كمية محدودة
            </Badge>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-primary">{product.price}</span>
            <span className="text-muted-foreground text-sm mr-1">جنيه</span>
          </div>
          <span className="text-sm text-muted-foreground">{product.weight}</span>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleAddToCart}
            className={`flex-1 transition-all duration-300 ${
              isAdded 
                ? 'bg-success hover:bg-success text-success-foreground' 
                : 'bg-primary hover:bg-primary/90 text-primary-foreground'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 ml-2" />
                تمت الإضافة
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 ml-2" />
                أضف للسلة
              </>
            )}
          </Button>
          <Link to={`/product/${product.id}`}>
            <Button variant="outline" size="icon">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
