
export enum OrderStatus {
  PENDING = 'PENDENTE',
  PREPARING = 'EM PREPARO',
  COMPLETED = 'CONCLUÍDO',
  CANCELLED = 'CANCELADO'
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  active: boolean;
  image?: string;
  dietary?: string[];
}

export interface Customer {
  id: string;
  name: string;
  contact: string;
  last_order: string;
  total_spent: number;
  initials: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_initial: string;
  items: string;
  total: number;
  status: OrderStatus;
  order_time: string;
}

export interface Metric {
  label: string;
  value: string | number;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
  icon: string;
}
