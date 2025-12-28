
import { FinancialRecord, RecurringFinancialRecord, User } from '../types';
import { userService } from '../services/api';

export const isDateInMonth = (dateStr: string, year: number, month: number) => {
  const d = new Date(dateStr);
  return d.getUTCFullYear() === year && d.getUTCMonth() === month;
};

export const generateRecurringInstances = (
  recurring: RecurringFinancialRecord[],
  year: number,
  month: number,
  users: User[]
): FinancialRecord[] => {
  const instances: FinancialRecord[] = [];

  recurring.forEach(rec => {
    const start = new Date(rec.startDate);
    const targetMonthStart = new Date(year, month, 1);
    const targetMonthEnd = new Date(year, month + 1, 0);

    // Se a data de início é no futuro em relação ao mês alvo, ignorar
    if (start > targetMonthEnd) return;
    // Se tem data de fim e já passou, ignorar
    if (rec.endDate && new Date(rec.endDate) < targetMonthStart) return;

    if (rec.frequency === 'MONTHLY' || rec.frequency === 'MONTHLY_ALTERNATING') {
      const instanceDate = new Date(year, month, start.getUTCDate());

      // Ajustar se o dia do mês não existir (ex: 31 de Fevereiro)
      if (instanceDate.getUTCMonth() !== month) {
        instanceDate.setUTCDate(0);
      }

      if (instanceDate >= start && (!rec.endDate || instanceDate <= new Date(rec.endDate))) {
        let finalPayerId = rec.payerUserId;

        if (rec.frequency === 'MONTHLY_ALTERNATING') {
          // Calcular diferença de meses
          const monthDiff = (year * 12 + month) - (start.getFullYear() * 12 + start.getMonth());

          if (monthDiff % 2 !== 0) {
            // Mês ímpar de diferença: troca para o outro utilizador
            const otherUser = users.find(u => u.id !== rec.payerUserId);
            if (otherUser) finalPayerId = otherUser.id;
          }
        }

        // Generate a deterministic negative ID to avoid collision with real backend IDs
        // Form: -(year * 10000 + month * 100 + day) ... or hash string
        // Simple hash of string ID:
        const idString = `recurring-${rec.id}-${year}-${month}`;
        let hash = 0;
        for (let i = 0; i < idString.length; i++) {
          const char = idString.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; // Convert to 32bit integer
        }
        const virtualId = -Math.abs(hash || 1); // Ensure negative and non-zero

        instances.push({
          id: virtualId,
          type: rec.type,
          amount: rec.amount,
          date: instanceDate.toISOString().split('T')[0],
          description: `[Fixo${rec.frequency === 'MONTHLY_ALTERNATING' ? ' Alt' : ''}] ${rec.description || ''}`,
          categoryId: rec.categoryId,
          householdId: 1,
          payerUserId: finalPayerId
        });
      }
    }
  });

  return instances;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};
