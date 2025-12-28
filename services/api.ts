
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
    const data = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return data ? JSON.parse(data) : [];
  },
  create: async (record: Omit<FinancialRecord, 'id'>): Promise<FinancialRecord> => {
    const records = await financialRecordService.getAll();
    const newRecord = { ...record, id: Math.random().toString(36).substr(2, 9) };
    records.push(newRecord);
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    return newRecord;
  },
  delete: async (id: string): Promise<void> => {
    const records = await financialRecordService.getAll();
    const filtered = records.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(filtered));
  }
};

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  },
  create: async (category: Omit<Category, 'id' | 'isSystem'>): Promise<Category> => {
    const categories = await categoryService.getAll();
    const newCategory = { ...category, id: `cat-${Date.now()}`, isSystem: false };
    categories.push(newCategory);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    return newCategory;
  },
  delete: async (id: string): Promise<void> => {
    const categories = await categoryService.getAll();
    const filtered = categories.filter(c => c.id !== id || c.isSystem);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
  }
};

export const recurringService = {
  getAll: async (): Promise<RecurringFinancialRecord[]> => {
    const data = localStorage.getItem(STORAGE_KEYS.RECURRING);
    return data ? JSON.parse(data) : [];
  },
  create: async (record: Omit<RecurringFinancialRecord, 'id'>): Promise<RecurringFinancialRecord> => {
    const recurring = await recurringService.getAll();
    const newRecord = { ...record, id: `rec-${Date.now()}` };
    recurring.push(newRecord);
    localStorage.setItem(STORAGE_KEYS.RECURRING, JSON.stringify(recurring));
    return newRecord;
  },
  delete: async (id: string): Promise<void> => {
    const recurring = await recurringService.getAll();
    const filtered = recurring.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RECURRING, JSON.stringify(filtered));
  }
};
