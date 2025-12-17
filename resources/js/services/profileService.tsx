import api from './api';
import { ProfileData, ProfileUpdateResponse } from '../types/UserTypes';

export const profileService = {
  update: (data: ProfileData): Promise<{ data: ProfileUpdateResponse }> => {
    return api.put('/profile', data);
  },
  getProfile: () =>  api.get('/profile')
};
