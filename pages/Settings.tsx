
import React from 'react';

const Settings = () => {
  const sections = [
    { title: 'Perfil do Restaurante', icon: 'storefront', description: 'Informações básicas, logo e endereço.' },
    { title: 'Horários de Funcionamento', icon: 'schedule', description: 'Defina quando o seu restaurante está aberto para pedidos.' },
    { title: 'Gestão de Staff', icon: 'groups', description: 'Gerencie permissões de acesso para funcionários.' },
    { title: 'Configurações de Pagamento', icon: 'payments', description: 'Gateway, taxas de entrega e métodos aceitos.' },
    { title: 'Integrações', icon: 'extension', description: 'Conecte com apps de delivery e sistemas externos.' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-slate-500 dark:text-slate-400">Personalize o comportamento do seu painel e sistema.</p>
      </div>

      <div className="grid gap-4">
        {sections.map((section, idx) => (
          <button 
            key={idx}
            className="flex items-center gap-6 p-6 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all text-left group"
          >
            <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-3xl">{section.icon}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-0.5">{section.title}</h3>
              <p className="text-sm text-slate-500">{section.description}</p>
            </div>
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">chevron_right</span>
          </button>
        ))}
      </div>

      <div className="p-8 bg-slate-100 dark:bg-surface-dark/30 rounded-2xl border border-dashed border-slate-300 dark:border-border-dark flex flex-col items-center text-center gap-4">
        <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl">cloud_sync</span>
        </div>
        <div>
          <h4 className="font-bold text-lg">Backup de Dados</h4>
          <p className="text-sm text-slate-500 max-w-sm">Os seus dados são sincronizados automaticamente a cada 5 minutos. Você também pode exportar um backup manual agora.</p>
        </div>
        <button className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
          Exportar Base Completa
        </button>
      </div>
    </div>
  );
};

export default Settings;
