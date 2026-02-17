
import React, { useState, useEffect } from 'react';
import { Customer } from '../types';
import { supabase } from '../lib/supabase';

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Partial<Customer> | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    contact: '',
    initials: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      let query = supabase.from('customers').select('*');

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data, error } = await query.order('name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSave = async () => {
    try {
      const customerData = {
        ...formData,
        initials: formData.name ? formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : ''
      };

      if (editingCustomer?.id) {
        const { error } = await supabase
          .from('customers')
          .update(customerData)
          .eq('id', editingCustomer.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('customers')
          .insert([customerData]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      setEditingCustomer(null);
      setFormData({ name: '', contact: '' });
      fetchCustomers();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Erro ao salvar cliente.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este cliente?')) return;
    try {
      const { error } = await supabase.from('customers').delete().eq('id', id);
      if (error) throw error;
      fetchCustomers();
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestão de Clientes</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Visualize e gerencie a base de clientes do seu restaurante.</p>
        </div>
        <button
          onClick={() => {
            setEditingCustomer(null);
            setFormData({ name: '', contact: '' });
            setIsModalOpen(true);
          }}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          Adicionar Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Clientes', value: '1.240', trend: '12%', up: true },
          { label: 'Ticket Médio', value: 'R$ 85,50', trend: '5%', up: true },
          { label: 'Novos (Mês)', value: '48', trend: 'Estável', up: null },
          { label: 'Fidelidade Média', value: '4.2', trend: 'pedidos', up: null },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-black">{stat.value}</span>
              {stat.trend && (
                <span className={`text-[10px] font-bold mb-1 ${stat.up === true ? 'text-emerald-500' : stat.up === false ? 'text-red-500' : 'text-slate-400'}`}>
                  {stat.up !== null && <span className="material-symbols-outlined text-xs align-middle">{stat.up ? 'trending_up' : 'trending_down'}</span>} {stat.trend}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 flex flex-col md:flex-row gap-4 border-b border-slate-100 dark:border-border-dark">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-background-dark border-none rounded-lg focus:ring-2 focus:ring-primary text-sm placeholder:text-slate-500 transition-all"
              placeholder="Buscar por nome ou contato..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg border border-slate-200 dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-xs font-bold transition-all">
              <span className="material-symbols-outlined text-lg">filter_list</span> Filtrar
            </button>
            <button className="px-4 py-2 rounded-lg border border-slate-200 dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-xs font-bold transition-all">
              <span className="material-symbols-outlined text-lg">file_download</span> Exportar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-border-dark bg-slate-50 dark:bg-background-dark/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contato</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Último Pedido</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Total Gasto</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-dark">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500 font-bold">Carregando clientes...</td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500 font-bold">Nenhum cliente encontrado.</td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-primary/5 transition-colors cursor-pointer group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">{c.initials}</div>
                        <span className="font-bold text-sm">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{c.contact}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-center">{c.last_order || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[11px] font-bold">R$ {Number(c.total_spent || 0).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingCustomer(c);
                            setFormData(c);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 hover:bg-primary/10 rounded-lg text-slate-400 hover:text-primary transition-colors" title="Editar"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-500 transition-colors" title="Excluir"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 dark:border-border-dark flex items-center justify-between bg-slate-50 dark:bg-background-dark/30">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Mostrando {customers.length} clientes</span>
          <div className="flex gap-2">
            <button className="size-8 rounded border border-slate-200 dark:border-border-dark flex items-center justify-center text-slate-400 hover:bg-primary/5 hover:text-primary transition-all disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button className="size-8 rounded border border-primary/20 bg-primary text-white flex items-center justify-center text-xs font-bold shadow-sm">1</button>
            <button className="size-8 rounded border border-slate-200 dark:border-border-dark flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-primary/5">2</button>
            <button className="size-8 rounded border border-slate-200 dark:border-border-dark flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-primary/5">3</button>
            <button className="size-8 rounded border border-slate-200 dark:border-border-dark flex items-center justify-center text-slate-400 hover:bg-primary/5 hover:text-primary transition-all">
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
      {/* Modal de Cliente */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-surface-dark shadow-2xl z-[110] flex flex-col border-l border-slate-200 dark:border-border-dark animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-200 dark:border-border-dark flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary fill">{editingCustomer ? 'edit_note' : 'person_add'}</span>
                {editingCustomer ? 'Editar Cliente' : 'Novo Cliente'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nome Completo</label>
                <input
                  className="w-full bg-slate-100 dark:bg-background-dark border-slate-200 dark:border-border-dark rounded-lg px-4 py-3 text-sm focus:ring-primary transition-all"
                  placeholder="Ex: João da Silva"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Contato (WhatsApp/Telefone)</label>
                <input
                  className="w-full bg-slate-100 dark:bg-background-dark border-slate-200 dark:border-border-dark rounded-lg px-4 py-3 text-sm focus:ring-primary transition-all"
                  placeholder="Ex: (11) 99999-9999"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-border-dark flex gap-3 bg-slate-50 dark:bg-background-dark/30">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-slate-200 dark:bg-surface-dark text-slate-500 font-bold py-3 rounded-lg hover:bg-slate-300 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Salvar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Customers;
