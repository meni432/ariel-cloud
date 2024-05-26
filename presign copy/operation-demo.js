const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");


async function main() {
    const bucket = "menisamet-grade";
    const key = "00.jpg";
    const region = "us-east-1";

    const client = new S3Client({ region });

    const getObjectParams = {
        Bucket: bucket,
        Key: key,
    };

    // const command = new GetObjectCommand(getObjectParams);
    const command = new PutObjectCommand(getObjectParams);
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    console.log("PRESIGNED URL: ", url);
}

main();