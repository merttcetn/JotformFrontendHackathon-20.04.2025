const API_KEY = "297573601db060dc8f2ad816457a599e"; // personal api key
const BASE_URL = "https://api.jotform.com"; // endpoint url

export const fetchPaymentInfo = async (formId) => {
    /* console.log("Starting fetchPaymentInfo with formId:", formId);
    console.log("API Key:", API_KEY);
    console.log(
        "Full URL:",
        `${BASE_URL}/form/${formId}/payment-info?apiKey=${API_KEY}`
    ); */

    try {
        /* console.log("Making API request..."); */
        const response = await fetch(
            `${BASE_URL}/form/${formId}/payment-info?apiKey=${API_KEY}`
        );
        /* console.log("Response status:", response.status);
        console.log("Response headers:", response.headers); */

        if (!response.ok) {
            console.error(
                "Response not OK:",
                response.status,
                response.statusText
            );
            throw new Error(
                `Failed to fetch payment information: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();
        /* console.log("Raw response data:", data);
        console.log(
            "Total products in response:",
            data.content?.products?.length || 0
        ); */

        // Check if the response has the expected format
        if (!data || !data.content) {
            console.error("Invalid response format:", data);
            throw new Error("Invalid response format from API");
        }

        return data;
    } catch (error) {
        console.error("Error in fetchPaymentInfo:", error);
        console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name,
        });
        throw error;
    }
};
