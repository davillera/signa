import api from '@/lib/axios';
import { getAuthToken } from '@/lib/cookies';

export async function getAllBrands() {
	const token = getAuthToken();
	const response = await api.get('/brands', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
}

export async function createBrand(data: FormData) {
	const token = getAuthToken();
	const response = await api.post('/brands', data, {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'multipart/form-data',
		},
	});
	return response.data;
}

export async function updateBrand(id: string, data: FormData) {
	const token = getAuthToken();
	const response = await api.patch(`/brands/${id}`, data, {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'multipart/form-data',
		},
	});
	return response.data;
}

export async function deleteBrand(id: string) {
	const token = getAuthToken();
	const response = await api.delete(`/brands/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
}