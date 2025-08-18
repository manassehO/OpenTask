import { z } from 'zod';

// Allowed status values
const allowedStatus = [
  'DRAFT',
  'ACTIVE',
  'COMPLETED',
  'CANCELLED',
  'DISPUTED',
] as const;

export const getTaskByIdSchema = z.object({
  taskId: z.string().uuid(),
});

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(60, 'Title must be at most 60 characters'),
  description: z.string().min(1, 'Description is required'),
  instructions: z.string().min(1, 'Instructions are required'),
  category: z.string().min(1, 'Category is required'),
  maxCompletions: z.number().int().min(1, 'Max completions must be at least 1'),
  rewardAmount: z
    .string()
    .refine((val) => /^\d+(\.\d{1,20})?$/.test(val) && parseFloat(val) > 0, {
      message:
        'Invalid reward amount: must be a positive number with up to 20 digits and no decimals (scale = 0)',
    }),
  rewardTokenAddress: z
    .string()
    .max(100, 'Reward token address must be at most 100 characters')
    .refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val), {
      message: 'Invalid rewardTokenAddress format',
    }),
  platformFee: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === undefined || (/^\d{1,20}$/.test(val) && parseInt(val) >= 0),
      {
        message:
          'Invalid platform fee: must be a non-negative integer up to 20 digits',
      },
    ),
  requiredCompletions: z
    .number()
    .int()
    .min(1, 'requiredCompletions must be at least 1'),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid deadline date format',
  }),
  image: z
    .string()
    .max(255, 'Image URL must be at most 255 characters')
    .optional(),
  status: z.enum(allowedStatus), // assumed taskStatusEnum is mapped to allowedStatus
  fundingTxHash: z
    .string()
    .max(255, 'Funding transaction hash must be at most 255 characters')
    .refine((val) => /^0x[a-fA-F0-9]{64}$/.test(val), {
      message: 'Invalid fundingTxHash format',
    }),
  tags: z.array(z.string().min(1)).min(1, 'At least one tag is required'),
  example: z.string().optional(),
  specialRequirements: z.string().optional(),
});

export const findTaskSchema = z.object({
  category: z.string().optional(),
  min_reward: z.coerce.number().min(0).optional(), // minimum zero ensures that no negative minimum reward is provided
  sort_by: z.enum(['created_at', 'reward']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
  limit: z.number().min(1).default(10),
  page: z.number().min(1).default(1),
});

export const rejectSubmissionSchema = z.object({
  submissionId: z.string().uuid(), // or z.number() depending on your schema
  reason: z.string().min(10).max(500),
});

export const submitTaskSchema = z.object({
  taskId: z.string().uuid(),
  file: z.string(),
  filename: z.string().min(1).max(255),
  mimetype: z.string().min(3).max(255),
});

export const getSubmissionsSchema = z.object({
  taskId: z.string().uuid(),
  status: z
    .enum(['PENDING_REVIEW', 'APPROVED', 'REJECTED', 'DISPUTED'])
    .optional(),
  limit: z.number().int().min(1).max(50).default(10),
  page: z.number().int().min(1).default(1),
});

export const resolveDisputeInput = z.object({
  disputeId: z.string().uuid(),
  outcome: z.enum(['Approve', 'Reject']),
  adminNotes: z.string().min(1, 'Admin notes are required'),
});

export const getTaskByIdOutputSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  creatorId: z.string(),
  creatorDisplayName: z.string().nullable(),
});

export const createTaskOutputSchema = z.object({
  success: z.boolean(),
  task: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    status: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    creatorUserId: z.string(),
  }),
});