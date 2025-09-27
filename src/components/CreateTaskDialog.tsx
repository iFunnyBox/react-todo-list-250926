'use client';
import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
} from '@mui/material';

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (title: string, dueDate?: string) => void;
}

export const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({ open, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleCreate = () => {
    if (!title.trim()) return;
    const formattedDueDate = dueDate ? new Date(dueDate).toISOString() : undefined;
    onCreate(title.trim(), formattedDueDate);
    setTitle('');
    setDueDate('');
  };

  const handleClose = () => {
    onClose();
    setTitle('');
    setDueDate('');
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>New Task</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            autoFocus
            label="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
          <TextField
            label="Due Date"
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleCreate} disabled={!title.trim()}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
