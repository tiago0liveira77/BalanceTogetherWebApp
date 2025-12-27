
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Repeat, User as UserIcon, Calendar, Info } from 'lucide-react';
import { recurringService, categoryService, userService } from '../services/api';
import { RecurringFinancialRecord, Category, User, FrequencyType } from '../types';
import { formatCurrency } from '../utils/finance';

export const Recurring: React.FC = () => {
  const [recurring, setRecurring] = useState<RecurringFinancialRecord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'EXPENSE' as any,
    amount: '',
    categoryId: '',
    startDate: new Date().toISOString().split('T')[0],
    description: '',
    frequency: 'MONTHLY' as FrequencyType,
    payerUserId: ''
  });

  const fetchData = async () => {
    const [r, c] = await Promise.all([recurringService.getAll(), categoryService.getAll()]);
    const u = userService.getUsers();
    setRecurring(r);
    setCategories(c);
    setUsers(u);
    if (!formData.payerUserId) {
        setFormData(f => ({ ...f, payerUserId: u[0].id }));
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.categoryId || !formData.payerUserId) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }
    await recurringService.create({
      ...formData,
      amount: parseFloat(formData.amount),
    });
    setShowForm(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem a certeza que deseja apagar esta recorrência? Todos os lançamentos futuros deixarão de ser calculados.')) {
      await recurringService.delete(id);
      fetchData();
    }
  };

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'N/A';
  const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'N/A';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Movimentos Recorrentes</h1>
          <p className="text-gray-500 text-sm">Configure despesas ou receitas fixas mensais.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95"
        >
          <Plus size={20}/> Novo Fixo
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border shadow-lg space-y-6 animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="space-y-2">
                <label className="text-sm font-semibold">Tipo</label>
                <select 
                    className="w-full px-4 py-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as any, categoryId: ''})}
                >
                    <option value="EXPENSE">Despesa</option>
                    <option value="INCOME">Receita</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-sm font-semibold">Montante</label>
                <input 
                    type="number" step="0.01" placeholder="0.00 €" required
                    className="w-full px-4 py-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-semibold">Categoria</label>
                <select 
                    required className="w-full px-4 py-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.categoryId}
                    onChange={e => setFormData({...formData, categoryId: e.target.value})}
                >
                    <option value="">Selecione...</option>
                    {categories.filter(c => c.type === formData.type).map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-semibold">Descrição</label>
                <input 
                    type="text" placeholder="Ex: Renda Casa"
                    className="w-full px-4 py-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-semibold">Início em</label>
                <input 
                    type="date" required
                    className="w-full px-4 py-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-semibold">Frequência</label>
                <select 
                    className="w-full px-4 py-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.frequency}
                    onChange={e => setFormData({...formData, frequency: e.target.value as any})}
                >
                    <option value="MONTHLY">Mensal</option>
                    <option value="MONTHLY_ALTERNATING">Mensal Alternado (Troca Utilizador)</option>
                </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Quem Inicia?</label>
            <div className="flex gap-4">
              {users.map(u => (
                <button
                  key={u.id} type="button"
                  onClick={() => setFormData({...formData, payerUserId: u.id})}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 border-2 ${
                    formData.payerUserId === u.id 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' 
                    : 'border-transparent bg-gray-100 text-gray-500'
                  }`}
                >
                  <UserIcon size={16}/> {u.name}
                </button>
              ))}
            </div>
            {formData.frequency === 'MONTHLY_ALTERNATING' && (
                <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                    <Info size={12}/> O sistema irá alternar entre {users[0]?.name} e {users[1]?.name} automaticamente a cada mês.
                </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 text-gray-500 font-medium">Cancelar</button>
            <button type="submit" className="bg-indigo-600 text-white px-10 py-2 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all">
              Criar Movimento
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recurring.length > 0 ? recurring.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            {item.frequency === 'MONTHLY_ALTERNATING' && (
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] px-3 py-1 font-bold uppercase tracking-tighter rounded-bl-lg">
                    Alternado
                </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${item.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                  <Repeat size={20}/>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{item.description || 'Sem descrição'}</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar size={12}/> Dia {new Date(item.startDate).getDate()} • {getCategoryName(item.categoryId)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-black ${item.type === 'INCOME' ? 'text-emerald-600' : 'text-indigo-600'}`}>
                  {formatCurrency(item.amount)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <UserIcon size={14}/>
                Inicia com: <span className="font-bold text-gray-700">{getUserName(item.payerUserId)}</span>
              </div>
              <button 
                onClick={() => handleDelete(item.id)} 
                className="text-gray-400 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 transition-colors"
                title="Apagar Recorrência"
              >
                <Trash2 size={18}/>
              </button>
            </div>
          </div>
        )) : (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-3xl border border-dashed text-gray-400">
                Não existem movimentos recorrentes configurados.
            </div>
        )}
      </div>
    </div>
  );
};
