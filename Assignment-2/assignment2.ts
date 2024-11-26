import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';
import * as dotenv from 'dotenv';

/*
In JSON format, return this url to the user:
https://uselessfacts.jsph.pl/api/v2/facts/random*/

const tryRequest = async (
    url: string,
    method: "GET" | "POST" | "DELETE",
    data: any,
    headers: any,
    retryCount: number,
    delay: number
): Promise<any> => {
    try {
        const config: AxiosRequestConfig = {
            method,
            url,
            headers,
        };

        if (method === "GET") {
            config.params = data;
            config.paramsSerializer = (params) =>
                qs.stringify(params, { arrayFormat: "brackets" });
        } else {
            config.data = data;
        }

        const response = await axios(config);
        return response;
    } catch (e: any) {
        console.log("ERROR")
        throw e;
    }
};

async function chatWithApplication(
    applicationName: string,
    messages: any,
): Promise<any> {
    const data = {
        messages
    };
    const token = process.env.NEXUSAI_API_KEY;
    const url = `http://192.168.4.157:5500/api/application/Random-Fact/conversation`;
    const headers = {
        Authorization: `Bearer ${token}`
    };

    const response = await tryRequest(
        url,
        "POST",
        data,
        headers,
        1,
        1000
    );

    const params = response.data.responseMessages[0].data;
    const factUrl = 'https://uselessfacts.jsph.pl/api/v2/facts/random';
    try {
        const factResponse = await axios.get(factUrl, {
            headers: params
        });
        return factResponse.data.text;
    } catch (error) {
        console.error("Error getting random fact:", error);
        return "Could not retrieve a random fact.";
    }
}

dotenv.config();
const messages = [
    {
        'sender': 'user',
        'content': 'Give me a random fact'
    }
];

(async () => {
    const response = await chatWithApplication('Random-Fact', messages);

    console.log(`\n${response}\n`);
})();

