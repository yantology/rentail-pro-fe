import { http } from '@/utils/fetch';
import type { MessageResponse } from './models/response';

export const getToken = async (
    type: 'registration' | 'forget-password',
    email: string
): Promise<MessageResponse> => {
    try {
        const response = await http.post(
            `${import.meta.env.VITE_API_URL}/auth/token/${type}`,
            { email }
        );

        console.log('API URL:', import.meta.env.VITE_API_URL);
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch token');
        }
        return data.message as MessageResponse;
    } catch (error) {
        throw new Error('Failed to fetch token: ' + error);
    }
};

export const register = async (
    email: string,
    fullname: string,
    password: string,
    passwordConfirmation: string,
    activationCode: string
): Promise<MessageResponse> => {
    try {
        const response = await http.post(
            `${import.meta.env.VITE_API_URL}/auth/register`,
            {
                email,
                fullname,
                password,
                password_confirmation: passwordConfirmation,
                activation_code: activationCode
            }
        );

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to register');
        }
        return data.message as MessageResponse;
    } catch (error) {
        throw new Error('Failed to register: ' + error);
    }
};

export const forgetPassword = async (
    email: string,
    password: string,
    passwordConfirmation: string,
    activationCode: string
): Promise<MessageResponse> => {
    try {
        const response = await http.post(
            `${import.meta.env.VITE_API_URL}/auth/forget-password`,
            {
                email,
                new_password: password,
                new_password_confirmation: passwordConfirmation,
                activation_code: activationCode
            }
        );

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to reset password');
        }
        return data.message as MessageResponse;
    } catch (error) {
        throw new Error('Failed to reset password: ' + error);
    }
}




