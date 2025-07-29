import { Client } from 'minio';
import { env } from '../env.js';

const minioClient = new Client({
  endPoint: env.MINIO_ENDPOINT.replace(/^https?:\/\//, '').split(':')[0]!,
  port: Number(env.MINIO_ENDPOINT.split(':').pop() ?? 9000),
  useSSL: env.MINIO_USE_SSL === 'true',
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
});

const BUCKET = env.MINIO_BUCKET ?? 'opentask-dev';

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

  await minioClient.putObject(BUCKET, objectName, buffer, undefined, meta);

  return `${process.env.MINIO_ENDPOINT}/${BUCKET}/${objectName}`;
}
