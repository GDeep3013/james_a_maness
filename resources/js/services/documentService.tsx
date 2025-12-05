import api from './api';

interface DocumentParams {
    vehicle_id: number;
    page?: number;
    search?: string;
}

interface DocumentData {
    vehicle_id: number;
    title: string;
    file: File | null;
    expires_date?: string | null;
}

export const documentService = {
    getAll: (params: DocumentParams) => {
        const queryParams = new URLSearchParams();
        queryParams.append('vehicle_id', params.vehicle_id.toString());
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.search) queryParams.append('search', params.search);
        return api.get(`/vehicle-documents?${queryParams.toString()}`);
    },

    getById: (id: number) =>
        api.get(`/vehicle-documents/${id}`),

    create: (data: DocumentData) => {
        const formData = new FormData();
        formData.append('vehicle_id', data.vehicle_id.toString());
        formData.append('title', data.title);
        if (data.file) {
            formData.append('file', data.file);
        }
        if (data.expires_date) {
            formData.append('expires_date', data.expires_date);
        }

        return api.post('/vehicle-documents', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    update: (id: number, data: Partial<DocumentData>) => {
        const formData = new FormData();
        
        if (data.title) formData.append('title', data.title);
        if (data.file) {
            formData.append('file', data.file);
        }
        if (data.expires_date !== undefined) {
            formData.append('expires_date', data.expires_date || '');
        }

        formData.append('_method', 'PUT');

        return api.post(`/vehicle-documents/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    delete: (id: number) =>
        api.delete(`/vehicle-documents/${id}`),
};

