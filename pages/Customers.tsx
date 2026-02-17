
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const Customers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    avgTicket: 0,
    newThisMonth: 0
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('orders')
          .select('customer_name, customer_phone, total, created_at');

        if (error) throw error;

        // Agrupar por nome do cliente
        const customerMap: Record<string, any> = {};
        let totalSales = 0;
        let orderCount = 0;

        data?.forEach(order => {
          const name = order.customer_name || 'Anônimo';
          if (!customerMap[name]) {
            customerMap[name] = {
              name,
              contact: order.customer_phone || 'N/A',
              lastOrder: order.created_at,
              totalSpent: 0,
              initials: name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
              orderCount: 0
            };
          }
          customerMap[name].totalSpent += Number(order.total);
          customerMap[name].orderCount += 1;
          if (new Date(order.created_at) > new Date(customerMap[name].lastOrder)) {
            customerMap[name].lastOrder = order.created_at;
          }
          totalSales += Number(order.total);
          orderCount += 1;
        });

        const customerList = Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent);
        setCustomers(customerList);
        setStats({
          total: customerList.length,
          avgTicket: orderCount > 0 ? totalSales / orderCount : 0,
          newThisMonth: 0 // Simplificado
        });

      } catch (err) {
        console.error('Erro ao buscar clientes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestão de Clientes</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Base de dados gerada automaticamente a partir dos pedidos realizados.</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-lg">person_add</span>
          Adicionar Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Clientes', value: stats.total, trend: 'Gerado via Pedidos', up: null },
          { label: 'Ticket Médio', value: formatCurrency(stats.avgTicket), trend: 'Média Geral', up: null },
          { label: 'Total Gasto Base', value: formatCurrency(customers.reduce((acc, c) => acc + c.totalSpent, 0)), trend: 'Soma de Pedidos', up: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-end gap-2 text-primary">
              <span className="text-2xl font-black">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-border-dark bg-slate-50 dark:bg-background-dark/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contato</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Última Visita</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Total Acumulado</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-dark">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">Carregando clientes...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">Nenhum cliente com pedidos registrados.</td></tr>
              ) : customers.map((c, idx) => (
                <tr key={idx} className="hover:bg-primary/5 transition-colors cursor-pointer group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">{c.initials}</div>
                      <span className="font-bold text-sm">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{c.contact}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-center">{new Date(c.lastOrder).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[11px] font-bold">{formatCurrency(c.totalSpent)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-primary/10 rounded-lg text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">visibility</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
