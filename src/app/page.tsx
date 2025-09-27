'use client';
import { useState } from 'react';
import {
  Button,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { TodoStatus, SortBy } from '@/types/todo';
import { useTodos } from '@/hooks/useTodos';
import { TodoTable, CreateTaskDialog, DueDateDialog, FilterSortMenus } from '@/components';

export default function Home() {
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
      <Container maxWidth={false} sx={{ gridRowStart: 2, px: 0, pt: 5, pb: 0 }}>
        <Typography variant="h4" fontWeight={700} mb={2}>
          Tasks
        </Typography>
        <Stack direction="row" spacing={2} mb={2} alignItems="center">
          <Button
            size="small"
            variant="outlined"
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{
              color: 'common.white',
              borderColor: 'rgba(255,255,255,0.3)',
              borderRadius: 2,
              textTransform: 'none',
              height: 36,
              px: 2.5,
              '&:hover': { bgcolor: 'transparent', borderColor: 'rgba(255,255,255,0.5)' },
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
