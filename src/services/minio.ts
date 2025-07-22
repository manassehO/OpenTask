import { Client } from 'minio';

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT.replace(/^https?:\/\//, '').split(
    ':',
  )[0]!,
  port: Number(process.env.MINIO_ENDPOINT.split(':').pop() ?? 9000),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

const BUCKET = process.env.MINIO_BUCKET ?? 'opentask-dev';

export async function ensureBucketExists() {
  const exists = await minioClient.bucketExists(BUCKET);
  if (!exists) {
    console.log(`Making Bucket: ${BUCKET}`);
    await minioClient.makeBucket(BUCKET, '');
  }
}

export async function uploadBase64FileToMinio(
  base64: string,
  objectName: string,
  mimetype: string,
) {
  await ensureBucketExists();
  const cleanBase64 = base64.replace(/^data:.*;base64,/, '');
  console.log(cleanBase64);
  const buffer = Buffer.from(cleanBase64, 'base64');
  const meta = { 'Content-Type': mimetype };

  await minioClient.putObject(BUCKET, objectName, buffer, meta);

  return `${process.env.MINIO_ENDPOINT}/${BUCKET}/${objectName}`;
}
