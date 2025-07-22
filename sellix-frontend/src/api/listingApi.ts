import axios from './axios';

export const createListing = async (formData: FormData, token: string) => {
  const response = await axios.post('/listings', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};