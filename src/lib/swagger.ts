import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API',
      version: '1.0.0',
      description:
        '前端評測輔助用 Todo REST API - 最小可用的 Next.js Todo API，無需資料庫與環境變數，啟動即有內建種子資料。',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Todos',
        description: 'Todo operations',
      },
    ],
    components: {
      schemas: {
        Todo: {
          type: 'object',
          required: ['id', 'title', 'completed', 'createdAt', 'updatedAt'],
          properties: {
            id: {
              type: 'string',
              description: '唯一識別碼 (cuid)',
              example: 'clxyz1234567890abcdef',
            },
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 200,
              description: '標題',
              example: 'Setup development environment',
            },
            completed: {
              type: 'boolean',
              description: '完成狀態',
              example: false,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '建立時間 (ISO 8601)',
              example: '2024-01-01T10:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: '更新時間 (ISO 8601)',
              example: '2024-01-01T12:00:00.000Z',
            },
            order: {
              type: 'number',
              description: '排序順序 (可選)',
              example: 1,
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: '到期日 (ISO 8601, 可選)',
              example: '2024-01-15T17:00:00.000Z',
            },
            notes: {
              type: 'string',
              description: '備註 (可選)',
              example: 'Install Node.js, npm, and setup the project structure',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: '標籤陣列 (可選)',
              example: ['setup', 'dev', 'infrastructure'],
            },
          },
        },
        CreateTodo: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 200,
              description: '標題',
              example: '新待辦事項',
            },
            notes: {
              type: 'string',
              description: '詳細說明',
              example: 'This is a detailed description of the todo item',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: '到期日 (ISO 8601)',
              example: '2024-12-31T23:59:59.000Z',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: '標籤陣列',
              example: ['標籤1', '標籤2'],
            },
            order: {
              type: 'number',
              description: '排序順序',
              example: 1,
            },
          },
        },
        UpdateTodo: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 200,
              description: '標題',
              example: '更新的標題',
            },
            notes: {
              type: 'string',
              description: '詳細說明',
              example: '更新的說明',
            },
            completed: {
              type: 'boolean',
              description: '完成狀態',
              example: true,
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: '到期日 (ISO 8601)',
              example: '2024-12-31T23:59:59.000Z',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: '標籤陣列',
              example: ['新標籤'],
            },
            order: {
              type: 'number',
              description: '排序順序',
              example: 2,
            },
          },
        },
        BulkAction: {
          type: 'object',
          required: ['action', 'payload'],
          properties: {
            action: {
              type: 'string',
              enum: ['completeAll', 'clearCompleted', 'reorder'],
              description: '批次操作類型',
            },
            payload: {
              oneOf: [
                {
                  type: 'object',
                  properties: {
                    completed: {
                      type: 'boolean',
                      description: '完成狀態',
                    },
                  },
                },
                {
                  type: 'object',
                  description: '清除已完成項目無需額外參數',
                },
                {
                  type: 'object',
                  properties: {
                    orders: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'string',
                            description: 'Todo ID',
                          },
                          order: {
                            type: 'number',
                            description: '新的排序順序',
                          },
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        ApiSuccess: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              description: '回應資料',
            },
          },
        },
        ApiError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'BAD_REQUEST',
                },
                message: {
                  type: 'string',
                  example: 'Validation failed',
                },
                details: {
                  type: 'object',
                  description: '錯誤詳情 (可選)',
                },
              },
            },
          },
        },
      },
      parameters: {
        status: {
          name: 'status',
          in: 'query',
          description: '過濾狀態',
          schema: {
            type: 'string',
            enum: ['all', 'active', 'completed'],
            default: 'all',
          },
        },
        search: {
          name: 'search',
          in: 'query',
          description: '搜尋關鍵字 (模糊搜尋 title/notes)',
          schema: {
            type: 'string',
          },
        },
        sortBy: {
          name: 'sortBy',
          in: 'query',
          description: '排序欄位',
          schema: {
            type: 'string',
            enum: ['createdAt', 'updatedAt', 'order', 'dueDate'],
            default: 'createdAt',
          },
        },
        sortDir: {
          name: 'sortDir',
          in: 'query',
          description: '排序方向',
          schema: {
            type: 'string',
            enum: ['asc', 'desc'],
            default: 'desc',
          },
        },
      },
    },
  },
  apis: ['./src/app/api/**/*.ts'], // paths to files containing OpenAPI definitions
};

export const swaggerSpec = swaggerJsdoc(options);
