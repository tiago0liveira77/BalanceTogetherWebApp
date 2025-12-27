
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Category, FinancialRecord } from '../types';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

interface SummaryChartProps {
  records: FinancialRecord[];
}

export const MonthlySummaryChart: React.FC<SummaryChartProps> = ({ records }) => {
  const data = [
    { name: 'Income', amount: records.filter(r => r.type === 'INCOME').reduce((a, b) => a + b.amount, 0) },
    { name: 'Expense', amount: records.filter(r => r.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0) }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} hide />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
          />
          <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#6366f1'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface CategoryChartProps {
  records: FinancialRecord[];
  categories: Category[];
}

export const CategoryBreakdownChart: React.FC<CategoryChartProps> = ({ records, categories }) => {
  const expenseRecords = records.filter(r => r.type === 'EXPENSE');
  const catMap = expenseRecords.reduce((acc, curr) => {
    const cat = categories.find(c => c.id === curr.categoryId);
    const name = cat ? cat.name : 'Unknown';
    acc[name] = (acc[name] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(catMap).map(([name, value]) => ({ name, value }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
