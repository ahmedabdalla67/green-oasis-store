import { useState } from 'react';
import { Eye, Search } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

const statusLabels: Record<Order['status'], string> = {
  pending: 'قيد الانتظار',
  processing: 'قيد التجهيز',
  shipped: 'تم الشحن',
  delivered: 'تم التوصيل',
};

const statusColors: Record<Order['status'], string> = {
  pending: 'bg-warning text-warning-foreground',
  processing: 'bg-accent text-accent-foreground',
  shipped: 'bg-primary text-primary-foreground',
  delivered: 'bg-success text-success-foreground',
};

export function AdminOrders() {
  const { orders, updateOrderStatus } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.includes(searchQuery) || 
                          order.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
    toast({ title: 'تم تحديث حالة الطلب' });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="البحث بالاسم أو الهاتف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="حالة الطلب" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="pending">قيد الانتظار</SelectItem>
            <SelectItem value="processing">قيد التجهيز</SelectItem>
            <SelectItem value="shipped">تم الشحن</SelectItem>
            <SelectItem value="delivered">تم التوصيل</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-4 py-3 text-right font-medium">العميل</th>
                <th className="px-4 py-3 text-right font-medium">الهاتف</th>
                <th className="px-4 py-3 text-right font-medium">المنطقة</th>
                <th className="px-4 py-3 text-right font-medium">الإجمالي</th>
                <th className="px-4 py-3 text-right font-medium">الدفع</th>
                <th className="px-4 py-3 text-right font-medium">الحالة</th>
                <th className="px-4 py-3 text-right font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t border-border">
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{order.phone}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {order.governorate} - {order.area}
                  </td>
                  <td className="px-4 py-3 font-bold text-primary">{order.totalAmount} جنيه</td>
                  <td className="px-4 py-3">
                    {order.paymentMethod === 'cash' ? 'كاش' : 'فودافون كاش'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={statusColors[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Select
                        value={order.status}
                        onValueChange={(value: Order['status']) => 
                          handleStatusChange(order.id, value)
                        }
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">قيد الانتظار</SelectItem>
                          <SelectItem value="processing">قيد التجهيز</SelectItem>
                          <SelectItem value="shipped">تم الشحن</SelectItem>
                          <SelectItem value="delivered">تم التوصيل</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            لا توجد طلبات
          </div>
        )}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>تفاصيل الطلب</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">العميل</p>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الهاتف</p>
                  <p className="font-medium">{selectedOrder.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">العنوان</p>
                  <p className="font-medium">{selectedOrder.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.governorate} - {selectedOrder.area}
                  </p>
                </div>
              </div>

              <hr className="border-border" />

              <div>
                <p className="text-sm text-muted-foreground mb-2">المنتجات</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.product.id} className="flex justify-between">
                      <span>{item.product.name} × {item.quantity}</span>
                      <span className="font-medium">{item.product.price * item.quantity} جنيه</span>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-border" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الشحن</span>
                  <span>{selectedOrder.shippingCost} جنيه</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>الإجمالي</span>
                  <span className="text-primary">{selectedOrder.totalAmount} جنيه</span>
                </div>
              </div>

              <div className="bg-secondary p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">طريقة الدفع</p>
                <p className="font-medium">
                  {selectedOrder.paymentMethod === 'cash' ? 'الدفع عند الاستلام' : 'فودافون كاش'}
                </p>
                {selectedOrder.vodafoneNumber && (
                  <p className="text-sm mt-1">رقم التحويل: {selectedOrder.vodafoneNumber}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
