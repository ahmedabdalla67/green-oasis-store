import { useState } from 'react';
import { MessageSquare, Leaf, Droplets, Stethoscope, Send } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const Consultations = () => {
  const { products, addConsultation } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    productId: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.subject || !formData.message) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    addConsultation({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
      productId: formData.productId || undefined,
    });

    toast({
      title: 'تم إرسال الاستشارة',
      description: 'سنتواصل معك في أقرب وقت ممكن',
    });

    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      productId: '',
      message: '',
    });

    setIsSubmitting(false);
  };

  const consultationTypes = [
    {
      icon: Leaf,
      title: 'استشارات زراعية',
      description: 'نصائح حول زراعة النباتات والعناية بها',
    },
    {
      icon: Stethoscope,
      title: 'استشارات طبية',
      description: 'معلومات عن الفوائد الصحية للأعشاب',
    },
    {
      icon: Droplets,
      title: 'استشارات الري',
      description: 'كيفية ري النباتات بالطريقة الصحيحة',
    },
  ];

  return (
    <MainLayout>
      {/* Hero */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">الاستشارات الزراعية والطبية</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            فريقنا من الخبراء جاهز للإجابة على جميع استفساراتك حول الزراعة والفوائد الصحية للنباتات
          </p>
        </div>
      </section>

      {/* Consultation Types */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {consultationTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <div
                  key={index}
                  className="bg-card p-6 rounded-xl border border-border text-center card-hover"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{type.title}</h3>
                  <p className="text-muted-foreground text-sm">{type.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-xl p-8 border border-border">
              <h2 className="text-2xl font-bold mb-6 text-center">أرسل استشارتك</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">الاسم الكامل *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">رقم الهاتف *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>نوع الاستشارة *</Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => handleChange('subject', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="اختر نوع الاستشارة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agriculture">استشارة زراعية</SelectItem>
                      <SelectItem value="medical">استشارة طبية</SelectItem>
                      <SelectItem value="watering">استشارة ري</SelectItem>
                      <SelectItem value="general">استفسار عام</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>المنتج (اختياري)</Label>
                  <Select
                    value={formData.productId}
                    onValueChange={(value) => handleChange('productId', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="اختر المنتج إن كانت الاستشارة متعلقة بمنتج معين" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">لا يوجد منتج محدد</SelectItem>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">رسالتك *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    className="mt-1 min-h-[150px]"
                    placeholder="اكتب استفسارك بالتفصيل..."
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  <Send className="w-5 h-5 ml-2" />
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال الاستشارة'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Consultations;
