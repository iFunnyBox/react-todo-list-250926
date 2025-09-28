'use client';
import { useState } from 'react';
import { Button, Container, Stack, Typography, IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { TodoStatus, SortBy } from '@/types/todo';
import { useTodos } from '@/hooks/useTodos';
import { useTodoEditing } from '@/hooks/useTodoEditing';
import { TodoTable, CreateTaskDialog, DueDateDialog, FilterSortMenus } from '@/components';
import { useTheme } from '@/components/ClientThemeProvider';

export default function Home() {
  const { mode, toggleMode } = useTheme();
  const [status, setStatus] = useState<TodoStatus>('active');
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [open, setOpen] = useState(false);

  const { rows, idMap, toggleCompleted, updateTodoTitle, updateTodoDueDate, createTodo } = useTodos(
    status,
    sortBy
  );

  const {
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
  } = useTodoEditing({
    updateTodoTitle,
    updateTodoDueDate,
    createTodo,
  });

  const handleCreate = async (title: string, dueDate?: string) => {
    try {
      await createTodo(title, dueDate);
      setOpen(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  return (
    <div suppressHydrationWarning>
      <Container
        maxWidth={false}
        sx={{
          px: { xs: 2, sm: 3, md: 5 },
          pt: 5,
          pb: { xs: 3, sm: 4, md: 5 },
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
          onStartInlineEditing={startInlineEditing}
          onStopInlineEditing={stopInlineEditing}
          inlineSubmitting={inlineSubmitting}
        />
      </Container>

      <CreateTaskDialog open={open} onClose={() => setOpen(false)} onCreate={handleCreate} />

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
