import { analyticsService } from '@/app/services/analyticsService';

export interface WaitlistServiceConfig {

     name: string;
     email: string;
     institutionName: string;
     description: string;
     comment: string;
}

export interface WaitlistServiceResponse {
        name: string;
        institutionName: string;

    comment: string;
   
  }



export const joinWaitlist = async (data: WaitlistServiceConfig) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/waitlist`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to join waitlist');
    }

    return response.json();
}

export const getWaitlist = async (): Promise<WaitlistServiceResponse[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/waitlist/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch waitlist');
    }

    return response.json();
}