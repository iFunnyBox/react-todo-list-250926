import { format } from 'date-fns';
import { Todo } from '@/types/todo';

export const formatDateTime = (iso?: string): string => {
  if (!iso) return '';
  try {
    return format(new Date(iso), 'yyyy/MM/dd HH:mm');
  } catch {
    return '';
  }
};

export const isOverdue = (todo: Todo): boolean => {
  if (!todo.dueDate || todo.completed) return false;
  try {
    return new Date(todo.dueDate).getTime() < Date.now();
  } catch {
    return false;
  }
};

export const mergeDateAndTime = (datePart: Date | null, timePart: Date | null): Date | null => {
  if (!datePart && !timePart) return null;
  const base = new Date(datePart || timePart || new Date());
  const hours = timePart ? timePart.getHours() : 0;
  const minutes = timePart ? timePart.getMinutes() : 0;
  const merged = new Date(base);
  merged.setHours(hours, minutes, 0, 0);
  return merged;
};
