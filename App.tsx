
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Menu from './pages/Menu';
import Customers from './pages/Customers';
import Settings from './pages/Settings';
import DigitalMenu from './pages/DigitalMenu';
import AdminLayout from './pages/AdminLayout';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Rota Principal: Cardápio Digital para o Cliente */}
        <Route path="/" element={<DigitalMenu />} />

        {/* Rotas Administrativas */}
        <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/admin/orders" element={<AdminLayout><Orders /></AdminLayout>} />
        <Route path="/admin/menu" element={<AdminLayout><Menu /></AdminLayout>} />
        <Route path="/admin/customers" element={<AdminLayout><Customers /></AdminLayout>} />
        <Route path="/admin/settings" element={<AdminLayout><Settings /></AdminLayout>} />

        {/* Redirecionamento de rotas antigas ou erros */}
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
