
export type RecordType = "EXPENSE" | "INCOME";
export type FrequencyType = "WEEKLY" | "MONTHLY" | "YEARLY" | "MONTHLY_ALTERNATING";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Household {
  id: string;
  name: string;
  users: User[];
}

export interface Category {
  id: string;
  name: string;
  type: RecordType;
  isSystem: boolean;
}

export interface FinancialRecord {
  id: string;
  type: RecordType;
  amount: number;
  date: string; // ISO date YYYY-MM-DD
  description?: string;
  categoryId: string;
  householdId: string;
  payerUserId: string; // Quem pagou ou recebeu
}

export interface RecurringFinancialRecord {
  id: string;
  type: RecordType;
  amount: number;
  categoryId: string;
  startDate: string;
  endDate?: string;
  frequency: FrequencyType;
  description?: string;
  payerUserId: string;
}

export interface BankTransaction {
  id: string;
  externalReference: string;
  date: string;
  amount: number;
  description: string;
  rawData: Record<string, any>;
  matchedRecordId?: string;
}
