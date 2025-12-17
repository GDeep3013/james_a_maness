import api from './api';

interface ProfileData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
}

export const profileService = {
  update: (data: ProfileData) => {
    return api.put('/profile', data);
  },
};
