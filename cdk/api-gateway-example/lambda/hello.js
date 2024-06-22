exports.handler = async (event, context) => {
    try {
        // Your code logic goes here

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Hello, world!' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};