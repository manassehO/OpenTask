import { Client } from 'minio';
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
  private client: Client;
  private defaultBucket: string;

  constructor() {
    this.client = new Client({
      endPoint: process.env.S3_ENDPOINT || 'localhost',
      port: parseInt(process.env.S3_PORT || '9000'),
      useSSL: process.env.S3_USE_SSL === 'true',
      accessKey: process.env.S3_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.S3_SECRET_KEY || 'minioadmin',
    });

    this.defaultBucket = process.env.S3_BUCKET_NAME || 'opentask-submissions';
  }

  /**
   * Initialize the storage service by ensuring the bucket exists
   */
  async initialize(): Promise<void> {
    try {
      const bucketExists = await this.client.bucketExists(this.defaultBucket);
      if (!bucketExists) {
        await this.client.makeBucket(this.defaultBucket);
        console.log(`Created bucket: ${this.defaultBucket}`);
      }
    } catch (error) {
      console.error('Failed to initialize storage service:', error);
      throw new Error('Storage service initialization failed');
    }
  }

  /**
   * Upload a file to storage
   */
  async uploadFile(options: UploadOptions): Promise<UploadResult> {
    const {
      fileName,
      fileBuffer,
      contentType,
      bucketName = this.defaultBucket,
    } = options;

    // Generate a unique key to avoid collisions
    const fileExtension = fileName.split('.').pop();
    const uniqueKey = `submissions/${randomUUID()}.${fileExtension}`;

    try {
      await this.client.putObject(
        bucketName,
        uniqueKey,
        fileBuffer,
        fileBuffer.length,
        {
          'Content-Type': contentType,
          'X-Original-Filename': fileName,
        },
      );

      // Generate the URL for the uploaded file
      const url = await this.client.presignedGetObject(
        bucketName,
        uniqueKey,
        24 * 60 * 60,
      ); // 24 hour expiry

      return {
        url,
        key: uniqueKey,
        bucket: bucketName,
      };
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw new Error('File upload failed');
    }
  }

  /**
   * Get a presigned URL for file access
   */
  async getFileUrl(
    key: string,
    bucketName?: string,
    expirySeconds = 24 * 60 * 60,
  ): Promise<string> {
    try {
      return await this.client.presignedGetObject(
        bucketName || this.defaultBucket,
        key,
        expirySeconds,
      );
    } catch (error) {
      console.error('Failed to get file URL:', error);
      throw new Error('Failed to generate file URL');
    }
  }

  /**
   * Delete a file from storage
   */
  async deleteFile(key: string, bucketName?: string): Promise<void> {
    try {
      await this.client.removeObject(bucketName || this.defaultBucket, key);
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw new Error('File deletion failed');
    }
  }

  /**
   * Validate file before upload (size, type restrictions)
   */
  validateFile(
    file: File,
    maxSizeBytes = 10 * 1024 * 1024,
  ): { isValid: boolean; error?: string } {
    // Check file size (default 10MB)
    if (file.size > maxSizeBytes) {
      return {
        isValid: false,
        error: `File size exceeds ${maxSizeBytes / (1024 * 1024)}MB limit`,
      };
    }

    // Check file type - only allow common submission file types
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

// Export a singleton instance
export const storageService = new StorageService();
