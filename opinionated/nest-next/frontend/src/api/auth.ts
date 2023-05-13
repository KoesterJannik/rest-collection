import axios from 'axios';
import { TRegisterUser } from './types';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const axiosWithHeaders = () => {
  const token = localStorage.getItem('token') || '';
  return axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// Removed the duplicate registerUser function with hardcoded URL
export const registerUser = (data: TRegisterUser) => {
  console.log(BASE_URL);
  return axiosWithHeaders().post(`${BASE_URL}/auth/register`, data);
};

export const loginUser = (data: TRegisterUser) =>
  axiosWithHeaders().post(`${BASE_URL}/auth/login`, data);

// Removed the extra curly brace
export const getUserDetails = () =>
  axiosWithHeaders().get(`${BASE_URL}/users/me`);
