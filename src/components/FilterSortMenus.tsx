'use client';
import { useState } from 'react';
import { IconButton, Menu, MenuItem, Box } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import SortIcon from '@mui/icons-material/Sort';
import CheckIcon from '@mui/icons-material/Check';
import { TodoStatus, SortBy } from '@/types/todo';

interface FilterSortMenusProps {
  status: TodoStatus;
  sortBy: SortBy;
  onStatusChange: (status: TodoStatus) => void;
  onSortByChange: (sortBy: SortBy) => void;
}

export const FilterSortMenus: React.FC<FilterSortMenusProps> = ({
  status,
  sortBy,
  onStatusChange,
  onSortByChange,
}) => {
  const [filterEl, setFilterEl] = useState<null | HTMLElement>(null);
  const [sortEl, setSortEl] = useState<null | HTMLElement>(null);

  const statusOptions = [
    { key: 'active', label: '进行中' },
    { key: 'completed', label: '已完成' },
    { key: 'all', label: '全部任务' },
  ] as const;

  const sortOptions = [
    { key: 'createdAt', label: 'Created at' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'order', label: 'Task ID' },
  ] as const;

  return (
    <>
      <IconButton
        size="small"
        aria-label="filter"
        sx={{ color: 'grey.400' }}
        onClick={(e) => setFilterEl(e.currentTarget)}
      >
        <TuneIcon />
      </IconButton>
      <IconButton
        size="small"
        aria-label="sort"
        sx={{ color: 'grey.400' }}
        onClick={(e) => setSortEl(e.currentTarget)}
      >
        <SortIcon />
      </IconButton>

      <Menu
        anchorEl={filterEl}
        open={Boolean(filterEl)}
        onClose={() => setFilterEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        disablePortal={false}
        disableScrollLock
        keepMounted
      >
        {statusOptions.map((opt) => (
          <MenuItem
            key={opt.key}
            onClick={() => {
              onStatusChange(opt.key);
              setFilterEl(null);
            }}
            selected={status === opt.key}
            sx={{
              ...(status === opt.key && { color: 'primary.main' }),
              minWidth: 180,
            }}
          >
            <Box sx={{ flex: 1 }}>{opt.label}</Box>
            {status === opt.key && <CheckIcon fontSize="small" />}
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={sortEl}
        open={Boolean(sortEl)}
        onClose={() => setSortEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        disablePortal={false}
        disableScrollLock
        keepMounted
      >
        {sortOptions.map((opt) => (
          <MenuItem
            key={opt.key}
            onClick={() => {
              onSortByChange(opt.key);
              setSortEl(null);
            }}
            selected={sortBy === opt.key}
            sx={{
              ...(sortBy === opt.key && { color: 'primary.main' }),
              minWidth: 200,
            }}
          >
            <Box sx={{ flex: 1 }}>{opt.label}</Box>
            {sortBy === opt.key && <CheckIcon fontSize="small" />}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
