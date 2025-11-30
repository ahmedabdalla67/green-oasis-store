import { useState } from 'react';
import { Eye, Search, Mail, Phone, MessageSquare } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Consultation } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

const statusLabels: Record<Consultation['status'], string> = {
  new: 'جديدة',
  read: 'تمت القراءة',
  replied: 'تم الرد',
};

const statusColors: Record<Consultation['status'], string> = {
  new: 'bg-warning text-warning-foreground',
  read: 'bg-accent text-accent-foreground',
  replied: 'bg-success text-success-foreground',
};

const subjectLabels: Record<string, string> = {
  agriculture: 'استشارة زراعية',
  medical: 'استشارة طبية',
  watering: 'استشارة ري',
  general: 'استفسار عام',
};

export function AdminConsultations() {
  const { consultations, updateConsultationStatus, products } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.name.includes(searchQuery) || 
                          consultation.phone.includes(searchQuery) ||
                          consultation.message.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, status: Consultation['status']) => {
    updateConsultationStatus(id, status);
    toast({ title: 'تم تحديث حالة الاستشارة' });
  };

  const handleViewConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    if (consultation.status === 'new') {
      handleStatusChange(consultation.id, 'read');
    }
  };

  const getProductName = (productId?: string) => {
    if (!productId || productId === 'none') return null;
    const product = products.find(p => p.id === productId);
    return product?.name;
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {consultations.filter(c => c.status === 'new').length}
              </p>
              <p className="text-sm text-muted-foreground">استشارات جديدة</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {consultations.filter(c => c.status === 'read').length}
              </p>
              <p className="text-sm text-muted-foreground">تمت القراءة</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {consultations.filter(c => c.status === 'replied').length}
              </p>
              <p className="text-sm text-muted-foreground">تم الرد</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="البحث..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="new">جديدة</SelectItem>
            <SelectItem value="read">تمت القراءة</SelectItem>
            <SelectItem value="replied">تم الرد</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Consultations List */}
      <div className="space-y-4">
        {filteredConsultations.map((consultation) => (
          <div 
            key={consultation.id} 
            className={`bg-card rounded-xl border p-5 cursor-pointer transition-colors hover:border-primary ${
              consultation.status === 'new' ? 'border-warning' : 'border-border'
            }`}
            onClick={() => handleViewConsultation(consultation)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-bold">{consultation.name}</h4>
                  <Badge className={statusColors[consultation.status]}>
                    {statusLabels[consultation.status]}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {subjectLabels[consultation.subject] || consultation.subject}
                </p>
                <p className="text-foreground line-clamp-2">{consultation.message}</p>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={consultation.status}
                  onValueChange={(value: Consultation['status']) => {
                    handleStatusChange(consultation.id, value);
                  }}
                >
                  <SelectTrigger className="w-36" onClick={(e) => e.stopPropagation()}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">جديدة</SelectItem>
                    <SelectItem value="read">تمت القراءة</SelectItem>
                    <SelectItem value="replied">تم الرد</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredConsultations.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          لا توجد استشارات
        </div>
      )}

      {/* Consultation Details Dialog */}
      <Dialog open={!!selectedConsultation} onOpenChange={() => setSelectedConsultation(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>تفاصيل الاستشارة</DialogTitle>
          </DialogHeader>

          {selectedConsultation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">الاسم</p>
                  <p className="font-medium">{selectedConsultation.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">نوع الاستشارة</p>
                  <p className="font-medium">
                    {subjectLabels[selectedConsultation.subject] || selectedConsultation.subject}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href={`tel:${selectedConsultation.phone}`}
                    className="text-primary hover:underline"
                  >
                    {selectedConsultation.phone}
                  </a>
                </div>
                {selectedConsultation.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a 
                      href={`mailto:${selectedConsultation.email}`}
                      className="text-primary hover:underline"
                    >
                      {selectedConsultation.email}
                    </a>
                  </div>
                )}
              </div>

              {getProductName(selectedConsultation.productId) && (
                <div>
                  <p className="text-sm text-muted-foreground">المنتج المتعلق</p>
                  <p className="font-medium">{getProductName(selectedConsultation.productId)}</p>
                </div>
              )}

              <hr className="border-border" />

              <div>
                <p className="text-sm text-muted-foreground mb-2">الرسالة</p>
                <div className="bg-secondary p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedConsultation.message}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <a 
                  href={`tel:${selectedConsultation.phone}`}
                  className="flex-1"
                >
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <Phone className="w-4 h-4 ml-2" />
                    اتصال
                  </Button>
                </a>
                {selectedConsultation.email && (
                  <a 
                    href={`mailto:${selectedConsultation.email}`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full">
                      <Mail className="w-4 h-4 ml-2" />
                      إرسال إيميل
                    </Button>
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
