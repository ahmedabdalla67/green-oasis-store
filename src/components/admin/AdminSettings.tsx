import { useState } from 'react';
import { Save, Store, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

export function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: 'زراعتي',
    phone: '01234567890',
    email: 'info@zeraaty.com',
    address: 'القاهرة، مصر',
    vodafoneNumber: '01012345678',
    aboutUs: 'متجر زراعتي هو متجرك المفضل للمنتجات الزراعية الطبيعية. نقدم أجود الشتلات والأعشاب والنباتات الجاهزة للزراعة.',
  });

  const handleSave = () => {
    localStorage.setItem('storeSettings', JSON.stringify(settings));
    toast({ title: 'تم حفظ الإعدادات بنجاح' });
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Store Info */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Store className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-bold text-lg">معلومات المتجر</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label>اسم المتجر</Label>
            <Input
              value={settings.storeName}
              onChange={(e) => setSettings(prev => ({ ...prev, storeName: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label>نبذة عن المتجر</Label>
            <Textarea
              value={settings.aboutUs}
              onChange={(e) => setSettings(prev => ({ ...prev, aboutUs: e.target.value }))}
              className="mt-1 min-h-[100px]"
            />
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Phone className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-bold text-lg">معلومات التواصل</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>رقم الهاتف</Label>
              <Input
                value={settings.phone}
                onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label>البريد الإلكتروني</Label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>العنوان</Label>
            <Input
              value={settings.address}
              onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Payment Settings */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-bold text-lg">إعدادات الدفع</h3>
        </div>

        <div>
          <Label>رقم فودافون كاش</Label>
          <Input
            value={settings.vodafoneNumber}
            onChange={(e) => setSettings(prev => ({ ...prev, vodafoneNumber: e.target.value }))}
            className="mt-1"
            placeholder="رقم الهاتف لاستقبال التحويلات"
          />
          <p className="text-sm text-muted-foreground mt-1">
            هذا الرقم سيظهر للعملاء عند اختيار الدفع بفودافون كاش
          </p>
        </div>
      </div>

      <Button onClick={handleSave} size="lg" className="w-full bg-primary hover:bg-primary/90">
        <Save className="w-5 h-5 ml-2" />
        حفظ الإعدادات
      </Button>
    </div>
  );
}
