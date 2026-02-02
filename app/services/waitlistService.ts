export interface WaitlistServiceResponse {
        name: string;
        institutionName: string;

    comment: string;
   
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