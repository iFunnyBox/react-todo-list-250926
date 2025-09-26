import { NextRequest } from 'next/server';
import { todoStore } from '@/lib/data';
import { bulkActionSchema } from '@/lib/validations';
import { successResponse, validationErrorResponse, internalErrorResponse } from '@/lib/responses';
import { handleOptions } from '@/lib/cors';

/**
 * @swagger
 * /api/todos/bulk:
 *   options:
 *     tags: [Todos]
 *     summary: CORS preflight request
 *     responses:
 *       200:
 *         description: CORS headers
 */
export async function OPTIONS() {
  return handleOptions();
}

/**
 * @swagger
 * /api/todos/bulk:
 *   patch:
 *     tags: [Todos]
 *     summary: 批次操作
 *     description: 執行批次操作，包括完成全部、清除已完成項目、重新排序
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkAction'
 *           examples:
 *             completeAll:
 *               summary: 完成所有待辦事項
 *               value:
 *                 action: completeAll
 *                 payload:
 *                   completed: true
 *             clearCompleted:
 *               summary: 清除已完成項目
 *               value:
 *                 action: clearCompleted
 *                 payload: {}
 *             reorder:
 *               summary: 重新排序
 *               value:
 *                 action: reorder
 *                 payload:
 *                   orders:
 *                     - id: "clxyz1234567890abcdef"
 *                       order: 1
 *                     - id: "clxyz2345678901bcdefg"
 *                       order: 2
 *     responses:
 *       200:
 *         description: 成功執行批次操作
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       oneOf:
 *                         - type: object
 *                           properties:
 *                             count:
 *                               type: number
 *                               description: 受影響的項目數量
 *                         - type: object
 *                           properties:
 *                             items:
 *                               type: array
 *                               items:
 *                                 $ref: '#/components/schemas/Todo'
 *                               description: 重新排序後的項目
 *       400:
 *         description: 請求參數驗證失敗
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: 伺服器內部錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = bulkActionSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error);
    }

    const { action, payload } = validationResult.data;

    switch (action) {
      case 'completeAll': {
        const count = todoStore.completeAll(payload.completed);
        return successResponse({ count });
      }

      case 'clearCompleted': {
        const count = todoStore.clearCompleted();
        return successResponse({ count });
      }

      case 'reorder': {
        const items = todoStore.reorder(payload.orders);
        return successResponse({ items });
      }

      default:
        return validationErrorResponse({
          message: 'Invalid action',
        });
    }
  } catch (error) {
    console.error('Error in PATCH /api/todos/bulk:', error);
    return internalErrorResponse();
  }
}
