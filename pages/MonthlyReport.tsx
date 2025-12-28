
import React, { useState, useEffect, useMemo } from 'react';
import {
    TrendingUp,
    TrendingDown,
    Target,
    Calendar,
    ArrowRight,
    ChevronDown
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts';
import { financialRecordService, recurringService } from '../services/api';
import { FinancialRecord, RecurringFinancialRecord } from '../types';
import { isDateInMonth, generateRecurringInstances, formatCurrency } from '../utils/finance';

interface MonthlyData {
    monthYear: string; // "MM/YYYY"
    income: number;
    expense: number;
    balance: number;
    savingsRate: number;
    label: string; // "Janeiro 2024"
}

export const MonthlyReport: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState<MonthlyData[]>([]);

    const fetchHistory = async () => {
        setLoading(true);
        const [records, recurring] = await Promise.all([
            financialRecordService.getAll(),
            recurringService.getAll(),
        ]);

        const history: MonthlyData[] = [];
        const now = new Date();

        // Gerar dados para os últimos 12 meses
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const year = d.getFullYear();
            const month = d.getMonth();

            const manualRecords = records.filter(r => isDateInMonth(r.date, year, month));
            const recurringInstances = generateRecurringInstances(recurring, year, month);
            const allMonthRecords = [...manualRecords, ...recurringInstances];

            const income = allMonthRecords.filter(r => r.type === 'INCOME').reduce((s, r) => s + r.amount, 0);
            const expense = allMonthRecords.filter(r => r.type === 'EXPENSE').reduce((s, r) => s + r.amount, 0);
            const balance = income - expense;
            const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;

            history.push({
                monthYear: `${month + 1}/${year}`,
                income,
                expense,
                balance,
                savingsRate: Math.max(0, savingsRate),
                label: d.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })
            });
        }

        setReportData(history);
        setLoading(false);
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const averages = useMemo(() => {
        if (reportData.length === 0) return { income: 0, expense: 0 };
        const sumIncome = reportData.reduce((acc, curr) => acc + curr.income, 0);
        const sumExpense = reportData.reduce((acc, curr) => acc + curr.expense, 0);
        return {
            income: sumIncome / reportData.length,
            expense: sumExpense / reportData.length,
        };
    }, [reportData]);

    if (loading) {
        return <div className="flex items-center justify-center h-64 text-gray-400">A carregar relatórios...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Relatório Mensal</h1>
                <p className="text-gray-500">Análise histórica dos últimos 12 meses.</p>
            </div>

            {/* Indicadores de Performance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Target size={20} /></div>
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Média Despesas</span>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900">{formatCurrency(averages.expense)}</h3>
                    <p className="text-xs text-gray-400 mt-2">Valor médio gasto por mês</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><TrendingUp size={20} /></div>
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Média Receitas</span>
                    </div>
                    <h3 className="text-3xl font-black text-emerald-600">{formatCurrency(averages.income)}</h3>
                    <p className="text-xs text-gray-400 mt-2">Faturação média mensal</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Calendar size={20} /></div>
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Poupança Média</span>
                    </div>
                    <h3 className="text-3xl font-black text-amber-600">
                        {((averages.income - averages.expense) / averages.income * 100).toFixed(1)}%
                    </h3>
                    <p className="text-xs text-gray-400 mt-2">Taxa de poupança média</p>
                </div>
            </div>

            {/* Gráfico de Evolução */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h4 className="text-lg font-bold mb-8">Evolução de Fluxo de Caixa</h4>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={reportData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="monthYear"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }}
                            />
                            <YAxis axisLine={false} tickLine={false} hide />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                            />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar name="Receitas" dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                            <Bar name="Despesas" dataKey="expense" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Tabela de Dados Mensais */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                    <h4 className="font-bold">Resultados por Mês</h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                            <tr>
                                <th className="px-6 py-4">Mês/Ano</th>
                                <th className="px-6 py-4">Receitas</th>
                                <th className="px-6 py-4">Despesas</th>
                                <th className="px-6 py-4">Saldo</th>
                                <th className="px-6 py-4">Taxa de Poupança</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {reportData.slice().reverse().map((month) => (
                                <tr key={month.monthYear} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-gray-800 capitalize">{month.label}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-emerald-600 font-medium">
                                        {formatCurrency(month.income)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-indigo-600 font-medium">
                                        {formatCurrency(month.expense)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-sm font-black ${month.balance >= 0 ? 'text-gray-900' : 'text-rose-600'}`}>
                                            {formatCurrency(month.balance)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${month.savingsRate > 20 ? 'bg-emerald-500' : month.savingsRate > 0 ? 'bg-amber-500' : 'bg-rose-500'
                                                        }`}
                                                    style={{ width: `${Math.min(100, month.savingsRate)}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-bold text-gray-500 min-w-[40px]">
                                                {month.savingsRate.toFixed(0)}%
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
