import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Check } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useCart } from '@/contexts/CartContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();
  const { shippingZones, addOrder } = useData();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    governorate: '',
    area: '',
    paymentMethod: 'cash' as 'cash' | 'vodafone',
    vodafoneNumber: '',
  });

  const [showVodafoneModal, setShowVodafoneModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedZone = shippingZones.find(z => z.governorate === formData.governorate);
  const shippingCost = selectedZone?.shippingCost || 0;
  const finalTotal = totalAmount + shippingCost;

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'governorate' ? { area: '' } : {}),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.phone || !formData.address || !formData.governorate || !formData.area) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    if (formData.paymentMethod === 'vodafone') {
      setShowVodafoneModal(true);
      return;
    }

    submitOrder();
  };

  const submitOrder = () => {
    setIsSubmitting(true);

    addOrder({
      customerName: formData.customerName,
      phone: formData.phone,
      address: formData.address,
      governorate: formData.governorate,
      area: formData.area,
      items: items,
      totalAmount: finalTotal,
      shippingCost: shippingCost,
      paymentMethod: formData.paymentMethod,
      vodafoneNumber: formData.vodafoneNumber || undefined,
      status: 'pending',
    });

    clearCart();
    
    toast({
      title: 'تم تأكيد الطلب',
      description: 'سيتم التواصل معك قريباً لتأكيد التوصيل',
    });

    navigate('/');
    setIsSubmitting(false);
  };

  const handleVodafoneSubmit = () => {
    if (!formData.vodafoneNumber) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال رقم التحويل',
        variant: 'destructive',
      });
      return;
    }
    setShowVodafoneModal(false);
    submitOrder();
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">إتمام الطلب</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Info */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="font-bold text-xl mb-6">معلومات التوصيل</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">الاسم الكامل *</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => handleChange('customerName', e.target.value)}
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

                <div className="mt-4">
                  <Label htmlFor="address">العنوان بالتفصيل *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="mt-1"
                    placeholder="الشارع - رقم المبنى - الدور - الشقة"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label>المحافظة *</Label>
                    <Select
                      value={formData.governorate}
                      onValueChange={(value) => handleChange('governorate', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="اختر المحافظة" />
                      </SelectTrigger>
                      <SelectContent>
                        {shippingZones.map((zone) => (
                          <SelectItem key={zone.id} value={zone.governorate}>
                            {zone.governorate} - شحن {zone.shippingCost} جنيه
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>المنطقة *</Label>
                    <Select
                      value={formData.area}
                      onValueChange={(value) => handleChange('area', value)}
                      disabled={!formData.governorate}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="اختر المنطقة" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedZone?.areas.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="font-bold text-xl mb-6">طريقة الدفع</h2>
                
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleChange('paymentMethod', value)}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-reverse space-x-4 p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Truck className="w-6 h-6 text-primary" />
                      <div>
                        <p className="font-medium">الدفع عند الاستلام</p>
                        <p className="text-sm text-muted-foreground">ادفع كاش للمندوب عند التوصيل</p>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-reverse space-x-4 p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="vodafone" id="vodafone" />
                    <Label htmlFor="vodafone" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="w-6 h-6 text-primary" />
                      <div>
                        <p className="font-medium">فودافون كاش</p>
                        <p className="text-sm text-muted-foreground">حوّل المبلغ على رقم: 01012345678</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'جاري التأكيد...' : 'تأكيد الطلب'}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 border border-border sticky top-24">
              <h2 className="font-bold text-xl mb-6">ملخص الطلب</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                      <p className="text-muted-foreground text-sm">الكمية: {item.quantity}</p>
                      <p className="text-primary font-medium">{item.product.price * item.quantity} جنيه</p>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="border-border mb-4" />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span>{totalAmount} جنيه</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الشحن</span>
                  <span>{shippingCost > 0 ? `${shippingCost} جنيه` : 'اختر المحافظة'}</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between text-lg font-bold">
                  <span>الإجمالي</span>
                  <span className="text-primary">{finalTotal} جنيه</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vodafone Cash Modal */}
      <Dialog open={showVodafoneModal} onOpenChange={setShowVodafoneModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الدفع بفودافون كاش</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-secondary p-4 rounded-lg text-center">
              <p className="text-muted-foreground mb-2">حوّل المبلغ على الرقم:</p>
              <p className="text-2xl font-bold text-primary">01012345678</p>
              <p className="text-lg font-medium mt-2">المبلغ: {finalTotal} جنيه</p>
            </div>

            <div>
              <Label htmlFor="vodafoneNumber">رقم التحويل (آخر 4 أرقام من المعاملة)</Label>
              <Input
                id="vodafoneNumber"
                value={formData.vodafoneNumber}
                onChange={(e) => handleChange('vodafoneNumber', e.target.value)}
                className="mt-1"
                placeholder="مثال: 1234"
              />
            </div>

            <Button
              onClick={handleVodafoneSubmit}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Check className="w-5 h-5 ml-2" />
              تأكيد التحويل
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Checkout;
