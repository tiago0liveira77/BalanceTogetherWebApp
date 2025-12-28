
import { FinancialRecord, Category, RecurringFinancialRecord, User } from '../types';
import { INITIAL_CATEGORIES, DEFAULT_USERS } from '../constants';
import { apiClient } from './apiClient';

const STORAGE_KEYS = {
  RECORDS: 'duofin_records',
  CATEGORIES: 'duofin_categories',
  RECURRING: 'duofin_recurring',
  USERS: 'duofin_users'
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
    const data = localStorage.getItem(STORAGE_KEYS.RECURRING);
    return data ? JSON.parse(data) : [];
  },
  create: async (record: Omit<RecurringFinancialRecord, 'id'>): Promise<RecurringFinancialRecord> => {
    const recurring = await recurringService.getAll();
    const newRecord = { ...record, id: Date.now() };
    recurring.push(newRecord);
    localStorage.setItem(STORAGE_KEYS.RECURRING, JSON.stringify(recurring));
    return newRecord;
  },
  delete: async (id: number): Promise<void> => {
    const recurring = await recurringService.getAll();
    const filtered = recurring.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RECURRING, JSON.stringify(filtered));
  }
};
