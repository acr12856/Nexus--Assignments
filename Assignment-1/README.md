# Assignment-1
Problem Statement: Function-calling with OpenAI
- Create a typescript script that hits a random API using the OpenAI API
- There are free APIs https://rapidapi.com 
- For more info, read here: https://platform.openai.com/docs/guides/function-calling

To run the code, you must install axios and dotenv. Install these libraries with:
```
npm install axios               
npm install dotenv
```

Since the code interacts with the OpenAI API, you need to create a .env file and store your OpenAI API key there in the following format:
```
OPENAI_API_KEY = INSERT YOUR OPENAI API KEY
```

The code in assignment-1.ts can be run with the command:
```
npx ts-node assignment1.ts
```      
