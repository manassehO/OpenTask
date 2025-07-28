import { uploadBase64FileToMinio, ensureBucketExists } from './minio';
import { randomUUID } from 'crypto';

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
    this.defaultBucket = process.env.MINIO_BUCKET || 'opentask-dev';
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
    expirySeconds = 24 * 60 * 60,
  ): Promise<string> {
    try {
      // For MinIO, we'll construct the direct URL since existing service returns direct URLs
      const endpoint = process.env.MINIO_ENDPOINT || 'http://localhost:9000';
      const bucket = bucketName || this.defaultBucket;
      return `${endpoint}/${bucket}/${key}`;
    } catch (error) {
      console.error('Failed to get file URL:', error);
      throw new Error('Failed to generate file URL');
    }
  }

  async deleteFile(key: string, bucketName?: string): Promise<void> {
    try {
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
