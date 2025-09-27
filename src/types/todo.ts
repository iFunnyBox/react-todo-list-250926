export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  order?: number;
  dueDate?: string;
};

export type TodoStatus = 'active' | 'completed' | 'all';

export type SortBy = 'createdAt' | 'dueDate' | 'order';

export type SortDirection = 'asc' | 'desc';

export type CreateTodoRequest = {
  title: string;
  dueDate?: string;
};

export type UpdateTodoRequest = {
  title?: string;
  completed?: boolean;
  dueDate?: string;
};

export type TodoResponse = {
  data: {
    items: Todo[];
  };
};
