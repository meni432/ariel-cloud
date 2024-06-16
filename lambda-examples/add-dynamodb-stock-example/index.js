const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

// Configuration
const REGION = "us-east-1"; // Replace with your AWS region
const TABLE_NAME = "StockTable"; // Replace with your table name
const ITEM_COUNT = 100; // Number of items to add

// Initialize DynamoDB clientls

const dynamoDBClient = new DynamoDBClient({ region: REGION });

// Function to generate a random stock price
const getRandomStockPrice = () => Math.floor(Math.random() * 100) + 1;

// Function to get current timestamp
const getCurrentTimestamp = () => Math.floor(Date.now() / 1000).toString();

// Function to create an item
const createItem = (index) => {
    return {
        StockName: { S: "Spotify" },
        Timestamp: { S: getCurrentTimestamp() },
        StockPrice: { N: getRandomStockPrice().toString() }
    };
};

// Function to add an item to DynamoDB
const addItemToDynamoDB = async (item) => {
    const params = {
        TableName: TABLE_NAME,
        Item: item
    };
    const command = new PutItemCommand(params);
    try {
        await dynamoDBClient.send(command);
        console.log(`Added item: ${JSON.stringify(item)}`);
    } catch (error) {
        console.error(`Error adding item: ${JSON.stringify(item)}`, error);
    }
};

// Main function to add multiple items
const main = async () => {
    for (let i = 1; i <= ITEM_COUNT; i++) {
        const item = createItem(i);
        await addItemToDynamoDB(item);
    }
    console.log(`Successfully added ${ITEM_COUNT} items to ${TABLE_NAME}`);
};

// Execute the main function
main().catch(console.error);
