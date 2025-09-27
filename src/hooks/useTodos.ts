import { useState, useEffect, useMemo } from 'react';
import { Todo, TodoStatus, SortBy } from '@/types/todo';
import { TodoApiService } from '@/services/todoApi';

export const useTodos = (status: TodoStatus, sortBy: SortBy) => {
  const [items, setItems] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [idMap, setIdMap] = useState<Record<string, number>>({});
  const [nextId, setNextId] = useState(1);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const sortDir = sortBy === 'dueDate' ? 'asc' : 'desc';
      const newItems = await TodoApiService.fetchTodos(status, sortBy, sortDir);
      setItems(newItems);
      setIdMap((prev) => {
        const updated = { ...prev };
        let counter = nextId;
        for (const t of newItems) {
          if (updated[t.id] === undefined) {
            updated[t.id] = counter++;
          }
        }
        if (counter !== nextId) setNextId(counter);
        return updated;
      });
    } catch (e) {
      // noop
    } finally {
      setLoading(false);
    }
  };

  const toggleCompleted = async (todo: Todo) => {
    const next = !todo.completed;
    setItems((prev) => prev.map((t) => (t.id === todo.id ? { ...t, completed: next } : t)));
    try {
      await TodoApiService.updateTodo(todo.id, { completed: next });
      // 若当前过滤非 all，需要同步刷新以反映过滤结果
      if (status !== 'all') {
        await fetchTodos();
      }
    } catch (_) {
      setItems((prev) => prev.map((t) => (t.id === todo.id ? { ...t, completed: !next } : t)));
    }
  };

  const updateTodoTitle = async (id: string, title: string) => {
    const prev = items;
    setItems((curr) => curr.map((t) => (t.id === id ? { ...t, title } : t)));
    try {
      await TodoApiService.updateTodo(id, { title });
    } catch (_) {
      setItems(prev);
      throw new Error('Failed to update title');
    }
  };

  const updateTodoDueDate = async (id: string, dueDate?: string) => {
    const prev = items;
    setItems((curr) => curr.map((t) => (t.id === id ? { ...t, dueDate } : t)));
    try {
      await TodoApiService.updateTodo(id, { dueDate });
    } catch (_) {
      setItems(prev);
      throw new Error('Failed to update due date');
    }
  };

  const createTodo = async (title: string, dueDate?: string) => {
    try {
      await TodoApiService.createTodo({ title, dueDate });
      await fetchTodos();
    } catch (error) {
      console.error('Failed to create todo:', error);
      throw error;
    }
  };

  const rows = useMemo(() => {
    const arr = [...items];
    if (sortBy === 'order') {
      arr.sort((a, b) => (idMap[a.id] ?? 0) - (idMap[b.id] ?? 0));
    } else if (sortBy === 'dueDate') {
      arr.sort((a, b) => {
        const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return aTime - bTime; // 升序
      });
    }
    return arr;
  }, [items, sortBy, idMap]);

  useEffect(() => {
    fetchTodos();
  }, [status, sortBy]);

  return {
    items,
    loading,
    rows,
    idMap,
    fetchTodos,
    toggleCompleted,
    updateTodoTitle,
    updateTodoDueDate,
    createTodo,
  };
};
