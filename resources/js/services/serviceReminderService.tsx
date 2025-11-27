import api from './api';

interface ServiceReminderData {
  vehicle_id?: number;
  service_task_id?: number;
  time_interval_value?: string;
  time_interval_unit?: string;
  time_due_soon_threshold_value?: string;
  time_due_soon_threshold_unit?: string;
  primary_meter_interval_value?: string;
  primary_meter_interval_unit?: string;
  primary_meter_due_soon_threshold_value?: string;
  primary_meter_due_soon_threshold_unit?: string;
  manually_set_next_reminder?: boolean;
  notifications_enabled?: boolean;
  watchers?: number[];
}

export const serviceReminderService = {
  getAll: (params?: { search?: string; page?: number; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.status) queryParams.append('status', params.status);
    const queryString = queryParams.toString();
    return api.get(`/service-reminders${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: number) =>
    api.get(`/service-reminders/${id}`),

  create: (data: ServiceReminderData) => {
    const formData = new FormData();

    if (data.vehicle_id) {
      formData.append('vehicle_id', data.vehicle_id.toString());
    }
    if (data.service_task_id) {
      formData.append('service_task_id', data.service_task_id.toString());
    }
    if (data.time_interval_value) {
      formData.append('time_interval_value', data.time_interval_value);
    }
    if (data.time_interval_unit) {
      formData.append('time_interval_unit', data.time_interval_unit);
    }
    if (data.time_due_soon_threshold_value) {
      formData.append('time_due_soon_threshold_value', data.time_due_soon_threshold_value);
    }
    if (data.time_due_soon_threshold_unit) {
      formData.append('time_due_soon_threshold_unit', data.time_due_soon_threshold_unit);
    }
    if (data.primary_meter_interval_value) {
      formData.append('primary_meter_interval_value', data.primary_meter_interval_value);
    }
    if (data.primary_meter_interval_unit) {
      formData.append('primary_meter_interval_unit', data.primary_meter_interval_unit);
    }
    if (data.primary_meter_due_soon_threshold_value) {
      formData.append('primary_meter_due_soon_threshold_value', data.primary_meter_due_soon_threshold_value);
    }
    if (data.primary_meter_due_soon_threshold_unit) {
      formData.append('primary_meter_due_soon_threshold_unit', data.primary_meter_due_soon_threshold_unit);
    }
    if (data.manually_set_next_reminder !== undefined) {
      formData.append('manually_set_next_reminder', data.manually_set_next_reminder ? '1' : '0');
    }
    if (data.notifications_enabled !== undefined) {
      formData.append('notifications_enabled', data.notifications_enabled ? '1' : '0');
    }
    if (data.watchers && data.watchers.length > 0) {
      data.watchers.forEach((watcherId) => {
        formData.append('watchers[]', watcherId.toString());
      });
    }

    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return api.post('/service-reminders', formData, {
      headers,
    });
  },

  update: (id: number, data: Partial<ServiceReminderData>) => {
    const formData = new FormData();

    if (data.vehicle_id !== undefined) {
      formData.append('vehicle_id', data.vehicle_id.toString());
    }
    if (data.service_task_id !== undefined) {
      formData.append('service_task_id', data.service_task_id.toString());
    }
    if (data.time_interval_value !== undefined) {
      formData.append('time_interval_value', data.time_interval_value || '');
    }
    if (data.time_interval_unit !== undefined) {
      formData.append('time_interval_unit', data.time_interval_unit || '');
    }
    if (data.time_due_soon_threshold_value !== undefined) {
      formData.append('time_due_soon_threshold_value', data.time_due_soon_threshold_value || '');
    }
    if (data.time_due_soon_threshold_unit !== undefined) {
      formData.append('time_due_soon_threshold_unit', data.time_due_soon_threshold_unit || '');
    }
    if (data.primary_meter_interval_value !== undefined) {
      formData.append('primary_meter_interval_value', data.primary_meter_interval_value || '');
    }
    if (data.primary_meter_interval_unit !== undefined) {
      formData.append('primary_meter_interval_unit', data.primary_meter_interval_unit || '');
    }
    if (data.primary_meter_due_soon_threshold_value !== undefined) {
      formData.append('primary_meter_due_soon_threshold_value', data.primary_meter_due_soon_threshold_value || '');
    }
    if (data.primary_meter_due_soon_threshold_unit !== undefined) {
      formData.append('primary_meter_due_soon_threshold_unit', data.primary_meter_due_soon_threshold_unit || '');
    }
    if (data.manually_set_next_reminder !== undefined) {
      formData.append('manually_set_next_reminder', data.manually_set_next_reminder ? '1' : '0');
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

    formData.append('_method', 'PUT');

    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return api.post(`/service-reminders/${id}`, formData, {
      headers,
    });
  },

  delete: (id: number) =>
    api.delete(`/service-reminders/${id}`),

  getForEdit: (id: number) =>
    api.get(`/service-reminders/${id}/edit`),

  checkServiceTaskLogged: (vehicleId: number, serviceTaskId: number) =>
        api.get(`/service-reminders/check-logged?vehicle_id=${vehicleId}&service_task_id=${serviceTaskId}`),

//   getAllReminder: () => { return api.get(`/get-reminder-service`)}
};

