import api from '@/lib/axios';

export const login = async (data: { email: string; password: string }) => {
	const response = await api.post('/auth/login', data);
	return response.data;
};

export const register = async (data: {
	email: string;
	password: string;
}) => {
	const response = await api.post('/auth/register', data);
	return response.data;
};
