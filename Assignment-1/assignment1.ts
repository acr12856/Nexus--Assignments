// axios used for sending HTTPS requests
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();
const openAiApiKey = process.env.OPENAI_API_KEY;
if (!openAiApiKey) {
    console.error("No OpenAI API key found.");
    process.exit(1);
}

/**
 * 
 * 
 * First call to OpenAI API: Send information and (hopefully) receive a response 
 * that tells us what method to call to obtain the random fact.
 * 
 * 
 */
const messages = [ //prompt to OpenAI
    { role: "system", content: "You need to get a random fact." },
];

//Function that implements function calling. OpenAI API will tell us which function to call to get our random fact.
const response = async () => {
    try {
        const msgFromOpenAI = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o',
                messages: messages,
                functions: [ //define potential functions to call
                    {
                        name: "getRandomFact",
                        description: "Get a random fact. Call this to get a random fact.",
                        parameters: {}
                    }
                ],
                function_call: { name: "getRandomFact" }  // explicitly specify function name to call, can make this "auto" if we had multiple methods and wanted OpenAI to choose which to call
            },
            {
                headers: {
                    'Authorization': `Bearer ${openAiApiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return msgFromOpenAI.data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            // TypeScript now knows error is of type AxiosError
            if (error.response) {
                console.error("Error response data:", error.response.data);
                console.error("Error status:", error.response.status);
                console.error("Error headers:", error.response.headers);
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Error message:", error.message);
            }
        } else {
            // Handle non-Axios errors
            console.error("Unexpected error:", error);
        }

        throw new Error("Failed to retrieve data from OpenAI API");
    }
};

//Function we want OpenAI to tell us to call. Actually obtains the random fact by calling the useless facts API
const getRandomFact = async (): Promise<string> => {
    try {
        const response = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random', {
            headers: {
                "Accept": "application/json" //get response in json format
            }
        });
        return response.data.text; // Extract the fact text
    } catch (error) {
        console.error("Error getting random fact:", error);
        return "Could not retrieve a random fact.";
    }
};

//Function that executes the obtainment of the random fact
const toolCall = async (): Promise<string> => {
    const apiResponse = await response();
    const toolCall = apiResponse.choices[0].message.function_call;
    if (toolCall && toolCall.name === "getRandomFact") {
        console.log("\nFunction call triggered:", toolCall);
        const randomFact = await getRandomFact();
        console.log("\nRandom Fact:", randomFact, "\n");
        return randomFact
    } else {
        console.log("No function call found in response.");
        return "No function call found"
    }
};

/**
 * 
 * 
 * Second call to OpenAI API: Send information and (hopefully) receive a response 
 * that tells us what method to call to elaborate on the provided random fact.
 * 
 * 
 */
const messages_2 = [
    { role: "system", content: "You need to elaborate on a given random fact." },
];

//Function that implements function calling. OpenAI API will tell us which function to call to elaborate our random fact.
const response_2 = async () => {
    try {
        const msgFromOpenAI = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o',
                messages: messages_2,
                functions: [ //define potential functions to call
                    {
                        name: "elaborateRandomFact",
                        description: "Elaborate on a given random fact. Call this to elaborate on a given random fact.",
                        parameters: { //parameters for this function
                            "type": "object",
                            "properties": {
                                "randomFact": {
                                    "type": "string",
                                    "description": "The random fact to be elaborated on."
                                }
                            },
                            "required": ["randomFact"]
                        }
                    }
                ],
                function_call: { name: "elaborateRandomFact" }  // explicitly specify function name, can make this "auto" if we had multiple methods and wanted OpenAI to choose which to call
            },
            {
                headers: {
                    'Authorization': `Bearer ${openAiApiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return msgFromOpenAI.data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            // TypeScript now knows error is of type AxiosError
            if (error.response) {
                console.error("Error response data:", error.response.data);
                console.error("Error status:", error.response.status);
                console.error("Error headers:", error.response.headers);
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Error message:", error.message);
            }
        } else {
            // Handle non-Axios errors
            console.error("Unexpected error:", error);
        }

        throw new Error("Failed to retrieve data from OpenAI API");
    }
};

//Function we want OpenAI to tell us to call. Actually obtains the elaboraton on our random fact by calling OpenAPI again. 
const elaborateRandomFact = async (randomFact: string) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-4o",
                messages: [{ role: 'user', content: `Here is a fun fact: "${randomFact}". Can you provide a creative comment or additional information about it?` }]
            },
            {
                headers: {
                    'Authorization': `Bearer ${openAiApiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
    }
};

//Function that executes the obtainment of the elaboration of our random fact
const toolCall_2 = async (randomFact: string) => {
    const apiResponse = await response_2();  // Await the response
    const toolCall_2 = apiResponse.choices[0].message.function_call;

    if (toolCall_2 && toolCall_2.name === "elaborateRandomFact") {
        console.log("Function call triggered:", toolCall_2);
        const elaboration = await elaborateRandomFact(randomFact);  // Call your fact-fetching function
        console.log("\nOpenAI's Response:\n", elaboration, "\n");
    } else {
        console.log("No function call found in response.");
    }
};

//Run program
toolCall().then(randomFact => {
    toolCall_2(randomFact);
});