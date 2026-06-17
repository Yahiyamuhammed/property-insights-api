import axios from 'axios';

export const apiClient = axios.create({
  // Point this to your Node.js Express server
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});