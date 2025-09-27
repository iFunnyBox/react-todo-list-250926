'use client';
import { TextField, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

interface EditableTextFieldProps {
  value: string;
  isEditing: boolean;
  onSubmit: (value: string) => void;
  onCancel: () => void;
  onStartEdit: () => void;
  submitting?: boolean;
  placeholder?: string;
  variant?: 'body2' | 'body1' | 'h6' | 'h5' | 'h4' | 'h3' | 'h2' | 'h1';
  color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  sx?: any;
}

export const EditableTextField: React.FC<EditableTextFieldProps> = ({
  value,
  isEditing,
  onSubmit,
  onCancel,
  onStartEdit,
  submitting = false,
  placeholder = '',
  variant = 'body2',
  color = 'inherit',
  sx = {},
}) => {
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSubmit = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== value) {
      onSubmit(trimmedValue);
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  const handleBlur = () => {
    if (!submitting) {
      handleSubmit();
    }
  };

  if (isEditing) {
    return (
      <TextField
        autoFocus
        fullWidth
        size="small"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={submitting}
      />
    );
  }

  return (
    <Typography
      variant={variant}
      color={color}
      sx={{ cursor: 'text', ...sx }}
      onDoubleClick={onStartEdit}
    >
      {value}
    </Typography>
  );
};
