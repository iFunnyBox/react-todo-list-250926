import { format } from 'date-fns';
import { Todo } from '@/types/todo';

export const formatDateTime = (iso?: string): string => {
  if (!iso) return '';
  try {
    // 在服务端渲染时返回空字符串，避免hydration错误
    // 客户端会在useEffect中重新格式化
    if (typeof window === 'undefined') return '';
    return format(new Date(iso), 'yyyy/MM/dd HH:mm');
  } catch {
    return '';
  }
};

export const isOverdue = (todo: Todo): boolean => {
  if (!todo.dueDate || todo.completed) return false;
  try {
    // 在服务端渲染时总是返回false，避免hydration错误
    // 客户端会在useEffect中重新计算
    if (typeof window === 'undefined') return false;
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
