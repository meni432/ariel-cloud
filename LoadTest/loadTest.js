const axios = require('axios');
const async = require('async');
const http = require('http');

// HTTP and HTTPS agents
const httpAgent = new http.Agent({ keepAlive: true, maxSockets: Infinity });

// Configuration
const endpoint = 'http://fib-lb-740211268.us-east-1.elb.amazonaws.com/?num=35'; // Set your endpoint URL here
const requestCount = 1000000; // Total number of requests to send
const concurrencyLevel = 4; // Number of concurrent requests, adjust based on system capacity

// Function to make an HTTP GET request
const makeRequest = (done) => {
  const startTime = Date.now();
  axios.get(endpoint, {
    httpAgent,
  })
    .then(response => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      console.log(`Response status: ${response.status}, Time Taken: ${duration} ms`);
      done(null, duration);
    })
    .catch(error => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      console.error(`Error: ${error.response ? error.response.status : error.message}, Time Taken: ${duration} ms`);
      done(error, duration);
    });
};

// Main function to perform the load test
const loadTest = () => {
  const tasks = Array.from({ length: requestCount }, () => makeRequest);
  async.parallelLimit(tasks, concurrencyLevel, (err, results) => {
    if (err) {
      console.error('A request failed:', err);
    } else {
      console.log('All requests completed successfully.');
      const totalDuration = results.reduce((total, current) => total + current, 0);
      const averageDuration = totalDuration / results.length;
      console.log('Average Request Time:', averageDuration, 'ms');
    }
  });
};

// Start the load testing
loadTest();
