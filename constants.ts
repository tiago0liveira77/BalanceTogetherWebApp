
import { Category } from './types';

export const DEFAULT_USERS = [
  { id: 1, name: 'Utilizador 1', email: 'u1@exemplo.pt' },
  { id: 2, name: 'Utilizador 2', email: 'u2@exemplo.pt' }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Renda/Crédito', type: 'EXPENSE', isSystem: true },
  { id: 'cat-2', name: 'Supermercado', type: 'EXPENSE', isSystem: true },
  { id: 'cat-3', name: 'Eletricidade/Água', type: 'EXPENSE', isSystem: true },
  { id: 'cat-4', name: 'Restaurantes', type: 'EXPENSE', isSystem: true },
  { id: 'cat-5', name: 'Ordenado', type: 'INCOME', isSystem: true },
  { id: 'cat-6', name: 'Subsídios', type: 'INCOME', isSystem: true },
  { id: 'cat-7', name: 'Investimentos', type: 'INCOME', isSystem: true },
  { id: 'cat-8', name: 'Lazer', type: 'EXPENSE', isSystem: true },
];

export const CURRENCY_FORMATTER = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: 'EUR',
});
