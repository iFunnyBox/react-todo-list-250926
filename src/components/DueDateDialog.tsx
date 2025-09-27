'use client';
import { useState, useEffect } from 'react';
import { Button, Dialog, DialogContent, DialogActions, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { mergeDateAndTime } from '@/utils/dateUtils';

interface DueDateDialogProps {
  open: boolean;
  initialValue: Date | null;
  onClose: () => void;
  onSave: (date: Date | null) => void;
  submitting: boolean;
}

export const DueDateDialog: React.FC<DueDateDialogProps> = ({
  open,
  initialValue,
  onClose,
  onSave,
  submitting,
}) => {
  const [value, setValue] = useState<Date | null>(initialValue);

  // 当对话框打开时，重置值
  useEffect(() => {
    if (open) {
      setValue(initialValue);
    }
  }, [open, initialValue]);

  const handleSave = async () => {
    if (submitting) return;
    await onSave(value);
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ display: 'flex' }}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              value={value}
              onChange={(newDate) => setValue(mergeDateAndTime(newDate, null))}
              slotProps={{
                layout: { sx: { bgcolor: '#0000' } },
                actionBar: { actions: [] },
              }}
            />
            <MultiSectionDigitalClock
              value={value}
              onChange={(newTime) => setValue(mergeDateAndTime(value, newTime))}
              ampm
              views={['hours', 'minutes']}
              sx={{
                bgcolor: '#0000',
                borderBottom: 'none',
                '& .MuiList-root': {
                  overflow: 'hidden',
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': { display: 'none' },
                },
              }}
            />
          </Box>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          disabled={submitting}
          sx={{
            bgcolor: 'common.white',
            color: 'common.black',
            '&:hover': { bgcolor: 'grey.100' },
          }}
        >
          取消
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={submitting}>
          {submitting ? '保存中...' : '确认'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
