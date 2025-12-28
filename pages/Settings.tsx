
import React, { useState, useEffect } from 'react';
import { Save, User as UserIcon } from 'lucide-react';
import { userService } from '../services/api';
import { User } from '../types';

export const Settings: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadUsers = async () => {
      const current = await userService.getUsers();
      setUsers(current);
      const initialNames: Record<string, string> = {};
      current.forEach(u => initialNames[u.id.toString()] = u.name);
      setNames(initialNames);
    };
    loadUsers();
  }, []);

  const handleSave = async (id: number) => {
    await userService.updateUser(id, names[id.toString()]);
    alert('Nome atualizado com sucesso!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Definições do Agregado</h1>
        <p className="text-gray-500">Configure os nomes dos membros da casa.</p>
      </div>

      <div className="space-y-4">
        {users.map((user, idx) => (
          <div key={user.id} className="bg-white p-6 rounded-2xl border shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Utilizador {idx + 1}</h3>
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-semibold">Nome de Exibição</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text" className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-indigo-500"
                    value={names[user.id] || ''}
                    onChange={e => setNames({ ...names, [user.id]: e.target.value })}
                  />
                </div>
              </div>
              <button
                onClick={() => handleSave(user.id)}
                className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-all"
              >
                <Save size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-indigo-50 rounded-2xl text-indigo-700 text-sm">
        <strong>Nota:</strong> Estas definições são locais e alteram como os nomes aparecem nos gráficos e tabelas de registos.
      </div>
    </div>
  );
};
