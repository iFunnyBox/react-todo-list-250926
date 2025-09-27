'use client';
import { useState } from 'react';
import {
  Button,
  Container,
  Stack,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { TodoStatus, SortBy } from '@/types/todo';
import { useTodos } from '@/hooks/useTodos';
import { TodoTable, CreateTaskDialog, DueDateDialog, FilterSortMenus } from '@/components';
import { useTheme } from './providers';

export default function Home() {
  const { mode, toggleMode } = useTheme();
  const [status, setStatus] = useState<TodoStatus>('active');
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [open, setOpen] = useState(false);
  const [inlineEditing, setInlineEditing] = useState(false);
  const [inlineTitle, setInlineTitle] = useState('');
  const [inlineSubmitting, setInlineSubmitting] = useState(false);
  const [dueEditId, setDueEditId] = useState<string | null>(null);
  const [dueEditValue, setDueEditValue] = useState<Date | null>(null);
  const [dueSubmitting, setDueSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingSubmitting, setEditingSubmitting] = useState(false);

  const {
    rows,
    idMap,
    toggleCompleted,
    updateTodoTitle,
    updateTodoDueDate,
    createTodo,
  } = useTodos(status, sortBy);

  const startEditTitle = (todo: any) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const cancelEditTitle = () => {
    if (!editingSubmitting) {
      setEditingId(null);
      setEditingTitle('');
    }
  };

  const saveEditTitle = async () => {
    const id = editingId;
    const title = editingTitle.trim();
    if (!id) return;
    if (!title) {
      cancelEditTitle();
      return;
    }
    setEditingSubmitting(true);
    try {
      await updateTodoTitle(id, title);
      setEditingId(null);
      setEditingTitle('');
    } catch (_) {
      // Error handling is done in the hook
    } finally {
      setEditingSubmitting(false);
    }
  };

  const handleCreate = async (title: string, dueDate?: string) => {
    try {
      await createTodo(title, dueDate);
      setOpen(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleInlineCreate = async (title: string) => {
    if (!title) return;
    setInlineSubmitting(true);
    try {
      await createTodo(title);
      setInlineEditing(false);
      setInlineTitle('');
    } catch (_) {
      setInlineEditing(false);
    } finally {
      setInlineSubmitting(false);
    }
  };

  const openDueDialog = (todo: any) => {
    setDueEditId(todo.id);
    setDueEditValue(todo.dueDate ? new Date(todo.dueDate) : new Date());
  };

  const closeDueDialog = () => {
    if (!dueSubmitting) {
      setDueEditId(null);
      setDueEditValue(null);
    }
  };

  const saveDueDate = async (date: Date | null) => {
    const id = dueEditId;
    if (!id) return;
    setDueSubmitting(true);
    const newIso = date ? new Date(date).toISOString() : undefined;
    try {
      await updateTodoDueDate(id, newIso);
      closeDueDialog();
    } catch (_) {
      closeDueDialog();
    } finally {
      setDueSubmitting(false);
    }
  };

  return (
    <div>
      <Container 
        maxWidth={false} 
        sx={{ 
          gridRowStart: 2, 
          px: { xs: 2, sm: 3, md: 5 }, 
          pt: 5, 
          pb: { xs: 3, sm: 4, md: 5 } 
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" fontWeight={700}>
            Tasks
          </Typography>
          <IconButton 
            onClick={toggleMode}
            sx={{
              color: 'text.primary',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
            aria-label="切换主题"
          >
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
        <Stack direction="row" spacing={2} mb={2} alignItems="center">
          <Button
            size="small"
            variant="outlined"
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{
              color: 'text.primary',
              borderColor: 'divider',
              borderRadius: 2,
              textTransform: 'none',
              height: 36,
              px: 2.5,
              '&:hover': { 
                bgcolor: 'action.hover', 
                borderColor: 'primary.main',
                color: 'primary.main',
              },
            }}
          >
            New Task
          </Button>
          <FilterSortMenus
            status={status}
            sortBy={sortBy}
            onStatusChange={setStatus}
            onSortByChange={setSortBy}
          />
        </Stack>
        <TodoTable
          rows={rows}
          idMap={idMap}
          onToggleCompleted={toggleCompleted}
          onStartEditTitle={startEditTitle}
          onOpenDueDialog={openDueDialog}
          onInlineCreate={handleInlineCreate}
          editingId={editingId}
          editingTitle={editingTitle}
          onEditingTitleChange={setEditingTitle}
          onSaveEditTitle={saveEditTitle}
          onCancelEditTitle={cancelEditTitle}
          editingSubmitting={editingSubmitting}
          inlineEditing={inlineEditing}
          inlineTitle={inlineTitle}
          onInlineTitleChange={setInlineTitle}
          onStartInlineEditing={() => {
            setInlineEditing(true);
            setInlineTitle('');
          }}
          onStopInlineEditing={() => {
            setInlineEditing(false);
            setInlineTitle('');
          }}
          inlineSubmitting={inlineSubmitting}
        />
      </Container>

      <CreateTaskDialog
        open={open}
        onClose={() => setOpen(false)}
        onCreate={handleCreate}
      />

      <DueDateDialog
        open={Boolean(dueEditId)}
        initialValue={dueEditValue}
        onClose={closeDueDialog}
        onSave={saveDueDate}
        submitting={dueSubmitting}
      />
    </div>
  );
}
