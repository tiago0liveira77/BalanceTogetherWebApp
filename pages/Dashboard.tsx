
import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  ChevronLeft,
  ChevronRight,
  User as UserIcon
} from 'lucide-react';
import { financialRecordService, recurringService, categoryService, userService } from '../services/api';
import { FinancialRecord, Category, User } from '../types';
import { formatCurrency, isDateInMonth, generateRecurringInstances } from '../utils/finance';
import { MonthlySummaryChart, CategoryBreakdownChart } from '../components/Charts';

export const Dashboard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [allMonthlyRecords, setAllMonthlyRecords] = useState<FinancialRecord[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const fetchData = async () => {
    const [fetchedRecords, fetchedCategories, fetchedRecurring] = await Promise.all([
      financialRecordService.getAll(),
      categoryService.getAll(),
      recurringService.getAll(),
    ]);

    const currentUsers = await userService.getUsers();
    setUsers(currentUsers);

    const manualRecords = fetchedRecords.filter(r => isDateInMonth(r.date, year, month));
    const recurringInstances = generateRecurringInstances(fetchedRecurring, year, month, currentUsers);

    setCategories(fetchedCategories);
    setAllMonthlyRecords([...manualRecords, ...recurringInstances]);
  };

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  const totalIncome = allMonthlyRecords.filter(r => r.type === 'INCOME').reduce((s, r) => s + r.amount, 0);
  const totalExpense = allMonthlyRecords.filter(r => r.type === 'EXPENSE').reduce((s, r) => s + r.amount, 0);
  const netBalance = totalIncome - totalExpense;

  // Filtrar records conforme o utilizador selecionado
  const filteredRecords = selectedUserId 
    ? allMonthlyRecords.filter(r => r.payerUserId === selectedUserId)
    : allMonthlyRecords;

  const filteredIncome = filteredRecords.filter(r => r.type === 'INCOME').reduce((s, r) => s + r.amount, 0);
  const filteredExpense = filteredRecords.filter(r => r.type === 'EXPENSE').reduce((s, r) => s + r.amount, 0);
  const filteredNetBalance = filteredIncome - filteredExpense;

  // Display values conforme filtro
  const displayIncome = selectedUserId ? filteredIncome : totalIncome;
  const displayExpense = selectedUserId ? filteredExpense : totalExpense;
  const displayNetBalance = selectedUserId ? filteredNetBalance : netBalance;
  const displayRecords = selectedUserId ? filteredRecords : allMonthlyRecords;

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 text-balance">Resumo Financeiro</h1>
          <p className="text-gray-500 mt-1">Gestão de gastos do agregado familiar.</p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-50 rounded-lg"><ChevronLeft size={20} /></button>
          <span className="font-semibold px-4 min-w-[160px] text-center capitalize">
            {currentDate.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-50 rounded-lg"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Receitas</p>
            <h3 className="text-2xl font-bold mt-2 text-emerald-600">{formatCurrency(displayIncome)}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><ArrowUpRight size={24} /></div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Despesas</p>
            <h3 className="text-2xl font-bold mt-2 text-indigo-600">{formatCurrency(displayExpense)}</h3>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><ArrowDownRight size={24} /></div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Saldo Líquido</p>
            <h3 className={`text-2xl font-bold mt-2 ${displayNetBalance >= 0 ? 'text-gray-900' : 'text-rose-600'}`}>
              {formatCurrency(displayNetBalance)}
            </h3>
          </div>
          <div className="p-3 bg-gray-50 text-gray-600 rounded-xl"><Wallet size={24} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold flex items-center gap-2">Fluxo de Caixa</h4>
            {selectedUserId && <span className="text-sm text-gray-500">Filtrado por utilizador</span>}
          </div>
          <MonthlySummaryChart records={displayRecords} />
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold flex items-center gap-2">Distribuição por Categoria</h4>
            {selectedUserId && <span className="text-sm text-gray-500">Filtrado por utilizador</span>}
          </div>
          <CategoryBreakdownChart records={displayRecords} categories={categories} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-bold">Filtrar por Utilizador</h4>
          {selectedUserId && (
            <button
              onClick={() => setSelectedUserId(null)}
              className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Ver Tudo
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => setSelectedUserId(null)}
            className={`p-4 rounded-xl border-2 transition-all font-semibold ${
              selectedUserId === null
                ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-300'
            }`}
          >
            Global
          </button>
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => setSelectedUserId(user.id)}
              className={`p-4 rounded-xl border-2 transition-all font-semibold ${
                selectedUserId === user.id
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-300'
              }`}
            >
              {user.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h4 className="text-lg font-bold mb-4">Gastos por Utilizador</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map(user => {
            const userTotal = allMonthlyRecords
              .filter(r => r.type === 'EXPENSE' && r.payerUserId === user.id)
              .reduce((a, b) => a + b.amount, 0);
            return (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white"><UserIcon size={20} /></div>
                  <span className="font-semibold text-gray-700">{user.name}</span>
                </div>
                <span className="font-bold text-gray-900">{formatCurrency(userTotal)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
