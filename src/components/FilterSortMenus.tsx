'use client';
import { useState } from 'react';
import { IconButton, Menu, MenuItem, Box } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import SortIcon from '@mui/icons-material/Sort';
import CheckIcon from '@mui/icons-material/Check';
import { TodoStatus, SortBy } from '@/types/todo';
import { STATUS_OPTIONS, SORT_OPTIONS } from '@/constants/menuOptions';

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
        {STATUS_OPTIONS.map((opt) => (
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
        {SORT_OPTIONS.map((opt) => (
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
