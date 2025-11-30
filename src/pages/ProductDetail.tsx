import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Droplets, Sprout, Stethoscope, Minus, Plus, Check } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useData } from '@/contexts/DataContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

const categoryLabels: Record<string, string> = {
  seedlings: 'شتلات',
  'ready-plants': 'نباتات جاهزة',
  herbs: 'أعشاب',
};

const ProductDetail = () => {
  const { id } = useParams();
  const { getProductById } = useData();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  
  const product = getProductById(id || '');

  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">المنتج غير موجود</h1>
          <Link to="/products">
            <Button>العودة للمنتجات</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <MainLayout>
      {/* Breadcrumb */}
      <div className="bg-secondary/30 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary">
              الرئيسية
            </Link>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <Link to="/products" className="text-muted-foreground hover:text-primary">
              المنتجات
            </Link>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground text-sm px-4 py-1">
              {categoryLabels[product.category]}
            </Badge>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
            
            <p className="text-muted-foreground text-lg mb-6">{product.description}</p>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-primary">{product.price}</span>
              <span className="text-xl text-muted-foreground">جنيه</span>
            </div>

            <div className="flex flex-wrap gap-4 mb-6 text-sm">
              <div className="bg-secondary px-4 py-2 rounded-lg">
                <span className="text-muted-foreground">الوزن: </span>
                <span className="font-medium">{product.weight}</span>
              </div>
              <div className="bg-secondary px-4 py-2 rounded-lg">
                <span className="text-muted-foreground">المتوفر: </span>
                <span className="font-medium">{product.stock} قطعة</span>
              </div>
            </div>

            {/* Benefits */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-3">الفوائد</h3>
              <div className="flex flex-wrap gap-2">
                {product.benefits.map((benefit, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-secondary transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-6 py-3 font-bold text-lg min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 hover:bg-secondary transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              <Button
                size="lg"
                onClick={handleAddToCart}
                className={`flex-1 text-lg transition-all duration-300 ${
                  isAdded 
                    ? 'bg-success hover:bg-success' 
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5 ml-2" />
                    تمت الإضافة للسلة
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 ml-2" />
                    أضف للسلة
                  </>
                )}
              </Button>
            </div>

            <div className="text-lg font-medium">
              الإجمالي: <span className="text-primary">{product.price * quantity} جنيه</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="usage" className="w-full">
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0 gap-8">
              <TabsTrigger 
                value="usage" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-4"
              >
                طريقة الاستخدام
              </TabsTrigger>
              <TabsTrigger 
                value="medical" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-4"
              >
                الاستشارة الطبية
              </TabsTrigger>
              <TabsTrigger 
                value="agriculture" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-4"
              >
                الاستشارة الزراعية
              </TabsTrigger>
            </TabsList>

            <TabsContent value="usage" className="mt-8">
              <div className="bg-card p-6 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sprout className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg">كيفية الاستخدام</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{product.usage}</p>
              </div>
            </TabsContent>

            <TabsContent value="medical" className="mt-8">
              <div className="bg-card p-6 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg">الفوائد الصحية</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{product.medicalAdvice}</p>
              </div>
            </TabsContent>

            <TabsContent value="agriculture" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-xl border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sprout className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg">نصائح الزراعة</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{product.agricultureAdvice}</p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Droplets className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg">نصائح الري</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{product.wateringAdvice}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
