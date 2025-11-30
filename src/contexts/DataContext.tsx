import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ShippingZone, Order, Consultation } from '@/types';
import { initialProducts, initialShippingZones } from '@/data/initialData';

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

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [shippingZones, setShippingZones] = useState<ShippingZone[]>(() => {
    const saved = localStorage.getItem('shippingZones');
    return saved ? JSON.parse(saved) : initialShippingZones;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [consultations, setConsultations] = useState<Consultation[]>(() => {
    const saved = localStorage.getItem('consultations');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('shippingZones', JSON.stringify(shippingZones));
  }, [shippingZones]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('consultations', JSON.stringify(consultations));
  }, [consultations]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: generateId() };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...product } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addShippingZone = (zone: Omit<ShippingZone, 'id'>) => {
    const newZone = { ...zone, id: generateId() };
    setShippingZones(prev => [...prev, newZone]);
  };

  const updateShippingZone = (id: string, zone: Partial<ShippingZone>) => {
    setShippingZones(prev =>
      prev.map(z => (z.id === id ? { ...z, ...zone } : z))
    );
  };

  const deleteShippingZone = (id: string) => {
    setShippingZones(prev => prev.filter(z => z.id !== id));
  };

  const addOrder = (order: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder = {
      ...order,
      id: generateId(),
      createdAt: new Date(),
    };
    setOrders(prev => [...prev, newOrder]);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, status } : o))
    );
  };

  const addConsultation = (consultation: Omit<Consultation, 'id' | 'createdAt' | 'status'>) => {
    const newConsultation = {
      ...consultation,
      id: generateId(),
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
