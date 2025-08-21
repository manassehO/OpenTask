import { uploadBase64FileToMinio, ensureBucketExists } from './minio';
import { randomUUID } from 'crypto';
import { env } from '../env.js';

interface UploadOptions {
  fileName: string;
  fileBuffer: Buffer;
  contentType: string;
  bucketName?: string;
}

interface UploadResult {
  url: string;
  key: string;
  bucket: string;
}

class StorageService {
  private defaultBucket: string;

  constructor() {
<<<<<<< HEAD
<<<<<<< HEAD
    this.defaultBucket = process.env.MINIO_BUCKET ?? 'opentask-dev';
=======
<<<<<<< HEAD
    this.defaultBucket = process.env.MINIO_BUCKET ?? 'opentask-dev';
=======
    this.defaultBucket = env.MINIO_BUCKET ?? 'opentask-dev';
>>>>>>> 781c1f28b786d98b9a7ab8421069b68a5dc120c6
>>>>>>> 082d35cd282ffce9fa75cf98886a0d0ccf458ffa
=======
    this.defaultBucket = env.MINIO_BUCKET ?? 'opentask-dev';
>>>>>>> 7885bb9721738fa4d63015d57940d910db482bbb
  }

  async initialize(): Promise<void> {
    try {
      await ensureBucketExists();
      console.log(`Bucket ensured: ${this.defaultBucket}`);
    } catch (error) {
      console.error('Failed to initialize storage service:', error);
      throw new Error('Storage service initialization failed');
    }
  }

  /**
   * Uploading file to storage using existing MinIO service
   */
  async uploadFile(options: UploadOptions): Promise<UploadResult> {
    const { fileName, fileBuffer, contentType } = options;

    const fileExtension = fileName.split('.').pop();
    const uniqueKey = `submissions/${randomUUID()}.${fileExtension}`;

    try {
      await ensureBucketExists();

      // Convert buffer to base64 for existing MinIO service
      const base64Data = `data:${contentType};base64,${fileBuffer.toString('base64')}`;

      const url = await uploadBase64FileToMinio(
        base64Data,
        uniqueKey,
        contentType,
      );

      return {
        url,
        key: uniqueKey,
        bucket: this.defaultBucket,
      };
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw new Error('File upload failed');
    }
  }

  async getFileUrl(
    key: string,
    bucketName?: string,
    // expirySeconds = 24 * 60 * 60,
  ): Promise<string> {
    try {
<<<<<<< HEAD
      // For MinIO, we'll construct the direct URL since existing service returns direct URLs
<<<<<<< HEAD
      const endpoint = process.env.MINIO_ENDPOINT ?? 'http://localhost:9000';
=======
=======
      // For MinIO, we'll construct the direct URL since existing service returns direct URL
>>>>>>> 7885bb9721738fa4d63015d57940d910db482bbb
      const endpoint = env.MINIO_ENDPOINT ?? 'http://localhost:9000';
>>>>>>> 082d35cd282ffce9fa75cf98886a0d0ccf458ffa
      const bucket = bucketName ?? this.defaultBucket;
      return `${endpoint}/${bucket}/${key}`;
    } catch (error) {
      console.error('Failed to get file URL:', error);
      throw new Error('Failed to generate file URL');
    }
  }

  async deleteFile(key: string, bucketName?: string): Promise<void> {
    try {
<<<<<<< HEAD
      console.log(key, bucketName) 
=======
      console.log(key, bucketName);
>>>>>>> 082d35cd282ffce9fa75cf98886a0d0ccf458ffa
      // Note: Existing MinIO service doesn't expose delete function
      // This would need to be implemented if file deletion is required
      console.warn('File deletion not implemented with existing MinIO service');
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw new Error('File deletion failed');
    }
  }

  validateFile(
    file: File,
    maxSizeBytes = 10 * 1024 * 1024,
  ): { isValid: boolean; error?: string } {
    if (file.size > maxSizeBytes) {
      return {
        isValid: false,
        error: `File size exceeds ${maxSizeBytes / (1024 * 1024)}MB limit`,
      };
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/zip',
      'application/x-zip-compressed',
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error:
          'File type not allowed. Please upload PDF, DOC, TXT, images, or ZIP files.',
      };
    }

    return { isValid: true };
  }
}

export const storageService = new StorageService();
