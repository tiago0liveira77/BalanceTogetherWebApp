
import { FinancialRecord, Category, RecurringFinancialRecord, User } from '../types';
import { INITIAL_CATEGORIES, DEFAULT_USERS } from '../constants';
import { apiClient } from './apiClient';

const STORAGE_KEYS = {
  RECORDS: 'BalanceTogether_records',
  CATEGORIES: 'BalanceTogether_categories',
  RECURRING: 'BalanceTogether_recurring',
  USERS: 'BalanceTogether_users'
};

const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RECORDS)) {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RECURRING)) {
    localStorage.setItem(STORAGE_KEYS.RECURRING, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
  }
};

initializeStorage();

export const userService = {
  getUsers: async (): Promise<User[]> => {
    return apiClient.get<User[]>('/users');
  },
  updateUser: async (id: number, name: string) => {
    return apiClient.post<User[]>('/users', { id, name });
  }
};

export const financialRecordService = {
  getAll: async (): Promise<FinancialRecord[]> => {
    return apiClient.get<FinancialRecord[]>('/financial-records');
  },
  create: async (record: Omit<FinancialRecord, 'id'>): Promise<FinancialRecord> => {
    return apiClient.post<FinancialRecord>('/financial-records', record);
  },
  delete: async (id: number): Promise<void> => {
    return apiClient.delete(`/financial-records/${id}`);
  }
};

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    return apiClient.get<Category[]>('/categories');
  },
  create: async (category: Omit<Category, 'id' | 'isSystem'>): Promise<Category> => {
    return apiClient.post<Category>('/categories', category);
  },
  delete: async (id: number): Promise<void> => {
    return apiClient.delete(`/categories/${id}`);
  }
};

export const recurringService = {
  getAll: async (): Promise<RecurringFinancialRecord[]> => {
    return apiClient.get<RecurringFinancialRecord[]>('/recurring-records');
  },
  create: async (record: Omit<RecurringFinancialRecord, 'id'>): Promise<RecurringFinancialRecord> => {
    return apiClient.post<RecurringFinancialRecord>('/recurring-records', record);
  },
  delete: async (id: number): Promise<void> => {
    return apiClient.delete(`/recurring-records/${id}`);
  }
};
