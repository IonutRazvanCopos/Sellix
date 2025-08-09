import axios from '../api/axios';

export const AdminAPI = {
  getPending: () => axios.get('/admin/pending-listings'),
  getHidden: () => axios.get('/admin/hidden-listings'),
  approve: (id: number) => axios.put(`/admin/approve-listing/${id}`),
  hide: (id: number) => axios.put(`/admin/hide-listing/${id}`),
  unhide: (id: number) => axios.put(`/admin/unhide-listing/${id}`),
};