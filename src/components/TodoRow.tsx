'use client';
import { useState } from 'react';
import {
  Box,
  Checkbox,
  TableCell,
  TableRow,
  Typography,
  TextField,
} from '@mui/material';
import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { Todo } from '@/types/todo';
import { formatDateTime, isOverdue } from '@/utils/dateUtils';

interface TodoRowProps {
  todo: Todo;
  idMap: Record<string, number>;
  onToggleCompleted: (todo: Todo) => void;
  onStartEditTitle: (todo: Todo) => void;
  onOpenDueDialog: (todo: Todo) => void;
  editingId: string | null;
  editingTitle: string;
  onEditingTitleChange: (title: string) => void;
  onSaveEditTitle: () => void;
  onCancelEditTitle: () => void;
  editingSubmitting: boolean;
}

export const TodoRow: React.FC<TodoRowProps> = ({
  todo,
  idMap,
  onToggleCompleted,
  onStartEditTitle,
  onOpenDueDialog,
  editingId,
  editingTitle,
  onEditingTitleChange,
  onSaveEditTitle,
  onCancelEditTitle,
  editingSubmitting,
}) => {
  const isEditing = editingId === todo.id;

  return (
    <TableRow key={todo.id} hover>
      <TableCell padding="checkbox">
        <Checkbox
          size="small"
          checked={todo.completed}
          disableRipple
          sx={{ p: 0.5 }}
          icon={
            <RadioButtonUncheckedOutlinedIcon
              fontSize="small"
              sx={{ color: 'grey.500' }}
            />
          }
          checkedIcon={
            <Box
              component="span"
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                bgcolor: '#419E34',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckIcon sx={{ color: '#fff', fontSize: 16 }} />
            </Box>
          }
          onChange={(e) => {
            e.stopPropagation();
            onToggleCompleted(todo);
          }}
        />
      </TableCell>
      <TableCell onDoubleClick={() => onStartEditTitle(todo)} sx={{ cursor: 'text' }}>
        {isEditing ? (
          <TextField
            autoFocus
            fullWidth
            size="small"
            value={editingTitle}
            onChange={(e) => onEditingTitleChange(e.target.value)}
            onBlur={onCancelEditTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSaveEditTitle();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                onCancelEditTitle();
              }
            }}
          />
        ) : (
          <Typography variant="body2">{todo.title}</Typography>
        )}
      </TableCell>
      <TableCell onDoubleClick={() => onOpenDueDialog(todo)} sx={{ cursor: 'pointer' }}>
        {todo.dueDate ? (
          <Typography color={isOverdue(todo) ? 'error' : 'inherit'}>
            {formatDateTime(todo.dueDate)}
          </Typography>
        ) : (
          <CalendarTodayOutlinedIcon
            sx={{ color: 'text.disabled' }}
            fontSize="small"
          />
        )}
      </TableCell>
      <TableCell>{formatDateTime(todo.createdAt)}</TableCell>
      <TableCell sx={{ width: 140, whiteSpace: 'nowrap' }}>
        {idMap[todo.id] ?? ''}
      </TableCell>
    </TableRow>
  );
};
