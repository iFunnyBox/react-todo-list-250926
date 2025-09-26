import { NextRequest } from 'next/server';
import { todoStore } from '@/lib/data';
import { updateTodoSchema } from '@/lib/validations';
import {
  successResponse,
  validationErrorResponse,
  notFoundResponse,
  internalErrorResponse,
} from '@/lib/responses';
import { handleOptions } from '@/lib/cors';

/**
 * @swagger
 * /api/todos/{id}:
 *   options:
 *     tags: [Todos]
 *     summary: CORS preflight request
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: CORS headers
 */
export async function OPTIONS() {
  return handleOptions();
}

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     tags: [Todos]
 *     summary: 取得單筆待辦事項
 *     description: 根據 ID 取得特定待辦事項
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: 成功取得待辦事項
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Todo'
 *       404:
 *         description: 找不到指定的待辦事項
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
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const todo = todoStore.getTodoById(id);

    if (!todo) {
      return notFoundResponse('Todo');
    }

    return successResponse(todo);
  } catch (error) {
    console.error('Error in GET /api/todos/[id]:', error);
    return internalErrorResponse();
  }
}

/**
 * @swagger
 * /api/todos/{id}:
 *   patch:
 *     tags: [Todos]
 *     summary: 更新待辦事項
 *     description: 部分更新指定的待辦事項
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTodo'
 *     responses:
 *       200:
 *         description: 成功更新待辦事項
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Todo'
 *       400:
 *         description: 請求參數驗證失敗
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: 找不到指定的待辦事項
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
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validationResult = updateTodoSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error);
    }

    const updatedTodo = todoStore.updateTodo(id, validationResult.data);

    if (!updatedTodo) {
      return notFoundResponse('Todo');
    }

    return successResponse(updatedTodo);
  } catch (error) {
    console.error('Error in PATCH /api/todos/[id]:', error);
    return internalErrorResponse();
  }
}

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     tags: [Todos]
 *     summary: 刪除待辦事項
 *     description: 刪除指定的待辦事項
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: 成功刪除待辦事項
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: 被刪除的 Todo ID
 *       404:
 *         description: 找不到指定的待辦事項
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
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const deleted = todoStore.deleteTodo(id);

    if (!deleted) {
      return notFoundResponse('Todo');
    }

    return successResponse({ id });
  } catch (error) {
    console.error('Error in DELETE /api/todos/[id]:', error);
    return internalErrorResponse();
  }
}
