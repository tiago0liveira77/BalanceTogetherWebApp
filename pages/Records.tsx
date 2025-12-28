
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Tag,
  Calendar
} from 'lucide-react';
import { financialRecordService, categoryService, userService } from '../services/api';
import { FinancialRecord, Category, User } from '../types';
import { formatCurrency } from '../utils/finance';

const ITEMS_PER_PAGE = 10;

export const Records: React.FC = () => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [filterUser, setFilterUser] = useState<string>('ALL'); // Selected value from select is string often, but ID is number. Keep string 'ALL' or '1'
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();

  const fetchRecords = async () => {
    const [r, c] = await Promise.all([
      financialRecordService.getAll(),
      categoryService.getAll(),
    ]);
    setUsers(await userService.getUsers());
    setRecords(r.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setCategories(c);
  };

  useEffect(() => { fetchRecords(); }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem a certeza que deseja apagar este registo?')) {
      await financialRecordService.delete(id);
      fetchRecords();
    }
  };

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch = r.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'ALL' || r.type === filterType;
      const matchesUser = filterUser === 'ALL' || r.payerUserId.toString() === filterUser;
      const matchesCategory = filterCategory === 'ALL' || r.categoryId === filterCategory;
      const matchesFrom = !dateFrom || new Date(r.date) >= new Date(dateFrom);
      const matchesTo = !dateTo || new Date(r.date) <= new Date(dateTo);

      return matchesSearch && matchesType && matchesUser && matchesCategory && matchesFrom && matchesTo;
    });
  }, [records, searchTerm, filterType, filterUser, filterCategory, dateFrom, dateTo]);

  // Paginação
  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecords.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRecords, currentPage]);

  useEffect(() => {
    setCurrentPage(1); // Resetar para a primeira página quando os filtros mudam
  }, [searchTerm, filterType, filterUser, filterCategory, dateFrom, dateTo]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Registos Financeiros</h1>
          <p className="text-sm text-gray-500">Consulte e filtre todos os movimentos da conta.</p>
        </div>
        <button
          onClick={() => navigate('/records/new')}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-md active:scale-95"
        >
          <Plus size={20} /> Novo Registo
        </button>
      </div>

      {/* Barra de Pesquisa e Botão de Filtro */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Pesquisar por descrição..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all font-medium ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
        >
          <Filter size={18} />
          {showFilters ? 'Ocultar Filtros' : 'Filtros Avançados'}
        </button>
      </div>

      {/* Painel de Filtros Avançados */}
      {showFilters && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-top-4 duration-300">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
              <ArrowUpCircle size={14} /> Tipo
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full p-2.5 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Todos os Tipos</option>
              <option value="INCOME">Receitas</option>
              <option value="EXPENSE">Despesas</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
              <UserIcon size={14} /> Utilizador
            </label>
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Todos os Utilizadores</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
              <Tag size={14} /> Categoria
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Todas as Categorias</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
              <Calendar size={14} /> Intervalo de Datas
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="w-full p-2 bg-gray-50 border-none rounded-lg text-xs"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <span className="text-gray-300">-</span>
              <input
                type="date"
                className="w-full p-2 bg-gray-50 border-none rounded-lg text-xs"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tabela de Registos */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-[10px] uppercase tracking-widest text-gray-400 font-bold">
              <tr>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Utilizador</th>
                <th className="px-6 py-4 text-right">Montante</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedRecords.length > 0 ? paginatedRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{record.date}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-800">{record.description || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full uppercase tracking-tighter">
                      {categories.find(c => c.id === record.categoryId)?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                        {users.find(u => u.id === record.payerUserId)?.name.charAt(0)}
                      </div>
                      {users.find(u => u.id === record.payerUserId)?.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <span className={`text-sm font-black ${record.type === 'INCOME' ? 'text-emerald-600' : 'text-gray-900'}`}>
                      {record.type === 'INCOME' ? '+' : '-'}{formatCurrency(record.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    Nenhum registo encontrado com os filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
            <p className="text-xs text-gray-500 font-medium">
              A mostrar <span className="text-gray-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> a <span className="text-gray-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredRecords.length)}</span> de <span className="text-gray-900">{filteredRecords.length}</span> registos
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 rounded-lg border bg-white disabled:opacity-30 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === page
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white border text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 rounded-lg border bg-white disabled:opacity-30 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
