import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ShippingZone, Order, Consultation } from '@/types';
import { initialProducts, initialShippingZones } from '@/data/initialData';
import { apiRequest } from '@/lib/api';

interface DataContextType {
  products: Product[];
  shippingZones: ShippingZone[];
  orders: Order[];
  consultations: Consultation[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addShippingZone: (zone: Omit<ShippingZone, 'id'>) => void;
  updateShippingZone: (id: string, zone: Partial<ShippingZone>) => void;
  deleteShippingZone: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  addConsultation: (consultation: Omit<Consultation, 'id' | 'createdAt' | 'status'>) => void;
  updateConsultationStatus: (id: string, status: Consultation['status']) => void;
  getProductById: (id: string) => Product | undefined;
  getShippingCost: (governorate: string) => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper functions to extract customer info from shippingAddress
// Format: "CustomerName | Phone | Area\nAddress"
const extractCustomerName = (address: string): string => {
  if (!address) return '';
  const parts = address.split('|');
  return parts[0]?.trim() || '';
};

const extractPhone = (address: string): string => {
  if (!address) return '';
  const parts = address.split('|');
  return parts[1]?.trim() || '';
};

const extractArea = (address: string): string => {
  if (!address) return '';
  const parts = address.split('|');
  const areaPart = parts[2]?.split('\n')[0];
  return areaPart?.trim() || '';
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, shippingData] = await Promise.all([
          apiRequest('/products'),
          apiRequest('/shipping-zones')
        ]);

        // Transform backend products to frontend format
        const transformedProducts = productsData.map((p: any) => ({
          ...p,
          image: p.imageUrl || '',
          stock: p.availableStock || 0,
          price: Number(p.price) || 0,
          weight: Number(p.weight) || 0,
          benefits: p.benefits || [],
          usage: p.usage || '',
          medicalAdvice: p.medicalAdvice || '',
          agricultureAdvice: p.agricultureAdvice || '',
          wateringAdvice: p.wateringAdvice || '',
        }));
        setProducts(transformedProducts);
        setShippingZones(shippingData);

        // Fetch orders - try admin endpoint first, fallback to user orders
        // Note: In a real app, this should probably be in a separate AdminDataProvider or similar
        try {
          // Try admin orders first (will fail if not admin)
          const ordersData = await apiRequest('/orders/all');
          // Transform backend format to frontend format
          const transformedOrders = ordersData.map((order: any) => ({
            id: order.id,
            customerName: order.user?.name || extractCustomerName(order.shippingAddress) || 'Guest',
            phone: order.user?.phone || extractPhone(order.shippingAddress) || '',
            address: order.shippingAddress || '',
            governorate: order.governorate || '',
            area: extractArea(order.shippingAddress) || '',
            items: order.items?.map((item: any) => ({
              product: item.product,
              quantity: item.quantity
            })) || [],
            totalAmount: Number(order.totalPrice) || 0,
            shippingCost: Number(order.deliveryCost) || 0,
            paymentMethod: order.paymentMethod || 'cash',
            status: order.status || 'pending',
            createdAt: new Date(order.createdAt),
          }));
          setOrders(transformedOrders);
        } catch (e) {
          console.log('Could not fetch admin orders, trying user orders');
          try {
            const ordersData = await apiRequest('/orders/my-orders');
            setOrders(ordersData);
          } catch (e2) {
            // Ignore auth error for public users
          }
        }

      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };
    fetchData();
  }, []);

  // Sync Consultations to LocalStorage (as it's not on backend yet)
  useEffect(() => {
    const saved = localStorage.getItem('consultations');
    if (saved) setConsultations(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('consultations', JSON.stringify(consultations));
  }, [consultations]);


  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      // Transform frontend field names to backend field names
      const backendData = {
        name: product.name,
        category: product.category,
        description: product.description || '',
        price: Number(product.price) || 0,
        weight: Number(product.weight) || 0,
        availableStock: Number(product.availableStock || product.stock) || 0,
        imageUrl: product.imageUrl || product.image || '',
      };

      console.log('Sending product data to backend:', backendData);

      const newProduct = await apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(backendData)
      });

      // Transform backend response to frontend format
      const transformedProduct: Product = {
        ...newProduct,
        image: newProduct.imageUrl || '',
        stock: newProduct.availableStock || 0,
        price: Number(newProduct.price) || 0,
        weight: Number(newProduct.weight) || 0,
      };

      setProducts(prev => [...prev, transformedProduct]);
      console.log('Product added successfully:', transformedProduct);
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      // Transform frontend field names to backend field names
      const backendData: Record<string, unknown> = {};
      if (product.name) backendData.name = product.name;
      if (product.category) backendData.category = product.category;
      if (product.description !== undefined) backendData.description = product.description;
      if (product.price !== undefined) backendData.price = Number(product.price);
      if (product.weight !== undefined) backendData.weight = Number(product.weight);
      if (product.availableStock !== undefined || product.stock !== undefined) {
        backendData.availableStock = Number(product.availableStock || product.stock) || 0;
      }
      if (product.imageUrl || product.image) {
        backendData.imageUrl = product.imageUrl || product.image || '';
      }

      console.log('Updating product with data:', backendData);

      const updatedProduct = await apiRequest(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(backendData)
      });

      // Transform backend response to frontend format
      const transformedProduct: Product = {
        ...updatedProduct,
        image: updatedProduct.imageUrl || '',
        stock: updatedProduct.availableStock || 0,
        price: Number(updatedProduct.price) || 0,
        weight: Number(updatedProduct.weight) || 0,
      };

      setProducts(prev => prev.map(p => (p.id === id ? transformedProduct : p)));
      console.log('Product updated successfully:', transformedProduct);
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await apiRequest(`/products/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== id));
      console.log('Product deleted successfully:', id);
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  };

  const addShippingZone = async (zone: Omit<ShippingZone, 'id'>) => {
    try {
      const newZone = await apiRequest('/shipping-zones', {
        method: 'POST',
        body: JSON.stringify(zone)
      });
      setShippingZones(prev => [...prev, newZone]);
    } catch (error) {
      console.error('Failed to add shipping zone', error);
      throw error;
    }
  };

  const updateShippingZone = async (id: string, zone: Partial<ShippingZone>) => {
    try {
      const updatedZone = await apiRequest(`/shipping-zones/${id}`, {
        method: 'PUT',
        body: JSON.stringify(zone)
      });
      setShippingZones(prev => prev.map(z => (z.id === id ? updatedZone : z)));
    } catch (error) {
      console.error('Failed to update shipping zone', error);
      throw error;
    }
  };

  const deleteShippingZone = async (id: string) => {
    try {
      await apiRequest(`/shipping-zones/${id}`, { method: 'DELETE' });
      setShippingZones(prev => prev.filter(z => z.id !== id));
      console.log('Shipping zone deleted successfully:', id);
    } catch (error) {
      console.error('Failed to delete shipping zone:', error);
      throw error;
    }
  };

  const addOrder = async (order: Omit<Order, 'id' | 'createdAt'>) => {
    try {
      const newOrder = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(order)
      });
      setOrders(prev => [...prev, newOrder]);
    } catch (error) {
      console.error('Failed to add order', error);
      throw error;
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      // Endpoint might differ slightly, checking routes: router.put('/:id/status', ... updateOrderStatus);
      const updatedOrder = await apiRequest(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      setOrders(prev => prev.map(o => (o.id === id ? updatedOrder : o)));
    } catch (error) {
      console.error('Failed to update order status', error);
      throw error;
    }
  };

  const addConsultation = (consultation: Omit<Consultation, 'id' | 'createdAt' | 'status'>) => {
    const newConsultation = {
      ...consultation,
      id: Math.random().toString(36).substr(2, 9),
      status: 'new' as const,
      createdAt: new Date(),
    };
    setConsultations(prev => [...prev, newConsultation]);
  };

  const updateConsultationStatus = (id: string, status: Consultation['status']) => {
    setConsultations(prev =>
      prev.map(c => (c.id === id ? { ...c, status } : c))
    );
  };

  const getProductById = (id: string) => products.find(p => p.id === id);

  const getShippingCost = (governorate: string) => {
    const zone = shippingZones.find(z => z.governorate === governorate);
    return zone?.shippingCost || 50;
  };

  return (
    <DataContext.Provider
      value={{
        products,
        shippingZones,
        orders,
        consultations,
        addProduct,
        updateProduct,
        deleteProduct,
        addShippingZone,
        updateShippingZone,
        deleteShippingZone,
        addOrder,
        updateOrderStatus,
        addConsultation,
        updateConsultationStatus,
        getProductById,
        getShippingCost,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
