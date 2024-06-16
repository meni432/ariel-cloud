import { CloudWatchClient, PutMetricDataCommand } from "@aws-sdk/client-cloudwatch";

const cloudWatchClient = new CloudWatchClient({ region: 'us-east-1' }); // Replace 'your-region' with your AWS region

export const handler = async (event) => {
    try {
        const records = event.Records;

        if (records.length === 0) {
            console.log("No records to process.");
            return;
        }

        let totalStockPrice = 0;
        let itemCount = 0;
        let stockName = '';

        records.forEach(record => {
            if (record.eventName === 'INSERT') {
                const newItem = record.dynamodb.NewImage;
                const stockPrice = parseFloat(newItem.StockPrice.N);
                totalStockPrice += stockPrice;
                itemCount += 1;
                stockName = newItem.StockName.S; // Get the stock name dynamically
            }
        });

        if (itemCount === 0) {
            console.log("No new items to process.");
            return;
        }

        const avgStockPrice = totalStockPrice / itemCount;
        console.log(`Average stock price: ${avgStockPrice}`);

        // Publish the average stock price to CloudWatch
        const metricData = {
            MetricData: [
                {
                    MetricName: "AverageStockPrice",
                    Dimensions: [
                        {
                            Name: "StockName",
                            Value: stockName
                        }
                    ],
                    Unit: "None",
                    Value: avgStockPrice
                }
            ],
            Namespace: "StockMetrics"
        };

        const command = new PutMetricDataCommand(metricData);
        await cloudWatchClient.send(command);

        console.log("Metric published to CloudWatch.");
    } catch (error) {
        console.error("Error processing DynamoDB stream or publishing to CloudWatch:", error);
    }
};
