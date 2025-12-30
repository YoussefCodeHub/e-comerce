import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.REGION!,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

export const uploadToS3 = async (
  buffer: Buffer,
  key: string,
  mimetype: string,
): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  });

  await s3.send(command);
  return `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${key}`;
};

export const deleteFromS3 = async (key: string): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.BUCKET_NAME!,
    Key: key,
  });
  await s3.send(command);
};
