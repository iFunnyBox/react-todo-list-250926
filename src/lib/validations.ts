import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().min(1).max(200),
  notes: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  order: z.number().optional(),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  notes: z.string().optional(),
  completed: z.boolean().optional(),
  dueDate: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  order: z.number().optional(),
});

export const querySchema = z.object({
  status: z.enum(['all', 'active', 'completed']).optional().default('all'),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'order', 'dueDate']).optional().default('createdAt'),
  sortDir: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const bulkActionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('completeAll'),
    payload: z.object({
      completed: z.boolean(),
    }),
  }),
  z.object({
    action: z.literal('clearCompleted'),
    payload: z.object({}),
  }),
  z.object({
    action: z.literal('reorder'),
    payload: z.object({
      orders: z.array(
        z.object({
          id: z.string(),
          order: z.number(),
        }),
      ),
    }),
  }),
]);
