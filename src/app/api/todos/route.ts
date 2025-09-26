import { NextRequest } from 'next/server';
import { todoStore } from '@/lib/data';
import { createTodoSchema, querySchema } from '@/lib/validations';
import { successResponse, validationErrorResponse, internalErrorResponse } from '@/lib/responses';
import { handleOptions } from '@/lib/cors';

/**
 * @swagger
 * /api/todos:
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
 * /api/todos:
 *   get:
 *     tags: [Todos]
 *     summary: 取得所有待辦事項
 *     description: 取得待辦事項列表，支援狀態篩選、搜尋和排序
 *     parameters:
 *       - $ref: '#/components/parameters/status'
 *       - $ref: '#/components/parameters/search'
 *       - $ref: '#/components/parameters/sortBy'
 *       - $ref: '#/components/parameters/sortDir'
 *     responses:
 *       200:
 *         description: 成功取得待辦事項列表
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
 *                         items:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Todo'
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
export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const queryResult = querySchema.safeParse(searchParams);

    if (!queryResult.success) {
      return validationErrorResponse(queryResult.error);
    }

    const { status, search, sortBy, sortDir } = queryResult.data;
    let todos = todoStore.getAllTodos();

    if (status !== 'all') {
      todos = todos.filter((todo) => (status === 'active' ? !todo.completed : todo.completed));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      todos = todos.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchLower) ||
          (todo.notes && todo.notes.toLowerCase().includes(searchLower)),
      );
    }

    todos.sort((a, b) => {
      let compareValue = 0;

      switch (sortBy) {
        case 'order':
          compareValue = (a.order || 0) - (b.order || 0);
          break;
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) compareValue = 0;
          else if (!a.dueDate) compareValue = 1;
          else if (!b.dueDate) compareValue = -1;
          else compareValue = a.dueDate.localeCompare(b.dueDate);
          break;
        case 'createdAt':
        case 'updatedAt':
          compareValue = a[sortBy].localeCompare(b[sortBy]);
          break;
      }

      return sortDir === 'desc' ? -compareValue : compareValue;
    });

    return successResponse({ items: todos });
  } catch (error) {
    console.error('Error in GET /api/todos:', error);
    return internalErrorResponse();
  }
}

/**
 * @swagger
 * /api/todos:
 *   post:
 *     tags: [Todos]
 *     summary: 新增待辦事項
 *     description: 建立一個新的待辦事項
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTodo'
 *     responses:
 *       201:
 *         description: 成功建立待辦事項
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
 *       500:
 *         description: 伺服器內部錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = createTodoSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error);
    }

    const newTodo = todoStore.createTodo(validationResult.data);
    return successResponse(newTodo, 201);
  } catch (error) {
    console.error('Error in POST /api/todos:', error);
    return internalErrorResponse();
  }
}
