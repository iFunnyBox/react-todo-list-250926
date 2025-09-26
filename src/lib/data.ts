import { Todo } from './types';
import cuid from 'cuid';
import fs from 'fs';
import path from 'path';

class TodoStore {
  private todos: Todo[] = [];
  private initialized = false;
  private enablePersistence = false;
  private dataPath = path.join(process.cwd(), 'data', 'todos.json');
  private seedPath = path.join(process.cwd(), 'data', 'todos.seed.json');

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (this.initialized) return;
    this.loadSeedData();
    this.initialized = true;
  }

  private loadSeedData() {
    try {
      if (fs.existsSync(this.seedPath)) {
        const seedData = fs.readFileSync(this.seedPath, 'utf-8');
        this.todos = JSON.parse(seedData);
      } else {
        this.todos = this.getDefaultSeedData();
      }
    } catch (error) {
      console.error('Error loading seed data:', error);
      this.todos = this.getDefaultSeedData();
    }
  }

  private getDefaultSeedData(): Todo[] {
    const now = new Date().toISOString();
    return [
      {
        id: cuid(),
        title: 'Setup development environment',
        completed: true,
        createdAt: now,
        updatedAt: now,
        order: 1,
        notes: 'Install Node.js, npm, and setup the project',
        tags: ['setup', 'dev'],
      },
      {
        id: cuid(),
        title: 'Create API documentation',
        completed: false,
        createdAt: now,
        updatedAt: now,
        order: 2,
        notes: 'Document all API endpoints with examples',
        tags: ['documentation'],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: cuid(),
        title: 'Implement authentication',
        completed: false,
        createdAt: now,
        updatedAt: now,
        order: 3,
        tags: ['feature', 'security'],
      },
      {
        id: cuid(),
        title: 'Write unit tests',
        completed: false,
        createdAt: now,
        updatedAt: now,
        order: 4,
        notes: 'Cover all API endpoints with tests',
        tags: ['testing'],
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: cuid(),
        title: 'Setup CI/CD pipeline',
        completed: false,
        createdAt: now,
        updatedAt: now,
        order: 5,
        tags: ['devops', 'automation'],
      },
      {
        id: cuid(),
        title: 'Optimize database queries',
        completed: true,
        createdAt: now,
        updatedAt: now,
        order: 6,
        notes: 'Review and optimize slow queries',
        tags: ['performance', 'database'],
      },
      {
        id: cuid(),
        title: 'Add rate limiting',
        completed: false,
        createdAt: now,
        updatedAt: now,
        order: 7,
        tags: ['security', 'feature'],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }

  private persistData() {
    if (!this.enablePersistence) return;

    try {
      fs.mkdirSync(path.dirname(this.dataPath), { recursive: true });
      fs.writeFileSync(this.dataPath, JSON.stringify(this.todos, null, 2));
    } catch (error) {
      console.error('Error persisting data:', error);
    }
  }

  getAllTodos(): Todo[] {
    return [...this.todos];
  }

  getTodoById(id: string): Todo | undefined {
    return this.todos.find((todo) => todo.id === id);
  }

  createTodo(data: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'completed'>): Todo {
    const now = new Date().toISOString();
    const newTodo: Todo = {
      ...data,
      id: cuid(),
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    this.todos.push(newTodo);
    this.persistData();
    return newTodo;
  }

  updateTodo(id: string, data: Partial<Omit<Todo, 'id' | 'createdAt'>>): Todo | undefined {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) return undefined;

    const updatedTodo = {
      ...this.todos[todoIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.todos[todoIndex] = updatedTodo;
    this.persistData();
    return updatedTodo;
  }

  deleteTodo(id: string): boolean {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.persistData();
    return this.todos.length < initialLength;
  }

  completeAll(completed: boolean): number {
    let count = 0;
    const now = new Date().toISOString();

    this.todos = this.todos.map((todo) => {
      if (todo.completed !== completed) {
        count++;
        return { ...todo, completed, updatedAt: now };
      }
      return todo;
    });

    this.persistData();
    return count;
  }

  clearCompleted(): number {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter((todo) => !todo.completed);
    this.persistData();
    return initialLength - this.todos.length;
  }

  reorder(orders: Array<{ id: string; order: number }>): Todo[] {
    const now = new Date().toISOString();
    const orderMap = new Map(orders.map((o) => [o.id, o.order]));

    this.todos = this.todos.map((todo) => {
      const newOrder = orderMap.get(todo.id);
      if (newOrder !== undefined && newOrder !== todo.order) {
        return { ...todo, order: newOrder, updatedAt: now };
      }
      return todo;
    });

    this.persistData();
    return this.todos.filter((todo) => orderMap.has(todo.id));
  }

  reset() {
    this.loadSeedData();
    this.persistData();
  }
}

export const todoStore = new TodoStore();
