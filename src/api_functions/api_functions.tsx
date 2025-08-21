import { ChatFoodie24x7Response, ChatRequest } from "../models/ai_reply_model";
import { PromotionListResponse } from "../models/promotion_list_model";

export function getCurrentDateYYYYMMDD(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}${month}${day}`;
}


export const sendOTP = async (requestData: LoginOTPRequest): Promise<LoginOTPResponse | null> => {

    try {
        const response = await fetch('https://demo.restech.systems/api/Customer/LoginByPhoneAD', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });
        if (!response.ok) {
            console.error('API request failed with status', response.status);
            return null;
        }

        const data: LoginOTPResponse = await response.json();
        return data;
    } catch (error) {
        console.error('API request error:', error);
        return null;
    }
};

export const verifyOTP = async (requestData: VerifyOTPRequest): Promise<VerifyOTPResponse | null> => {

    try {
        const response = await fetch('https://demo.restech.systems/api/Customer/CheckLoginOTP', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });
        if (!response.ok) {
            console.error('API request failed with status', response.status);
            return null;
        }

        const data: VerifyOTPResponse = await response.json();
        return data;
    } catch (error) {
        console.error('API request error:', error);
        return null;
    }
};

export const promotionList_api = async (): Promise<PromotionListResponse | null> => {
    const username = 'askdahlia01300811';
    const password = '$pD^DLM383,G';
    const authHeader = 'Basic ' + btoa(`${username}:${password}`);
    // const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    try {
        const response = await fetch('https://foodie24x7.app.n8n.cloud/webhook/4a2a2ec3-6546-4f03-8286-0da9ed8b46a7', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
            },
            // body: JSON.stringify(requestData),
        });
        if (!response.ok) {
            console.error('API request failed with status', response.status);
            return null;
        }

        const data: PromotionListResponse = await response.json();
        return data;
    } catch (error) {
        console.error('API request error:', error);
        return null;
    }
};

export const ai_Chat_Reply_api = async (requestData:ChatRequest): Promise<ChatFoodie24x7Response | null> => {
    const username = 'askdahlia01300811';
    const password = '$pD^DLM383,G';
    const authHeader = 'Basic ' + btoa(`${username}:${password}`);
    // const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    try {
        const response = await fetch('https://foodie24x7.app.n8n.cloud/webhook/2d242ded-00b9-4bd9-9eb9-a4d34d661e7a', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
            },
            body: JSON.stringify(requestData),
        });
        if (!response.ok) {
            console.error('API request failed with status', response.status);
            return null;
        }

        const data: ChatFoodie24x7Response = await response.json();
        return data;
    } catch (error) {
        console.error('API request error:', error);
        return null;
    }
};