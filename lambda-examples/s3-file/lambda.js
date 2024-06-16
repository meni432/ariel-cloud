import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client();

export const handler = async (event) => {
    console.log('S3 file uploaded', JSON.stringify(event));
    
    const bucketName = event.Records[0].s3.bucket.name;
    const objectKey = event.Records[0].s3.object.key;
    
    if (objectKey.startsWith('tagged-')) {
        console.log('get trigger for tagged file, ignore');
        return;
    }

    try {
        const currentDate = new Date().toISOString();
        
        const taggedContent = `File Name: ${objectKey}\nDate Uploaded: ${currentDate}`;
        const taggedKey = `tagged-${objectKey}.txt`;
        
        const params = {
            Bucket: bucketName,
            Key: taggedKey,
            Body: taggedContent
        };
        
        await s3.send(new PutObjectCommand(params));
        console.log(`Successfully created ${taggedKey} in ${bucketName}`);
    } catch (error) {
        console.error('Error processing S3 event:', error);
    }
};
