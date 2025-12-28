
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Wallet, Calendar } from 'lucide-react';
import { financialRecordService, categoryService, userService } from '../services/api';
import { Category, RecordType, User as UserType } from '../types';

export const NewRecord: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [formData, setFormData] = useState({
    type: 'EXPENSE' as RecordType,
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    categoryId: '',
    payerUserId: 0 as number | string,
  });

  useEffect(() => {
    Promise.all([
      categoryService.getAll(),
      userService.getUsers()
    ]).then(([fetchedCategories, fetchedUsers]) => {
      setCategories(fetchedCategories);
      setUsers(fetchedUsers);
      setFormData(prev => ({ ...prev, payerUserId: fetchedUsers[0]?.id || '' }));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.categoryId) return alert('Campos obrigatórios em falta.');

    await financialRecordService.create({
      type: formData.type,
      amount: parseFloat(formData.amount),
      date: formData.date,
      description: formData.description,
      categoryId: formData.categoryId,
      householdId: '1',
      payerUserId: formData.payerUserId
    });
    navigate('/records');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600">
        <ArrowLeft size={20} /> Voltar
      </button>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b bg-gray-50">
          <h1 className="text-2xl font-bold">Novo Registo</h1>
          <p className="text-gray-500">Adicione uma transação manual.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex gap-4">
            {['EXPENSE', 'INCOME'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, type: type as any, categoryId: '' })}
                className={`flex-1 py-4 rounded-xl font-bold transition-all ${formData.type === type
                  ? (type === 'EXPENSE' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white')
                  : 'bg-gray-100 text-gray-500'
                  }`}
              >
                {type === 'EXPENSE' ? 'Despesa' : 'Receita'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2"><Wallet size={16} /> Montante</label>
              <input
                type="number" step="0.01" required
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2"><Calendar size={16} /> Data</label>
              <input
                type="date" required
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Categoria</label>
            <select
              required className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            >
              <option value="">Selecione uma categoria</option>
              {categories.filter(c => c.type === formData.type).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Descrição</label>
            <input
              type="text" className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Utilizador Responsável</label>
            <div className="flex gap-2">
              {users.map(user => (
                <button
                  key={user.id} type="button"
                  onClick={() => setFormData({ ...formData, payerUserId: user.id })}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm transition-all flex items-center justify-center gap-2 ${formData.payerUserId === user.id ? 'bg-gray-800 text-white font-bold' : 'bg-gray-100 text-gray-500'
                    }`}
                >
                  <User size={14} /> {user.name}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2">
            <Save size={20} /> Guardar Registo
          </button>
        </form>
      </div>
    </div>
  );
};
