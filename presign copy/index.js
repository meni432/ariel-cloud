const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const express = require('express');
const app = express();

app.use(express.json());

const bucket = "menisamet-grade";
const region = "us-east-1";

const client = new S3Client({ region });

// Endpoint for getting a file
app.get('/getURLForDownload/:filename', async (req, res) => {
    const fileKey = req.params.filename;
    const presignUrl = await getPresignURL(fileKey, 'get');
    res.send({url: presignUrl});
    console.log("getUploadedFileURL: ", presignUrl);
});

// Endpoint for uploading a file
app.get('/getURLForUpload/:filename', async (req, res) => {
    const fileKey = req.params.filename;
    const presignUrl = await getPresignURL(fileKey, 'put');
    res.send({url: presignUrl});
    console.log("getUploadFileURL: ", presignUrl);
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

async function getPresignURL(fileKey, action) {
    const getObjectParams = {
        Bucket: bucket,
        Key: fileKey,
    };

    let command = undefined;
    switch (action) {
        case 'get':
            command = new GetObjectCommand(getObjectParams);
            break;
        case 'put':
            command = new PutObjectCommand(getObjectParams);
            break;
        default:
            throw new Error('Invalid action');
    }
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    return url;
}