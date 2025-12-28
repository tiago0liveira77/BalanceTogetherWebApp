
import { Category } from './types';

export const DEFAULT_USERS = [
  { id: 1, name: 'Utilizador 1', email: 'u1@exemplo.pt' },
  { id: 2, name: 'Utilizador 2', email: 'u2@exemplo.pt' }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: 'Renda', type: 'EXPENSE', isSystem: true },
  { id: 2, name: 'Luz', type: 'EXPENSE', isSystem: true },
  { id: 3, name: 'Salário', type: 'INCOME', isSystem: true },
  { id: 4, name: 'Subsidio', type: 'INCOME', isSystem: true },
];

export const CURRENCY_FORMATTER = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: 'EUR',
});
