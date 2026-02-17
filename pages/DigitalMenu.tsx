
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MenuItem } from '../types';

const DigitalMenu: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('Refeições');
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    const categories = ['Refeições', 'Para Levar', 'Porções', 'Bebidas', 'Sobremesas'];

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('menu_items')
                    .select('*')
                    .eq('active', true)
                    .order('name');

                if (error) throw error;
                setMenuItems(data || []);
            } catch (err) {
                console.error('Erro ao carregar cardápio:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    const itemsByCategory = (category: string) => {
        return menuItems.filter(item => item.category === category);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            {/* Header Image */}
            <div className="relative h-64 w-full">
                <img
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                    alt="JC Restaurantes"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 text-white">
                    <h1 className="text-3xl font-black mb-1 text-white">JC Restaurantes</h1>
                    <p className="text-sm flex items-center gap-1 opacity-90 text-white">
                        <span className="material-symbols-outlined text-sm text-white">location_on</span>
                        Jd das Camélias, São Paulo
                    </p>
                </div>
            </div>

            {/* Categories Horizontal Scroll */}
            <div className="sticky top-0 z-10 bg-white shadow-sm overflow-x-auto no-scrollbar py-4 px-4">
                <div className="flex gap-3 min-w-max">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setActiveCategory(cat);
                                const element = document.getElementById(cat);
                                if (element) {
                                    const offset = 80;
                                    const bodyRect = document.body.getBoundingClientRect().top;
                                    const elementRect = element.getBoundingClientRect().top;
                                    const elementPosition = elementRect - bodyRect;
                                    const offsetPosition = elementPosition - offset;
                                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                                }
                            }}
                            className={`px-6 py-2 rounded-full text-sm font-bold border transition-all ${activeCategory === cat
                                    ? 'bg-red-600 text-white border-red-600'
                                    : 'bg-white text-slate-600 border-slate-200'
                                }`}
                        >
                            <span className={activeCategory === cat ? 'text-white' : 'digital-menu-text-gray'}>{cat}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Content */}
            <div className="px-4 mt-6 space-y-10">
                {categories.map((category) => (
                    <section key={category} id={category} className="space-y-4">
                        <div className="flex items-center gap-2 border-b-2 border-red-500/20 pb-2">
                            <span className="material-symbols-outlined text-red-600">
                                {category === 'Refeições' ? 'restaurant' :
                                    category === 'Para Levar' ? 'takeout_dining' :
                                        category === 'Porções' ? 'bakery_dining' :
                                            category === 'Bebidas' ? 'local_bar' : 'icecream'}
                            </span>
                            <h2 className="text-xl font-black digital-menu-text-dark">
                                {category} {category === 'Refeições' ? '(Meals)' :
                                    category === 'Para Levar' ? '(Takeaway)' :
                                        category === 'Porções' ? '(Sides)' :
                                            category === 'Bebidas' ? '(Drinks)' : ''}
                            </h2>
                        </div>

                        <div className="space-y-6">
                            {itemsByCategory(category).length > 0 ? (
                                itemsByCategory(category).map((item) => (
                                    <div key={item.id} className="flex justify-between gap-4 group">
                                        <div className="flex-1">
                                            <h3 className="font-bold digital-menu-text-dark text-lg leading-tight">{item.name}</h3>
                                            <p className="text-xs digital-menu-text-gray mt-1 font-medium">{item.description}</p>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <span className="digital-menu-text-red font-black text-lg">
                                                {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm digital-menu-text-gray italic">Nenhum item nesta categoria.</p>
                            )}
                        </div>
                    </section>
                ))}
            </div>

            {/* Footer Info */}
            <div className="mt-20 bg-slate-900 text-white p-10 pb-40">
                <h2 className="text-xl font-black text-red-600 text-center mb-6">JC Restaurantes</h2>
                <div className="space-y-6 max-w-sm mx-auto">
                    <div className="flex items-start gap-4">
                        <div className="bg-red-600/10 p-3 rounded-xl border border-red-600/20">
                            <span className="material-symbols-outlined text-red-600">call</span>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Contatos</p>
                            <p className="text-lg font-bold text-white">(11) 5197-0399</p>
                            <p className="text-lg font-bold text-white">(11) 99784-9852</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-red-600/10 p-3 rounded-xl border border-red-600/20">
                            <span className="material-symbols-outlined text-red-600">location_on</span>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Endereço</p>
                            <p className="text-sm font-medium leading-relaxed text-white">
                                Av. Laranja da China 275 - Jd das Camélias
                            </p>
                        </div>
                    </div>
                </div>
                <p className="mt-12 text-center text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    © 2024 JC Restaurantes. Todos os direitos reservados.
                </p>
            </div>

            {/* Floating Cart Button */}
            <button className="fixed bottom-24 right-4 bg-red-600 text-white p-4 rounded-full shadow-2xl z-50 transform transition-transform active:scale-95 border-4 border-white">
                <span className="material-symbols-outlined text-3xl text-white">shopping_cart</span>
            </button>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-10 py-4 flex justify-between items-center z-40">
                <button className="flex flex-col items-center gap-1 text-red-600">
                    <span className="material-symbols-outlined fill text-2xl text-red-600">menu_book</span>
                    <span className="text-[10px] font-black uppercase text-red-600">Cardápio</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-red-400 transition-colors">
                    <span className="material-symbols-outlined text-2xl digital-menu-text-gray">map</span>
                    <span className="text-[10px] font-black uppercase digital-menu-text-gray">Mapa</span>
                </button>
            </div>
        </div>
    );
};

export default DigitalMenu;
