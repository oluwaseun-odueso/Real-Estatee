const axios = require('axios');
require('dotenv').config();

class Transaction {
    secret_key: string | undefined;
    constructor () {
        this.secret_key = process.env.PAYSTACK_TOKEN
    }

    async initializeTransaction (data: any) {
        try {
            const response = await axios.post('https://api.paystack.co/transaction/initialize', data, {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Authorization": 'Bearer ' + this.secret_key
                }
            })
            return response.data.data
        } catch (error: any) {
            throw error.response.data
        }
    }

    // Insert reference number to verify payment
    async verifyPayment (reference: any) {
        try {
            const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`,{
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Authorization": 'Bearer ' + this.secret_key
                },
            })
            return response.data.data
        } catch (error: any) {
            throw error.response.data
        }
    }
}

export default new Transaction