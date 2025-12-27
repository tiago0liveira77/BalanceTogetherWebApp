
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Tags } from 'lucide-react';
import { categoryService } from '../services/api';
import { Category } from '../types';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');

  const fetchCats = async () => setCategories(await categoryService.getAll());
  useEffect(() => { fetchCats(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    await categoryService.create({ name: newName, type: newType });
    setNewName('');
    fetchCats();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apagar esta categoria?')) {
      await categoryService.delete(id);
      fetchCats();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Gestão de Categorias</h1>
        <p className="text-gray-500">Personalize as categorias do seu agregador.</p>
      </div>

      <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl border flex flex-col md:flex-row gap-4 items-end shadow-sm">
        <div className="flex-1 space-y-2 w-full">
          <label className="text-sm font-semibold">Nome da Categoria</label>
          <input 
            type="text" required className="w-full px-4 py-2 bg-gray-50 rounded-lg border-none"
            value={newName} onChange={e => setNewName(e.target.value)}
          />
        </div>
        <div className="space-y-2 w-full md:w-48">
          <label className="text-sm font-semibold">Tipo</label>
          <select 
            className="w-full px-4 py-2 bg-gray-50 rounded-lg border-none"
            value={newType} onChange={e => setNewType(e.target.value as any)}
          >
            <option value="EXPENSE">Despesa</option>
            <option value="INCOME">Receita</option>
          </select>
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 whitespace-nowrap">
          <Plus size={18}/> Adicionar
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-bold mb-4 text-indigo-600 uppercase text-xs tracking-widest">Despesas</h3>
          <div className="space-y-2">
            {categories.filter(c => c.type === 'EXPENSE').map(c => (
              <div key={c.id} className="bg-white p-3 rounded-xl border flex items-center justify-between">
                <span className="text-sm font-medium">{c.name}</span>
                {!c.isSystem && (
                  <button onClick={() => handleDelete(c.id)} className="text-gray-400 hover:text-rose-500"><Trash2 size={16}/></button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold mb-4 text-emerald-600 uppercase text-xs tracking-widest">Receitas</h3>
          <div className="space-y-2">
            {categories.filter(c => c.type === 'INCOME').map(c => (
              <div key={c.id} className="bg-white p-3 rounded-xl border flex items-center justify-between">
                <span className="text-sm font-medium">{c.name}</span>
                {!c.isSystem && (
                  <button onClick={() => handleDelete(c.id)} className="text-gray-400 hover:text-rose-500"><Trash2 size={16}/></button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
