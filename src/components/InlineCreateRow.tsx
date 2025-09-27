'use client';
import { Box, TableCell, TableRow, TextField } from '@mui/material';

interface InlineCreateRowProps {
  inlineEditing: boolean;
  inlineTitle: string;
  inlineSubmitting: boolean;
  onInlineTitleChange: (title: string) => void;
  onStartInlineEditing: () => void;
  onStopInlineEditing: () => void;
  onInlineCreate: (title: string) => void;
}

export const InlineCreateRow: React.FC<InlineCreateRowProps> = ({
  inlineEditing,
  inlineTitle,
  inlineSubmitting,
  onInlineTitleChange,
  onStartInlineEditing,
  onStopInlineEditing,
  onInlineCreate,
}) => {
  return (
    <TableRow
      hover
      onClick={onStartInlineEditing}
      sx={{
        cursor: 'text',
        ...(inlineEditing && { backgroundColor: 'rgba(255,255,255,0.06)' }),
      }}
    >
      <TableCell />
      <TableCell colSpan={4}>
        {inlineEditing ? (
          <TextField
            autoFocus
            fullWidth
            placeholder="New Task"
            size="small"
            value={inlineTitle}
            onChange={(e) => onInlineTitleChange(e.target.value)}
            onBlur={() => {
              if (!inlineSubmitting) {
                onStopInlineEditing();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onInlineCreate(inlineTitle);
              } else if (e.key === 'Escape') {
                e.preventDefault();
                onStopInlineEditing();
              }
            }}
          />
        ) : (
          <Box display="inline-flex" sx={{ color: 'text.secondary' }}>
            New Task
          </Box>
        )}
      </TableCell>
    </TableRow>
  );
};
