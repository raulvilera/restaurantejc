import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItem } from '../types';
import { supabase } from '../lib/supabase';

const Dashboard = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Refeições', 'Para Levar']);
  const [activeFilter, setActiveFilter] = useState('Todos');

  const categories = ['Refeições', 'Para Levar', 'Porções', 'Bebidas', 'Cervejas', 'Caipirinhas', 'Sobremesas', 'Doses'];

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('active', true)
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

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredCategories = activeFilter === 'Todos'
    ? categories
    : [activeFilter];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700 max-w-4xl mx-auto">
      {/* Banner de Destaque */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 to-pink-600 p-8 shadow-xl shadow-rose-500/20 group">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-3 text-center md:text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Novidade agora temos</p>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tighter">
              ALMOÇO E <br />
              <span className="text-emerald-300">JANTA</span>
            </h1>
            <p className="text-sm font-bold text-white/90">Sabor caseiro todo dia na sua mesa.</p>
          </div>
          <div className="relative size-32 md:size-40 flex items-center justify-center bg-white/10 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-7xl text-white opacity-90">restaurant</span>
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-rose-600 text-xs font-black p-2 rounded-full shadow-lg rotate-12">TOP</div>
          </div>
        </div>
        {/* Decorativo */}
        <div className="absolute -bottom-10 -right-10 size-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 -left-10 size-48 bg-rose-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Filtros de Categorias */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 px-1">
        <button
          onClick={() => setActiveFilter('Todos')}
          className={`px-6 py-2.5 rounded-full text-xs font-black transition-all whitespace-nowrap border-2 ${activeFilter === 'Todos'
              ? 'bg-white text-rose-500 border-white shadow-lg'
              : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
            }`}
        >
          Todos
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-6 py-2.5 rounded-full text-xs font-black transition-all whitespace-nowrap border-2 ${activeFilter === cat
                ? 'bg-white text-rose-500 border-white shadow-lg'
                : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Listagem com Dropdowns */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center space-y-4">
            <div className="size-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-black uppercase text-white/50 tracking-widest">Carregando cardápio...</p>
          </div>
        ) : (
          filteredCategories.map(cat => {
            const items = menuItems.filter(i => i.category === cat);
            if (items.length === 0 && activeFilter !== 'Todos') return null;
            if (items.length === 0) return null;

            const isExpanded = expandedCategories.includes(cat);

            return (
              <div key={cat} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden transition-all duration-300">
                <button
                  onClick={() => toggleCategory(cat)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-rose-500 flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm text-white fill">local_fire_department</span>
                    </div>
                    <h3 className="text-lg font-black tracking-tight">{cat}</h3>
                  </div>
                  <span className={`material-symbols-outlined transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-300">
                    {items.map(item => (
                      <div key={item.id} className="group bg-white/5 hover:bg-white/10 p-3 rounded-2xl flex items-center gap-4 border border-white/5 transition-all active:scale-[0.98]">
                        <div className="size-20 rounded-xl overflow-hidden bg-white/10 flex-shrink-0 relative">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="font-black text-sm truncate uppercase tracking-tight">{item.name}</h4>
                          </div>
                          <p className="text-[10px] text-white/60 font-bold line-clamp-2 mt-0.5">{item.description || 'Sabor irresistível preparado na hora.'}</p>
                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-xs font-black text-emerald-400">R$</span>
                            <span className="text-lg font-black text-emerald-400 leading-none">{Number(item.price).toFixed(2)}</span>
                          </div>
                        </div>
                        <button className="size-10 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/20 active:scale-90 transition-all">
                          <span className="material-symbols-outlined font-black">add</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Rodapé de Contato */}
      <div className="mt-12 p-8 bg-slate-900/50 rounded-3xl border border-white/10 space-y-6">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-500">location_on</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Endereço</p>
              <p className="text-sm font-black">Av. Laranja da China 275 - JD das Camélias</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-500">call</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Fale Conosco</p>
              <div className="flex flex-col">
                <p className="text-sm font-black">5197-0399</p>
                <p className="text-sm font-black text-emerald-400 flex items-center gap-1">
                  99784-9852
                  <span className="material-symbols-outlined text-xs">chat</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
