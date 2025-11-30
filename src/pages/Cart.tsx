import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalAmount, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">سلة التسوق فارغة</h1>
            <p className="text-muted-foreground mb-8">
              لم تقم بإضافة أي منتجات بعد. تصفح منتجاتنا وأضف ما يعجبك!
            </p>
            <Link to="/products">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                تصفح المنتجات
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">سلة التسوق ({totalItems} منتج)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="bg-card rounded-xl p-4 border border-border flex gap-4"
              >
                <Link to={`/product/${item.product.id}`}>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg"
                  />
                </Link>

                <div className="flex-1">
                  <Link to={`/product/${item.product.id}`}>
                    <h3 className="font-bold text-lg hover:text-primary transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground text-sm mb-2">
                    {item.product.weight}
                  </p>
                  <p className="text-primary font-bold text-lg">
                    {item.product.price} جنيه
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-destructive hover:text-destructive/80 transition-colors p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-2 hover:bg-secondary transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-2 hover:bg-secondary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="font-bold">
                    {item.product.price * item.quantity} جنيه
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 border border-border sticky top-24">
              <h2 className="font-bold text-xl mb-6">ملخص الطلب</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span className="font-medium">{totalAmount} جنيه</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الشحن</span>
                  <span className="text-muted-foreground">يحسب عند الدفع</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between text-lg font-bold">
                  <span>الإجمالي</span>
                  <span className="text-primary">{totalAmount} جنيه</span>
                </div>
              </div>

              <Link to="/checkout">
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-lg">
                  إتمام الطلب
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>

              <Link to="/products" className="block mt-4">
                <Button variant="outline" size="lg" className="w-full">
                  متابعة التسوق
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Cart;
