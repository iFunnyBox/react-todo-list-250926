import { TodoStatus, SortBy } from '@/types/todo';

export const STATUS_OPTIONS = [
  { key: 'active' as TodoStatus, label: '进行中' },
  { key: 'completed' as TodoStatus, label: '已完成' },
  { key: 'all' as TodoStatus, label: '全部任务' },
] as const;

export const SORT_OPTIONS = [
  { key: 'createdAt' as SortBy, label: 'Created at' },
  { key: 'dueDate' as SortBy, label: 'Due Date' },
  { key: 'order' as SortBy, label: 'Task ID' },
] as const;
