'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Todo } from '@/types/todo';
import { TodoRow } from './TodoRow';
import { InlineCreateRow } from './InlineCreateRow';

interface TodoTableProps {
  rows: Todo[];
  idMap: Record<string, number>;
  onToggleCompleted: (todo: Todo) => void;
  onStartEditTitle: (todo: Todo) => void;
  onOpenDueDialog: (todo: Todo) => void;
  onInlineCreate: (title: string) => void;
  editingId: string | null;
  editingTitle: string;
  onEditingTitleChange: (title: string) => void;
  onSaveEditTitle: () => void;
  onCancelEditTitle: () => void;
  editingSubmitting: boolean;
  inlineEditing: boolean;
  inlineTitle: string;
  onInlineTitleChange: (title: string) => void;
  onStartInlineEditing: () => void;
  onStopInlineEditing: () => void;
  inlineSubmitting: boolean;
}

export const TodoTable: React.FC<TodoTableProps> = ({
  rows,
  idMap,
  onToggleCompleted,
  onStartEditTitle,
  onOpenDueDialog,
  onInlineCreate,
  editingId,
  editingTitle,
  onEditingTitleChange,
  onSaveEditTitle,
  onCancelEditTitle,
  editingSubmitting,
  inlineEditing,
  inlineTitle,
  onInlineTitleChange,
  onStartInlineEditing,
  onStopInlineEditing,
  inlineSubmitting,
}) => {
  return (
    <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
      <TableContainer>
        <Table
          size="small"
          aria-label="tasks table"
          sx={{
            '& .MuiTableCell-root': { borderBottom: 'none', py: 1.5 },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 56 }}></TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Task Title</TableCell>
              <TableCell sx={{ fontWeight: 700, width: 220 }}>Due Date</TableCell>
              <TableCell sx={{ fontWeight: 700, width: 220 }}>Created at</TableCell>
              <TableCell sx={{ fontWeight: 700, width: 140, whiteSpace: 'nowrap' }}>
                Task ID
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((todo) => (
              <TodoRow
                key={todo.id}
                todo={todo}
                idMap={idMap}
                onToggleCompleted={onToggleCompleted}
                onStartEditTitle={onStartEditTitle}
                onOpenDueDialog={onOpenDueDialog}
                editingId={editingId}
                editingTitle={editingTitle}
                onEditingTitleChange={onEditingTitleChange}
                onSaveEditTitle={onSaveEditTitle}
                onCancelEditTitle={onCancelEditTitle}
                editingSubmitting={editingSubmitting}
              />
            ))}
            <InlineCreateRow
              inlineEditing={inlineEditing}
              inlineTitle={inlineTitle}
              inlineSubmitting={inlineSubmitting}
              onInlineTitleChange={onInlineTitleChange}
              onStartInlineEditing={onStartInlineEditing}
              onStopInlineEditing={onStopInlineEditing}
              onInlineCreate={onInlineCreate}
            />
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
