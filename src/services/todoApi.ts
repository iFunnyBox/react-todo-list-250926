import { Todo, TodoResponse, CreateTodoRequest, UpdateTodoRequest, TodoStatus, SortBy, SortDirection } from '@/types/todo';

const API_BASE = '/api/todos';

export class TodoApiService {
  static async fetchTodos(
    status: TodoStatus = 'active',
    sortBy: SortBy = 'createdAt',
    sortDir: SortDirection = 'desc'
  ): Promise<Todo[]> {
    const res = await fetch(`${API_BASE}?status=${status}&sortBy=${sortBy}&sortDir=${sortDir}`, {
      cache: 'no-store',
    });
    const json: TodoResponse = await res.json();
    return json.data?.items || [];
  }

  static async createTodo(todo: CreateTodoRequest): Promise<void> {
    await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });
  }

  static async updateTodo(id: string, updates: UpdateTodoRequest): Promise<void> {
    await fetch(`${API_BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  }

  static async deleteTodo(id: string): Promise<void> {
    await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
  }
}
