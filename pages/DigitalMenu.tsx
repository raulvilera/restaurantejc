
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

    const handleCategoryClick = (cat: string) => {
        setActiveCategory(cat);
        const element = document.getElementById(cat);
        if (element) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
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
            {/* Header Banner - Bistrô/Self-Service Style */}
            <div className="relative h-[450px] w-full">
                <img
                    src="https://images.unsplash.com/photo-1543353071-873f17a7a088?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                    alt="JC Restaurantes - Self Service"
                    className="w-full h-full object-cover"
                />
                {/* Dark overlay for better text/button contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                {/* Restaurant Info (Top-Left aligned like the image) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-6 text-white text-shadow-lg">
                    <h1 className="text-4xl font-black mb-1 text-white tracking-tight">JC Restaurantes</h1>
                    <p className="text-sm flex items-center gap-1 opacity-90 text-white font-medium">
                        <span className="material-symbols-outlined text-sm text-white">location_on</span>
                        Jd das Camélias, São Paulo
                    </p>
                </div>

                {/* Categories Navigation at the BOTTOM of the banner */}
                <div className="absolute bottom-6 left-0 right-0 px-4">
                    <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryClick(cat)}
                                className={`px-8 py-3 rounded-full text-base font-black border transition-all whitespace-nowrap shadow-lg ${activeCategory === cat
                                        ? 'bg-red-600 text-white border-red-600 scale-105'
                                        : 'bg-white/95 text-red-600 border-white hover:bg-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Menu Content */}
            <div className="px-4 mt-12 space-y-12">
                {categories.map((category) => (
                    <section key={category} id={category} className="space-y-6 scroll-mt-24">
                        <div className="flex items-center gap-3 border-b-2 border-red-500/10 pb-3">
                            <span className="material-symbols-outlined text-red-600 text-2xl">
                                {category === 'Refeições' ? 'restaurant' :
                                    category === 'Para Levar' ? 'takeout_dining' :
                                        category === 'Porções' ? 'bakery_dining' :
                                            category === 'Bebidas' ? 'local_bar' : 'icecream'}
                            </span>
                            <h2 className="text-2xl font-black digital-menu-text-dark tracking-tight">
                                {category} {category === 'Refeições' ? '(Meals)' :
                                    category === 'Para Levar' ? '(Takeaway)' :
                                        category === 'Porções' ? '(Sides)' :
                                            category === 'Bebidas' ? '(Drinks)' : ''}
                            </h2>
                        </div>

                        <div className="space-y-8 px-1">
                            {itemsByCategory(category).length > 0 ? (
                                itemsByCategory(category).map((item) => (
                                    <div key={item.id} className="flex justify-between gap-6 group">
                                        <div className="flex-1">
                                            <h3 className="font-bold digital-menu-text-dark text-xl leading-tight group-hover:text-red-600 transition-colors uppercase tracking-tight">
                                                {item.name}
                                            </h3>
                                            <p className="text-sm digital-menu-text-gray mt-2 font-medium leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="digital-menu-text-red font-black text-xl tracking-tighter">
                                                {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm digital-menu-text-gray italic opacity-60">
                                    Nenhum item cadastrado nesta categoria no momento.
                                </p>
                            )}
                        </div>
                    </section>
                ))}
            </div>

            {/* Footer Info */}
            <div className="mt-24 bg-slate-900 text-white p-12 pb-44 border-t-4 border-red-600">
                <h2 className="text-2xl font-black text-red-600 text-center mb-8 tracking-tighter uppercase italic">JC Restaurantes</h2>
                <div className="space-y-8 max-w-sm mx-auto">
                    <div className="flex items-start gap-5">
                        <div className="bg-red-600 p-3 rounded-2xl shadow-lg shadow-red-600/20">
                            <span className="material-symbols-outlined text-white text-2xl">call</span>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-1">Contatos</p>
                            <p className="text-xl font-bold text-white">(11) 5197-0399</p>
                            <p className="text-xl font-bold text-white">(11) 99784-9852</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-5">
                        <div className="bg-red-600 p-3 rounded-2xl shadow-lg shadow-red-600/20">
                            <span className="material-symbols-outlined text-white text-2xl">location_on</span>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-1">Endereço</p>
                            <p className="text-base font-bold leading-relaxed text-white">
                                Av. Laranja da China 275 - Jd das Camélias
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-16 pt-8 border-t border-white/5 text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                        © 2024 JC Restaurantes. Desenvolvido com excelência.
                    </p>
                </div>
            </div>

            {/* Floating Cart Button */}
            <button className="fixed bottom-28 right-6 bg-red-600 text-white p-5 rounded-full shadow-2xl z-50 transform transition-all active:scale-90 hover:scale-110 border-4 border-white animate-bounce-subtle">
                <span className="material-symbols-outlined text-3xl text-white">shopping_cart</span>
            </button>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-12 py-5 flex justify-between items-center z-40 backdrop-blur-lg bg-white/90">
                <button className="flex flex-col items-center gap-1.5 text-red-600">
                    <span className="material-symbols-outlined fill text-3xl text-red-600">menu_book</span>
                    <span className="text-[11px] font-black uppercase tracking-tighter">Cardápio</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-red-500 transition-all group">
                    <span className="material-symbols-outlined text-3xl digital-menu-text-gray group-hover:text-red-400">map</span>
                    <span className="text-[11px] font-black uppercase tracking-tighter digital-menu-text-gray group-hover:text-red-400">Mapa</span>
                </button>
            </div>
        </div>
    );
};

export default DigitalMenu;
