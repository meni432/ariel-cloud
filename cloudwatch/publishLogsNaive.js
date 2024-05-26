
function generateRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

function printRandomNumber() {
    for (let i = 0; i < 100; i++) {
        console.log(JSON.stringify({ randomNumber: generateRandomNumber() }));
    }
}

function printSpecialNumber() {
    console.log(JSON.stringify({ randomNumber: 1000 }));
}

let count = 0;

const interval = setInterval(() => {
        printSpecialNumber();
        printRandomNumber();
}, 1000);


// node publishLogsNaive.js | pino-cloudwatch --group "test-log-group" --aws_region "us-east-1"