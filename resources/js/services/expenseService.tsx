import api from './api';

interface ExpenseFormData {
  vehicle_id: number;
  vendor_id?: number;
  expense_type: string;
  amount: number;
  date: string;
  notes?: string;
  reference_id?: number;
  reference_type?: string;
  frequency: string;
  recurrence_period?: string;
}

interface ExpenseData {
  vehicle_id: number;
  vendor_id?: number;
  expense_type: string;
  amount: number;
  date: string;
  notes?: string;
  reference_id?: number;
  reference_type?: string;
  frequency: string;
  recurrence_period?: string;
}

export const expenseService = {
  getAll: (params?: { search?: string; page?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    const queryString = queryParams.toString();
    return api.get(`/expense-history${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: number) => api.get(`/expense-history/${id}`),

  create: (data: ExpenseFormData) => {
    const expenseData: ExpenseData = {
      vehicle_id: data.vehicle_id,
      vendor_id: data.vendor_id || undefined,
      expense_type: data.expense_type,
      amount: data.amount,
      date: data.date,
      notes: data.notes || undefined,
      reference_id: data.reference_id || undefined,
      reference_type: data.reference_type || undefined,
      frequency: data.frequency,
      recurrence_period: data.recurrence_period || undefined,
    };

    return api.post('/expense-history', expenseData);
  },

  update: (id: number, data: Partial<ExpenseFormData>) => {
    const expenseData: Partial<ExpenseData> = {};

    if (data.vehicle_id) expenseData.vehicle_id = data.vehicle_id;
    if (data.vendor_id !== undefined) expenseData.vendor_id = data.vendor_id;
    if (data.expense_type) expenseData.expense_type = data.expense_type;
    if (data.amount !== undefined) expenseData.amount = data.amount;
    if (data.date) expenseData.date = data.date;
    if (data.notes !== undefined) expenseData.notes = data.notes;
    if (data.reference_id !== undefined) expenseData.reference_id = data.reference_id;
    if (data.reference_type !== undefined) expenseData.reference_type = data.reference_type;
    if (data.frequency) expenseData.frequency = data.frequency;
    if (data.recurrence_period !== undefined) expenseData.recurrence_period = data.recurrence_period;

    return api.put(`/expense-history/${id}`, expenseData);
  },

  delete: (id: number) => api.delete(`/expense-history/${id}`),

  getForEdit: (id: number) => api.get(`/expense-history/${id}/edit`),
};
