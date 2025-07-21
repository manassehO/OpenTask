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

const BUCKET = process.env.MINIO_BUCKET;

export async function ensureBucketExists() {
  const exists = await minioClient.bucketExists(BUCKET);
  if (!exists) {
    console.log(`Making Bucket: ${BUCKET}`);
    await minioClient.makeBucket(BUCKET, '');
  }
}

/* export async function uploadFileToMinio(file: Buffer, filename: string, mimetype: string): Promise<string> {
  await ensureBucketExists();
  const objectName = `${Date.now()}-${filename}`;
  await minioClient.putObject(BUCKET, objectName, file, { 'Content-Type': mimetype });
  
  // Return a path-style URL
  return `${process.env.MINIO_ENDPOINT}/${BUCKET}/${objectName}`;
} */

export async function uploadBase64FileToMinio(
  base64: string,
  objectName: string,
  mimetype: string,
) {
  await ensureBucketExists();
  const buffer = Buffer.from(base64, 'base64');
  const meta = { 'Content-Type': mimetype };

  await minioClient.putObject(
    process.env.MINIO_BUCKET!,
    objectName,
    buffer,
    meta,
  );

  return `${process.env.MINIO_ENDPOINT}/${BUCKET}/${objectName}`;
}
