import { z } from "zod";

export const getTaskByIdSchema = z.object({
  taskId: z.string().uuid(),
});
