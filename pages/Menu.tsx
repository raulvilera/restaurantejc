import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const Menu = () => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['Todos']);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('name');

        if (catError) throw catError;
        if (catData) {
          setCategories(['Todos', ...catData.map(c => c.name)]);
        }

        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('*');

        if (prodError) throw prodError;
        setMenuItems(prodData || []);
      } catch (err) {
        console.error('Erro ao buscar dados do menu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredItems = activeCategory === 'Todos'
    ? menuItems
    : menuItems.filter(item => {
      // Como não temos a relação direta no products, vamos assumir que categoria vem do banco
      // Ou que o filtro é por nome/descrição para demo. No schema real, products tem category_id
      return true;
    });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex bg-white border border-google-gray-300 p-3 rounded-lg items-center justify-between mb-4 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-google-text-secondary uppercase px-2">Categorias:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${activeCategory === cat
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-google-gray-100 text-google-text-secondary border-google-gray-300 hover:border-primary/50'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-1.5 bg-primary text-white rounded text-sm font-bold shadow-sm hover:bg-primary/90 transition-all flex-shrink-0 ml-4">
          <span className="material-symbols-outlined text-lg">add</span>
          Adicionar Prato
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-google-text-secondary text-sm">Carregando cardápio digital...</div>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full py-20 text-center text-google-text-secondary text-sm">Nenhum prato encontrado nesta categoria.</div>
        ) : filteredItems.map((item) => (
          <div key={item.id} className="looker-card group cursor-pointer overflow-hidden flex flex-col h-full">
            <div className="h-40 overflow-hidden relative border-b border-google-gray-200 bg-google-gray-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-google-gray-300">image</span>
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded">
                R$ {item.price}
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-google-text-primary text-sm line-clamp-1">{item.name}</h3>
                <span className="material-symbols-outlined text-lg text-google-text-secondary hover:text-primary transition-colors">edit</span>
              </div>
              <p className="text-[11px] text-google-text-secondary line-clamp-2 mb-4 flex-1">{item.description || 'Sem descrição disponível para este item.'}</p>

              <div className="flex items-center justify-between border-t border-google-gray-100 pt-3 mt-auto">
                <div className="flex items-center gap-1 text-[10px] font-bold text-google-text-secondary uppercase">
                  <span className={`size-2 rounded-full ${item.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {item.status === 'active' ? 'Disponível' : 'Esgotado'}
                </div>
                <button className="text-red-500 hover:bg-red-50 rounded p-1 transition-colors">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
