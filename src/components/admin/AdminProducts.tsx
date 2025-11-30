import { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

const categoryLabels: Record<string, string> = {
  seedlings: 'شتلات',
  'ready-plants': 'نباتات جاهزة',
  herbs: 'أعشاب',
};

export function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    weight: '',
    category: 'seedlings' as 'seedlings' | 'ready-plants' | 'herbs',
    image: '',
    benefits: '',
    usage: '',
    medicalAdvice: '',
    agricultureAdvice: '',
    wateringAdvice: '',
    stock: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      weight: '',
      category: 'seedlings',
      image: '',
      benefits: '',
      usage: '',
      medicalAdvice: '',
      agricultureAdvice: '',
      wateringAdvice: '',
      stock: '',
    });
    setEditingProduct(null);
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: String(product.price),
        weight: product.weight,
        category: product.category,
        image: product.image,
        benefits: product.benefits.join('، '),
        usage: product.usage,
        medicalAdvice: product.medicalAdvice,
        agricultureAdvice: product.agricultureAdvice,
        wateringAdvice: product.wateringAdvice,
        stock: String(product.stock),
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      weight: formData.weight,
      category: formData.category,
      image: formData.image || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
      benefits: formData.benefits.split('،').map(b => b.trim()).filter(Boolean),
      usage: formData.usage,
      medicalAdvice: formData.medicalAdvice,
      agricultureAdvice: formData.agricultureAdvice,
      wateringAdvice: formData.wateringAdvice,
      stock: Number(formData.stock) || 0,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast({ title: 'تم تحديث المنتج بنجاح' });
    } else {
      addProduct(productData);
      toast({ title: 'تم إضافة المنتج بنجاح' });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      deleteProduct(id);
      toast({ title: 'تم حذف المنتج' });
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.includes(searchQuery) || p.description.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="البحث عن منتج..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90">
          <Plus className="w-5 h-5 ml-2" />
          إضافة منتج جديد
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-card rounded-xl border border-border overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold line-clamp-1">{product.name}</h3>
                <span className="text-xs bg-secondary px-2 py-1 rounded">
                  {categoryLabels[product.category]}
                </span>
              </div>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary">{product.price} جنيه</span>
                <span className="text-sm text-muted-foreground">المخزون: {product.stock}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleOpenDialog(product)}
                >
                  <Pencil className="w-4 h-4 ml-1" />
                  تعديل
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          لا توجد منتجات
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>اسم المنتج *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label>القسم *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: 'seedlings' | 'ready-plants' | 'herbs') => 
                    setFormData(prev => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seedlings">شتلات</SelectItem>
                    <SelectItem value="ready-plants">نباتات جاهزة</SelectItem>
                    <SelectItem value="herbs">أعشاب</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>الوصف</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>السعر (جنيه) *</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label>الوزن</Label>
                <Input
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  className="mt-1"
                  placeholder="مثال: 200 جرام"
                />
              </div>
              <div>
                <Label>المخزون</Label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>رابط الصورة</Label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                className="mt-1"
                placeholder="https://..."
              />
            </div>

            <div>
              <Label>الفوائد (مفصولة بفاصلة)</Label>
              <Input
                value={formData.benefits}
                onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
                className="mt-1"
                placeholder="فائدة 1، فائدة 2، فائدة 3"
              />
            </div>

            <div>
              <Label>طريقة الاستخدام</Label>
              <Textarea
                value={formData.usage}
                onChange={(e) => setFormData(prev => ({ ...prev, usage: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label>الاستشارة الطبية</Label>
              <Textarea
                value={formData.medicalAdvice}
                onChange={(e) => setFormData(prev => ({ ...prev, medicalAdvice: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label>الاستشارة الزراعية</Label>
              <Textarea
                value={formData.agricultureAdvice}
                onChange={(e) => setFormData(prev => ({ ...prev, agricultureAdvice: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label>نصائح الري</Label>
              <Textarea
                value={formData.wateringAdvice}
                onChange={(e) => setFormData(prev => ({ ...prev, wateringAdvice: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                {editingProduct ? 'تحديث المنتج' : 'إضافة المنتج'}
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
