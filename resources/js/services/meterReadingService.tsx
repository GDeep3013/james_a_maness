import api from './api';

interface MeterReadingFormData {
    vehicle_id: number;
    vehicle_meter: string;
    date: string;
}

interface MeterReadingData {
    vehicle_id: number;
    vehicle_meter: string;
    date: string;
}

export const meterReadingService = {
    getAll: (params?: { search?: string; page?: number }) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append('search', params.search);
        if (params?.page) queryParams.append('page', params.page.toString());
        const queryString = queryParams.toString();
        return api.get(`/meter-history${queryString ? `?${queryString}` : ''}`);
    },

    getById: (id: number) => api.get(`/meter-history/${id}`),

    create: (data: MeterReadingFormData) => {
        const meterReadingData: MeterReadingData = {
            vehicle_id: data.vehicle_id,
            vehicle_meter: data.vehicle_meter,
            date: data.date,
        };

        return api.post('/meter-history', meterReadingData);
    },

    update: (id: number, data: Partial<MeterReadingFormData>) => {
        const meterReadingData: Partial<MeterReadingData> = {};

        if (data.vehicle_id) meterReadingData.vehicle_id = data.vehicle_id;
        if (data.vehicle_meter) meterReadingData.vehicle_meter = data.vehicle_meter;
        if (data.date) meterReadingData.date = data.date;

        return api.put(`/meter-history/${id}`, meterReadingData);
    },

    delete: (id: number) => api.delete(`/meter-history/${id}`),

    getForEdit: (id: number) => api.get(`/meter-history/${id}/edit`),


    export: (params?: { search?: string }) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append('search', params.search);
        const queryString = queryParams.toString();

        return api.get(`/meter-history/export${queryString ? `?${queryString}` : ''}`, {
            responseType: 'blob',
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
        });
    },
};
