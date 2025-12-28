
export type RecordType = "EXPENSE" | "INCOME";
export type FrequencyType = "WEEKLY" | "MONTHLY" | "YEARLY" | "MONTHLY_ALTERNATING";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Household {
  id: number;
  name: string;
  users: User[];
}

export interface Category {
  id: number;
  name: string;
  type: RecordType;
  isSystem: boolean;
}

export interface FinancialRecord {
  id: number;
  type: RecordType;
  amount: number;
  date: string; // ISO date YYYY-MM-DD
  description?: string;
  categoryId: number;
  householdId: number;
  payerUserId: number; // Quem pagou ou recebeu
}

export interface RecurringFinancialRecord {
  id: number;
  type: RecordType;
  amount: number;
  categoryId: number;
  startDate: string;
  endDate?: string;
  frequency: FrequencyType;
  description?: string;
  payerUserId: number;
}

export interface BankTransaction {
  id: number;
  externalReference: string;
  date: string;
  amount: number;
  description: string;
  rawData: Record<string, any>;
  matchedRecordId?: number;
}
