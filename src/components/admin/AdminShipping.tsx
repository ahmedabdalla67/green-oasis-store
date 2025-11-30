import { useState } from 'react';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { ShippingZone } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

export function AdminShipping() {
  const { shippingZones, addShippingZone, updateShippingZone, deleteShippingZone } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  
  const [formData, setFormData] = useState({
    governorate: '',
    areas: '',
    shippingCost: '',
  });

  const resetForm = () => {
    setFormData({
      governorate: '',
      areas: '',
      shippingCost: '',
    });
    setEditingZone(null);
  };

  const handleOpenDialog = (zone?: ShippingZone) => {
    if (zone) {
      setEditingZone(zone);
      setFormData({
        governorate: zone.governorate,
        areas: zone.areas.join('، '),
        shippingCost: String(zone.shippingCost),
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.governorate || !formData.shippingCost) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    const zoneData = {
      governorate: formData.governorate,
      areas: formData.areas.split('،').map(a => a.trim()).filter(Boolean),
      shippingCost: Number(formData.shippingCost),
    };

    if (editingZone) {
      updateShippingZone(editingZone.id, zoneData);
      toast({ title: 'تم تحديث منطقة الشحن' });
    } else {
      addShippingZone(zoneData);
      toast({ title: 'تم إضافة منطقة الشحن' });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المنطقة؟')) {
      deleteShippingZone(id);
      toast({ title: 'تم حذف منطقة الشحن' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">مناطق الشحن ({shippingZones.length})</h3>
        <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90">
          <Plus className="w-5 h-5 ml-2" />
          إضافة محافظة جديدة
        </Button>
      </div>

      {/* Zones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shippingZones.map((zone) => (
          <div key={zone.id} className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold">{zone.governorate}</h4>
                  <p className="text-sm text-primary font-medium">{zone.shippingCost} جنيه للشحن</p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">المناطق:</p>
              <div className="flex flex-wrap gap-1">
                {zone.areas.map((area, index) => (
                  <span 
                    key={index} 
                    className="text-xs bg-secondary px-2 py-1 rounded"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleOpenDialog(zone)}
              >
                <Pencil className="w-4 h-4 ml-1" />
                تعديل
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDelete(zone.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {shippingZones.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          لا توجد مناطق شحن
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingZone ? 'تعديل منطقة الشحن' : 'إضافة محافظة جديدة'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>اسم المحافظة *</Label>
              <Input
                value={formData.governorate}
                onChange={(e) => setFormData(prev => ({ ...prev, governorate: e.target.value }))}
                className="mt-1"
                placeholder="مثال: القاهرة"
                required
              />
            </div>

            <div>
              <Label>تكلفة الشحن (جنيه) *</Label>
              <Input
                type="number"
                value={formData.shippingCost}
                onChange={(e) => setFormData(prev => ({ ...prev, shippingCost: e.target.value }))}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label>المناطق (مفصولة بفاصلة)</Label>
              <Input
                value={formData.areas}
                onChange={(e) => setFormData(prev => ({ ...prev, areas: e.target.value }))}
                className="mt-1"
                placeholder="منطقة 1، منطقة 2، منطقة 3"
              />
              <p className="text-xs text-muted-foreground mt-1">
                أدخل أسماء المناطق مفصولة بفاصلة
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                {editingZone ? 'تحديث' : 'إضافة'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                إلغاء
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
