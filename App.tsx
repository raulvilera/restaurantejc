
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Menu from './pages/Menu';
import Customers from './pages/Customers';
import Settings from './pages/Settings';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'Visão Geral', icon: 'dashboard', path: '/' },
    { label: 'Relatório de Pedidos', icon: 'list_alt', path: '/orders' },
    { label: 'Itens do Cardápio', icon: 'menu_book', path: '/menu' },
    { label: 'Base de Clientes', icon: 'people', path: '/customers' },
    { label: 'Configurações', icon: 'settings', path: '/settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[72px] hover:w-64 bg-white border-r border-google-gray-300 flex flex-col z-50 transition-all duration-300 group overflow-hidden">
      <div className="h-16 flex items-center px-4 gap-4 flex-shrink-0 border-b border-google-gray-300">
        <div className="size-10 rounded bg-primary flex items-center justify-center text-white flex-shrink-0">
          <span className="material-symbols-outlined fill">analytics</span>
        </div>
        <span className="font-bold text-google-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">Looker MJC</span>
      </div>

      <nav className="flex-1 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 transition-colors ${isActive(item.path)
                ? 'bg-primary/10 text-primary'
                : 'text-google-text-secondary hover:bg-google-gray-100 hover:text-google-text-primary'
              }`}
          >
            <span className={`material-symbols-outlined text-[24px] ${isActive(item.path) ? 'fill' : ''}`}>
              {item.icon}
            </span>
            <span className="text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-google-gray-300">
        <div className="flex items-center gap-4 py-2">
          <div className="size-10 rounded-full bg-google-gray-200 flex items-center justify-center text-google-text-secondary font-bold text-xs flex-shrink-0">
            JD
          </div>
          <div className="flex-1 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-sm font-semibold truncate">João Diretor</p>
            <p className="text-[11px] text-google-text-secondary uppercase">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

const Header = () => {
  const location = useLocation();
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Painel de Desempenho Administrativo';
      case '/orders': return 'Relatório Detalhado de Pedidos';
      case '/menu': return 'Gestão de Itens e Cardápio';
      case '/customers': return 'Explorador de Base de Clientes';
      case '/settings': return 'Configurações do Relatório';
      default: return 'Visão Geral';
    }
  };

  return (
    <header className="h-16 border-b border-google-gray-300 px-6 flex items-center justify-between bg-white sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-medium text-google-text-primary">{getPageTitle()}</h1>
        <div className="h-4 w-[1px] bg-google-gray-300 mx-2 hidden sm:block"></div>
        <div className="hidden sm:flex items-center gap-1 text-google-text-secondary text-xs">
          <span className="px-2 py-1 rounded hover:bg-google-gray-100 cursor-pointer">Arquivo</span>
          <span className="px-2 py-1 rounded hover:bg-google-gray-100 cursor-pointer">Editar</span>
          <span className="px-2 py-1 rounded hover:bg-google-gray-100 cursor-pointer">Visualizar</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-1.5 border border-google-gray-300 rounded text-sm font-medium text-google-text-primary hover:bg-google-gray-100 transition-all">
          <span className="material-symbols-outlined text-lg">share</span>
          Compartilhar
        </button>
        <button className="flex items-center gap-2 px-4 py-1.5 bg-primary text-white rounded text-sm font-bold shadow-sm hover:bg-primary/90 transition-all">
          <span className="material-symbols-outlined text-lg">visibility</span>
          Ver
        </button>
      </div>
    </header>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex bg-google-gray-100 min-h-screen font-sans">
        <Sidebar />
        <div className="flex-1 ml-[72px] flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </main>
          <footer className="py-4 px-8 border-t border-google-gray-300 flex justify-between items-center text-[11px] text-google-text-secondary bg-white">
            <div className="flex gap-4">
              <span>Última atualização: Hoje, 12:00</span>
              <span>Proprietário: MJC Restaurante</span>
            </div>
            <div className="font-medium uppercase tracking-wider">
              Google Looker Studio UI Pattern
            </div>
          </footer>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
