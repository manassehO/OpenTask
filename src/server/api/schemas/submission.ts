import { z } from 'zod';

// Schema for submission data validation
export const submitTaskSchema = z
  .object({
    taskId: z.string().uuid('Invalid task ID format'),
    submissionType: z.enum(['text', 'file', 'url', 'mixed'], {
      errorMap: () => ({
        message: 'Submission type must be text, file, url, or mixed',
      }),
    }),
    textContent: z.string().optional(),
    submissionUrl: z.string().url('Invalid URL format').optional(),
    fileMetadata: z
      .object({
        fileName: z.string(),
        fileSize: z.number(),
        contentType: z.string(),
        storageKey: z.string(),
      })
      .optional(),
    additionalNotes: z
      .string()
      .max(1000, 'Additional notes cannot exceed 1000 characters')
      .optional(),
  })
  .refine(
    (data) => {
      // At least one submission method must be provided
      const hasText = data.textContent && data.textContent.trim().length > 0;
      const hasUrl = data.submissionUrl;
      const hasFile = data.fileMetadata;

      if (!hasText && !hasUrl && !hasFile) {
        return false;
      }

      // Validate submission type matches content
      if (data.submissionType === 'text' && !hasText) {
        return false;
      }

      if (data.submissionType === 'file' && !hasFile) {
        return false;
      }

      if (data.submissionType === 'url' && !hasUrl) {
        return false;
      }

      return true;
    },
    {
      message: 'Submission must include content matching the specified type',
    },
  );

export const fileUploadSchema = z.object({
  taskId: z.string().uuid(),
  file: z.any(), // Will be validated in the API route
});

export type SubmitTaskInput = z.infer<typeof submitTaskSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
