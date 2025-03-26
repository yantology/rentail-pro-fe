import { useState } from 'react';

interface UseTokenSubmitResult {
    isDisabled: boolean;
    status: string;
    submitToken: (email: string) => Promise<void>;
}

export const useTokenSubmit = (
    getToken: (email: string) => Promise<void>
): UseTokenSubmitResult => {
    const [isDisabled, setIsDisabled] = useState<boolean>(true);
    const [status, setStatus] = useState<string>('');

    const submitToken = async (email: string) => {
        try {
            setIsDisabled(true);
            setStatus('Mengirim...');

            // Simulate API call - replace with your actual API call
            await getToken(email);

            setStatus('token sudah terkirim ke email anda');
            setIsDisabled(false);
        } catch (error) {
            setStatus(error instanceof Error ? error.message : 'Terjadi kesalahan');
            setIsDisabled(true);
        }
    };


    return {
        isDisabled,
        status,
        submitToken,
    };
};