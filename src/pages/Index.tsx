import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf, Truck, Shield, Phone } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { products } = useData();
  const featuredProducts = products.slice(0, 4);

  const features = [
    {
      icon: Leaf,
      title: 'منتجات طبيعية',
      description: 'جميع منتجاتنا عضوية 100% وخالية من المبيدات الكيميائية',
    },
    {
      icon: Truck,
      title: 'توصيل سريع',
      description: 'نوصل لجميع المحافظات بأسعار مناسبة وسرعة فائقة',
    },
    {
      icon: Shield,
      title: 'ضمان الجودة',
      description: 'نضمن جودة منتجاتنا أو استرداد أموالك بالكامل',
    },
    {
      icon: Phone,
      title: 'دعم متواصل',
      description: 'فريق دعم متخصص للرد على استفساراتك الزراعية',
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 animate-fade-in">
              <Leaf className="w-4 h-4" />
              <span className="text-sm font-medium">متجرك الزراعي الأول في مصر</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight animate-slide-up">
              ازرع <span className="text-gradient">حياة جديدة</span>
              <br />
              في منزلك
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              اكتشف مجموعتنا المتميزة من الشتلات والأعشاب والنباتات الجاهزة للزراعة.
              كل ما تحتاجه لبدء حديقتك الخاصة.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/products">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 bg-primary hover:bg-primary/90 text-primary-foreground">
                  تسوق الآن
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>
              <Link to="/consultations">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                  احصل على استشارة
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-card p-6 rounded-xl text-center card-hover border border-border"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">منتجات مميزة</h2>
            <p className="text-muted-foreground text-lg">اكتشف أفضل المنتجات الزراعية لدينا</p>
          </div>
          
          <ProductGrid products={featuredProducts} />
          
          <div className="text-center mt-10">
            <Link to="/products">
              <Button size="lg" variant="outline" className="text-lg px-8">
                عرض جميع المنتجات
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">تصفح الأقسام</h2>
            <p className="text-muted-foreground text-lg">اختر القسم المناسب لاحتياجاتك</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/products?category=seedlings" className="group">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden card-hover">
                <img
                  src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600"
                  alt="الشتلات"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                <div className="absolute bottom-0 right-0 left-0 p-6 text-primary-foreground">
                  <h3 className="text-2xl font-bold mb-2">الشتلات</h3>
                  <p className="text-primary-foreground/80">شتلات متنوعة لجميع المحاصيل</p>
                </div>
              </div>
            </Link>
            
            <Link to="/products?category=ready-plants" className="group">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden card-hover">
                <img
                  src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600"
                  alt="النباتات الجاهزة"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                <div className="absolute bottom-0 right-0 left-0 p-6 text-primary-foreground">
                  <h3 className="text-2xl font-bold mb-2">النباتات الجاهزة</h3>
                  <p className="text-primary-foreground/80">أشجار ونباتات جاهزة للزراعة</p>
                </div>
              </div>
            </Link>
            
            <Link to="/products?category=herbs" className="group">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden card-hover">
                <img
                  src="https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=600"
                  alt="الأعشاب"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                <div className="absolute bottom-0 right-0 left-0 p-6 text-primary-foreground">
                  <h3 className="text-2xl font-bold mb-2">الأعشاب</h3>
                  <p className="text-primary-foreground/80">أعشاب طبية وعطرية طازجة</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            هل تحتاج مساعدة في الزراعة؟
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            فريقنا من الخبراء الزراعيين جاهز لمساعدتك في كل ما يخص الزراعة والعناية بالنباتات
          </p>
          <Link to="/consultations">
            <Button size="lg" className="text-lg px-8 bg-card text-primary hover:bg-card/90">
              احصل على استشارة مجانية
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
