// axios used for sending HTTPS requests
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const openAiApiKey = process.env.OPENAI_API_KEY;

if (!openAiApiKey) {
    console.error("No OpenAI API key found.");
    process.exit(1);
}

// Function to get random fact from the Random Useless Facts API
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

// Function to send fact to OpenAI and get a response
const processWithOpenAI = async (fact: string) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/completions',
            {
                model: "gpt-3.5-turbo-instruct",
                prompt: `Here is a fun fact: "${fact}". Can you provide a creative comment or additional information about it?`,
                max_tokens: 100, //limit word count
                temperature: 0.5 //make responses more concise/factual rather than creative/verbose
            },
            {
                headers: {
                    'Authorization': `Bearer ${openAiApiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("\nFact from API:\n", fact, "\n");
        console.log("OpenAI's response:\n", response.data.choices[0].text.trim(), "\n");
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
    }
};


const run = async () => {
    const fact = await getRandomFact();
    await processWithOpenAI(fact);
};

run();
