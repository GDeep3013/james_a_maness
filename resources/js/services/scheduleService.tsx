import api from './api';

interface ScheduleData {
  vehicle_id?: number;
  service_task_ids?: number[];
  primary_meter_due_soon_threshold_unit?: string;
  notifications_enabled?: boolean;
  watchers?: number[];
  next_due_date?: string;
  next_due_meter?: string;
}

export const scheduleService = {
  getAll: (params?: { search?: string; page?: number; status?: string; vehicle_id?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.vehicle_id) queryParams.append('vehicle_id', params.vehicle_id.toString());
    const queryString = queryParams.toString();
    return api.get(`/schedules${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: number) =>
    api.get(`/schedules/${id}`),

  create: (data: ScheduleData) => {
    const formData = new FormData();

    if (data.vehicle_id) {
      formData.append('vehicle_id', data.vehicle_id.toString());
    }
    if (data.service_task_ids && data.service_task_ids.length > 0) {
      data.service_task_ids.forEach((taskId) => {
        formData.append('service_task_ids[]', taskId.toString());
      });
    }
    if (data.primary_meter_due_soon_threshold_unit) {
      formData.append('primary_meter_due_soon_threshold_unit', data.primary_meter_due_soon_threshold_unit);
    }
    if (data.notifications_enabled !== undefined) {
      formData.append('notifications_enabled', data.notifications_enabled ? '1' : '0');
    }
    if (data.watchers && data.watchers.length > 0) {
      data.watchers.forEach((watcherId) => {
        formData.append('watchers[]', watcherId.toString());
      });
    }
    if (data.next_due_date !== undefined) {
      formData.append('next_due_date', data.next_due_date);
    }
    if (data.next_due_meter !== undefined) {
      formData.append('next_due_meter', data.next_due_meter);
    }

    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return api.post('/schedules', formData, {
      headers,
    });
  },

  update: (id: number, data: Partial<ScheduleData>) => {
    const formData = new FormData();

    if (data.vehicle_id !== undefined) {
      formData.append('vehicle_id', data.vehicle_id.toString());
    }
    if (data.service_task_ids !== undefined) {
      if (data.service_task_ids.length > 0) {
        data.service_task_ids.forEach((taskId) => {
          formData.append('service_task_ids[]', taskId.toString());
        });
      }
    }
    if (data.primary_meter_due_soon_threshold_unit !== undefined) {
      formData.append('primary_meter_due_soon_threshold_unit', data.primary_meter_due_soon_threshold_unit || '');
    }
    if (data.notifications_enabled !== undefined) {
      formData.append('notifications_enabled', data.notifications_enabled ? '1' : '0');
    }
    if (data.watchers !== undefined) {
      if (data.watchers.length > 0) {
        data.watchers.forEach((watcherId) => {
          formData.append('watchers[]', watcherId.toString());
        });
      }
    }
    if (data.next_due_date !== undefined) {
      formData.append('next_due_date', data.next_due_date || '');
    }
    if (data.next_due_meter !== undefined) {
      formData.append('next_due_meter', data.next_due_meter || '');
    }

    formData.append('_method', 'PUT');

    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return api.post(`/schedules/${id}`, formData, {
      headers,
    });
  },

  delete: (id: number) =>
    api.delete(`/schedules/${id}`),

  getForEdit: (id: number) =>
    api.get(`/schedules/${id}/edit`),

  checkServiceTaskLogged: (vehicleId: number, serviceTaskId: number) =>
    api.get(`/schedules/check-logged?vehicle_id=${vehicleId}&service_task_id=${serviceTaskId}`),
};

