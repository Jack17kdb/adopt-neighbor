import axios from "axios";
import { paypalConfig } from "../lib/paypal.js";

export const generateAccessToken = async () => {
	try {
		const response = await axios({
			url: `${paypalConfig.baseUrl}/v1/oauth2/token`,
			method: "post",

			data: "grant_type=client_credentials",

			auth: {
				username: paypalConfig.clientId,
				password: paypalConfig.clientSecret
			},

			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		});

		return response.data.access_token;
	} catch (error) {
		console.error("PayPal Token Error:", error.response?.data || error.message);
		throw new Error("Failed to generate PayPal access token");
	}
};
