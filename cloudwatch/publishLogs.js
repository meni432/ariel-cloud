const { CloudWatchLogsClient, CreateLogGroupCommand, CreateLogStreamCommand, PutLogEventsCommand } = require("@aws-sdk/client-cloudwatch-logs");

// Create a CloudWatch Logs client
const client = new CloudWatchLogsClient({ region: "us-east-1" });

async function publishLogs() {
    const logGroupName = "test-log-group";
    const logStreamName = "test-log-stream";

    // Create the log group if it doesn't exist
    try {
        await client.send(new CreateLogGroupCommand({ logGroupName }));
        console.log(`Log group ${logGroupName} created`);
    } catch (err) {
        if (err.name !== "ResourceAlreadyExistsException") {
            console.error("Error creating log group:", err);
            return;
        }
    }

    // Create the log stream if it doesn't exist
    try {
        await client.send(new CreateLogStreamCommand({ logGroupName, logStreamName }));
        console.log(`Log stream ${logStreamName} created`);
    } catch (err) {
        if (err.name !== "ResourceAlreadyExistsException") {
            console.error("Error creating log stream:", err);
            return;
        }
    }

     // Generate random numbers and prepare log events
     const logEvents = Array.from({ length: 100 }, () => ({
        timestamp: Date.now(),
        message: JSON.stringify({
            randomNumber: Math.floor(Math.random() * 100) + 1,
        }),
    }));


    const specialLogEvent = {
        timestamp: Date.now(),
        message: JSON.stringify({
            randomNumber: 1000,
        }),
    };

    logEvents.push(specialLogEvent);

    // Put log events
    try {
        const result = await client.send(new PutLogEventsCommand({
            logGroupName,
            logStreamName,
            logEvents,
        }));
        console.log("Log events sent:", result);
    } catch (err) {
        console.error("Error putting log events:", err);
    }
}

// Call the publishLogs function to publish logs
publishLogs();


// publish log periodicly
setInterval(publishLogs, 1000);