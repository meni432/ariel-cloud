export const handler = async (event) => {
    const isPrime = (num) => {
        if (num <= 1) return false;
        if (num <= 3) return true;
        if (num % 2 === 0 || num % 3 === 0) return false;
        for (let i = 5; i * i <= num; i += 6) {
            if (num % i === 0 || num % (i + 2) === 0) return false;
        }
        return true;
    };

    try {
        // Get the number from query parameters
        const number = parseInt(event.queryStringParameters.number, 10);
        if (isNaN(number)) {
            throw new Error('Invalid input');
        }
        
        // Check if the number is prime
        const result = isPrime(number);
        
        // Prepare the response
        const response = {
            statusCode: 200,
            body: JSON.stringify({ number: number, is_prime: result }),
        };
        return response;
    } catch (error) {
        const response = {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid input. Please provide a valid number in the query parameters.' }),
        };
        return response;
    }
};
