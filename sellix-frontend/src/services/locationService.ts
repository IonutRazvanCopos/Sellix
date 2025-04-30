import axios from 'axios';

const API_URL = 'https://api.countrystatecity.in/v1';
const API_KEY = import.meta.env.VITE_LOCATION_API_KEY;

const headers = {
  'X-CSCAPI-KEY': API_KEY,
};

export function fetchCounties() {
  return axios.get(`${API_URL}/countries/RO/states`, { headers }).then(response =>
    response.data.map((county: { name: string }) => ({
      ...county,
      name: county.name.replace(/ County$/i, ''),
    }))
  );
}

export function fetchCities(stateCode: string) {
  return axios.get(`${API_URL}/countries/RO/states/${stateCode}/cities`, { headers }).then(response => response.data);
}