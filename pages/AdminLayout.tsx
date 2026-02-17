
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { label: 'Painel Geral', icon: 'dashboard', path: '/admin' },
        { label: 'Pedidos', icon: 'shopping_bag', path: '/admin/orders' },
        { label: 'Gestão do Menu', icon: 'restaurant_menu', path: '/admin/menu' },
        { label: 'Clientes', icon: 'group', path: '/admin/customers' },
        { label: 'Relatórios', icon: 'bar_chart', path: '/admin/reports' },
        { label: 'Configurações', icon: 'settings', path: '/admin/settings' },
        { label: 'Ver Cardápio', icon: 'menu_book', path: '/' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-background-dark border-r border-slate-200 dark:border-border-dark flex flex-col z-50">
            <div className="p-6 flex items-center gap-3">
                <div className="size-12 rounded-lg flex items-center justify-center overflow-hidden">
                    <img src="https://mgeclrvmizqicscatnfs.supabase.co/storage/v1/object/public/assets/logo.png" alt="Logo JC" className="w-full h-full object-contain" />
                </div>
                <div>
                    <h1 className="text-sm font-bold leading-tight">J C Restaurantes</h1>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold">Sistema de Gestão</p>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-4">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${isActive(item.path)
                            ? 'bg-primary/10 text-primary border-l-4 border-primary'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/10 hover:text-primary'
                            }`}
                    >
                        <span className={`material-symbols-outlined text-[22px] ${isActive(item.path) ? 'fill' : ''}`}>
                            {item.icon}
                        </span>
                        <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

const Header = () => {
    return (
        <header className="h-16 border-b border-slate-200 dark:border-border-dark px-8 flex items-center justify-between bg-white/50 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-40">
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                    <input
                        className="w-full bg-slate-100 dark:bg-surface-dark border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary placeholder:text-slate-400 transition-all"
                        placeholder="Pesquisar pedidos, clientes ou pratos..."
                        type="text"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-border-dark rounded-lg transition-colors">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
                </button>
                <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-border-dark rounded-lg transition-colors">
                    <span className="material-symbols-outlined">help</span>
                </button>
            </div>
        </header>
    );
};

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 p-8 overflow-y-auto bg-slate-50 dark:bg-background-dark/30">
                    {children}
                </main>
                <footer className="p-6 text-center border-t border-slate-200 dark:border-border-dark bg-white dark:bg-background-dark">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">
                        © 2024 MJC Restaurante - Dashboard Administrativo v2.4.0
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default AdminLayout;
