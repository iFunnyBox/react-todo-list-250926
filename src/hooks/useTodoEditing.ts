import { useState, useCallback } from 'react';
import { Todo } from '@/types/todo';

interface UseTodoEditingProps {
  updateTodoTitle: (id: string, title: string) => Promise<void>;
  updateTodoDueDate: (id: string, dueDate?: string) => Promise<void>;
  createTodo: (title: string, dueDate?: string) => Promise<void>;
}

export const useTodoEditing = ({
  updateTodoTitle,
  updateTodoDueDate,
  createTodo,
}: UseTodoEditingProps) => {
  // 标题编辑状态
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingSubmitting, setEditingSubmitting] = useState(false);

  // 内联创建状态
  const [inlineEditing, setInlineEditing] = useState(false);
  const [inlineTitle, setInlineTitle] = useState('');
  const [inlineSubmitting, setInlineSubmitting] = useState(false);

  // 截止日期编辑状态
  const [dueEditId, setDueEditId] = useState<string | null>(null);
  const [dueEditValue, setDueEditValue] = useState<Date | null>(null);
  const [dueSubmitting, setDueSubmitting] = useState(false);

  // 标题编辑方法
  const startEditTitle = useCallback((todo: Todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  }, []);

  const cancelEditTitle = useCallback(() => {
    if (!editingSubmitting) {
      setEditingId(null);
      setEditingTitle('');
    }
  }, [editingSubmitting]);

  const saveEditTitle = useCallback(async (title?: string) => {
    const id = editingId;
    const finalTitle = (title || editingTitle).trim();
    if (!id || !finalTitle) {
      cancelEditTitle();
      return;
    }

    setEditingSubmitting(true);
    try {
      await updateTodoTitle(id, finalTitle);
      setEditingId(null);
      setEditingTitle('');
    } catch (error) {
      console.error('Failed to update title:', error);
    } finally {
      setEditingSubmitting(false);
    }
  }, [editingId, editingTitle, updateTodoTitle, cancelEditTitle]);

  // 内联创建方法
  const startInlineEditing = useCallback(() => {
    setInlineEditing(true);
    setInlineTitle('');
  }, []);

  const stopInlineEditing = useCallback(() => {
    setInlineEditing(false);
    setInlineTitle('');
  }, []);

  const handleInlineCreate = useCallback(
    async (title: string) => {
      if (!title.trim()) return;

      setInlineSubmitting(true);
      try {
        await createTodo(title.trim());
        stopInlineEditing();
      } catch (error) {
        console.error('Failed to create todo:', error);
        stopInlineEditing();
      } finally {
        setInlineSubmitting(false);
      }
    },
    [createTodo, stopInlineEditing]
  );

  // 截止日期编辑方法
  const openDueDialog = useCallback((todo: Todo) => {
    setDueEditId(todo.id);
    setDueEditValue(todo.dueDate ? new Date(todo.dueDate) : new Date());
  }, []);

  const closeDueDialog = useCallback(() => {
    if (!dueSubmitting) {
      setDueEditId(null);
      setDueEditValue(null);
    }
  }, [dueSubmitting]);

  const saveDueDate = useCallback(
    async (date: Date | null) => {
      const id = dueEditId;
      if (!id) return;

      setDueSubmitting(true);
      const newIso = date ? new Date(date).toISOString() : undefined;
      try {
        await updateTodoDueDate(id, newIso);
        closeDueDialog();
      } catch (error) {
        console.error('Failed to update due date:', error);
        closeDueDialog();
      } finally {
        setDueSubmitting(false);
      }
    },
    [dueEditId, updateTodoDueDate, closeDueDialog]
  );

  return {
    // 标题编辑状态
    editingId,
    editingTitle,
    editingSubmitting,
    setEditingTitle,
    startEditTitle,
    cancelEditTitle,
    saveEditTitle,

    // 内联创建状态
    inlineEditing,
    inlineTitle,
    inlineSubmitting,
    setInlineTitle,
    startInlineEditing,
    stopInlineEditing,
    handleInlineCreate,

    // 截止日期编辑状态
    dueEditId,
    dueEditValue,
    dueSubmitting,
    openDueDialog,
    closeDueDialog,
    saveDueDate,
  };
};
