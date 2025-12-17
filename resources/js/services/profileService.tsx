import api from './api';
import { ProfileData, ProfileUpdateResponse, UserResponse } from '../types/UserTypes';

export const profileService = {
  update: (data: ProfileData): Promise<{ data: ProfileUpdateResponse }> => {
    return api.put('/profile', data);
  },
  getProfile: (): Promise<{ data: UserResponse }> => {
    return api.get('/profile');
  },
};


