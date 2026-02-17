
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItem } from '../types';
import { supabase } from '../lib/supabase';

const Menu = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Todos');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state for new/edit item
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    description: '',
    category: 'Refeições',
    active: true,
    image: 'https://picsum.photos/seed/food/400/300'
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['Todos', 'Refeições', 'Porções', 'Bebidas', 'Sobremesas'];

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('name');

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error('Erro ao buscar menu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleSave = async () => {
    try {
      if (editingId) {
        const { error } = await supabase
          .from('menu_items')
          .update(formData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('menu_items')
          .insert([formData]);
        if (error) throw error;
      }

      setIsDrawerOpen(false);
      setEditingId(null);
      setFormData({
        name: '',
        price: 0,
        description: '',
        category: 'Refeições',
        active: true,
        image: 'https://picsum.photos/seed/food/400/300'
      });
      fetchMenuItems();
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      alert('Erro ao salvar item. Verifique o console.');
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setFormData(item);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este prato?')) return;

    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchMenuItems();
    } catch (error) {
      console.error('Erro ao excluir item:', error);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesTab = activeTab === 'Todos' || item.category === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500 relative min-h-[calc(100vh-160px)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Gestão do Menu</h1>
          <p className="text-slate-500 mt-1">Gerencie os pratos, categorias e visibilidade do seu cardápio.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              name: '',
              price: 0,
              description: '',
              category: 'Refeições',
              active: true,
              image: 'https://picsum.photos/seed/food/400/300'
            });
            setIsDrawerOpen(true);
          }}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Adicionar Novo Prato
        </button>
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Novo Pedido
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary text-sm placeholder:text-slate-500 transition-all"
            placeholder="Buscar prato pelo nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4 border-b border-slate-200 dark:border-border-dark pb-4 overflow-x-auto no-scrollbar whitespace-nowrap flex-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeTab === cat
                ? 'bg-primary text-white shadow-md'
                : 'bg-slate-200/50 dark:bg-surface-dark text-slate-500 hover:bg-slate-200'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-500 font-bold">Carregando cardápio...</div>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-500 font-bold">Nenhum prato encontrado.</div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white dark:bg-surface-dark rounded-xl overflow-hidden border border-slate-200 dark:border-border-dark hover:border-primary/50 transition-all group shadow-sm ${!item.active ? 'opacity-70 grayscale' : ''}`}
            >
              <div className="h-48 relative overflow-hidden bg-slate-200 dark:bg-background-dark">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                <span className={`absolute top-3 left-3 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded shadow-sm ${item.active ? 'bg-emerald-500/90' : 'bg-slate-500/90'}`}>
                  {item.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{item.name}</h3>
                  <span className="text-primary font-black">R$ {Number(item.price).toFixed(2)}</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 min-h-[2rem]">{item.description}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold border border-slate-200 dark:border-border-dark rounded-lg hover:bg-slate-50 dark:hover:bg-background-dark transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-red-400 border border-red-400/20 rounded-lg hover:bg-red-400/10 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span> Excluir
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Dish Drawer */}
      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-surface-dark shadow-2xl z-[110] flex flex-col border-l border-slate-200 dark:border-border-dark animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-200 dark:border-border-dark flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary fill">add_circle</span>
                Novo Prato
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Imagem do Prato</label>
                <div className="border-2 border-dashed border-slate-200 dark:border-border-dark rounded-xl p-8 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group bg-slate-50 dark:bg-background-dark/50">
                  <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-primary">upload_file</span>
                  <p className="text-xs font-medium text-slate-400">Arraste ou clique para enviar</p>
                  <input
                    type="text"
                    className="w-full mt-2 bg-white/50 dark:bg-background-dark border-slate-200 dark:border-border-dark rounded px-2 py-1 text-[10px]"
                    placeholder="URL da imagem..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nome do Prato</label>
                <input
                  className="w-full bg-slate-100 dark:bg-background-dark border-slate-200 dark:border-border-dark rounded-lg px-4 py-3 text-sm focus:ring-primary transition-all"
                  placeholder="Ex: Risoto de Alho Poró"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Preço (R$)</label>
                  <input
                    className="w-full bg-slate-100 dark:bg-background-dark border-slate-200 dark:border-border-dark rounded-lg px-4 py-3 text-sm focus:ring-primary transition-all"
                    type="number"
                    placeholder="0,00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Categoria</label>
                  <select
                    className="w-full bg-slate-100 dark:bg-background-dark border-slate-200 dark:border-border-dark rounded-lg px-4 py-3 text-sm focus:ring-primary transition-all"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Descrição</label>
                <textarea
                  rows={3}
                  className="w-full bg-slate-100 dark:bg-background-dark border-slate-200 dark:border-border-dark rounded-lg px-4 py-3 text-sm focus:ring-primary transition-all"
                  placeholder="Descreva os ingredientes..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between py-4 border-t border-b border-slate-200 dark:border-border-dark">
                <div>
                  <p className="text-sm font-bold">Disponível no Cardápio</p>
                  <p className="text-[10px] text-slate-500">O prato aparecerá para os clientes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-border-dark flex gap-3 bg-slate-50 dark:bg-background-dark/30">
              <button
                onClick={() => setIsDrawerOpen(false)}
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

export default Menu;
