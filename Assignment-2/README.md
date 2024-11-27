# Assignment-2
Problem Statement: Function-calling with NexusGenAI
- Download NexusGenAl and get it running locally
- Within NexusGenAl, create an API key. Save it in a .env file
- Important: create a file called .gitignore and type .env at the top. Do not commit the .env file
- Create a prompt in nexusgenai
- Create an application in nexusgenai
- Create a typescript or JavaScript script that calls the application and hits the API from assignment 1

We are asking the application in NexusGenAI to "Give us a random fact", to which it will find the corresponding prompt in the application and return the appropriate parameters needed to call the api.

To run the code, you must install axios, querystring, and dotenv. Install these libraries with:
```
npm install axios
npm install qs            
npm install dotenv
```

Make sure to set environment variables in a .env file. 

The code in assignment-2.ts can be run with the command:
```
ts-node assignment2.ts
```      
