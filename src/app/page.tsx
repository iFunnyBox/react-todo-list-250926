'use client';
import styles from './page.module.css';
import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TuneIcon from '@mui/icons-material/Tune';
import SortIcon from '@mui/icons-material/Sort';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined';
import CheckIcon from '@mui/icons-material/Check';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { format } from 'date-fns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  order?: number;
  dueDate?: string;
};

export default function Home() {
  const [items, setItems] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDue, setNewDue] = useState<string>('');
  const [inlineEditing, setInlineEditing] = useState(false);
  const [inlineTitle, setInlineTitle] = useState('');
  const [inlineSubmitting, setInlineSubmitting] = useState(false);
  const [status, setStatus] = useState<'active' | 'completed' | 'all'>('active');
  const [sortBy, setSortBy] = useState<'createdAt' | 'dueDate' | 'order'>('createdAt');
  const [filterEl, setFilterEl] = useState<null | HTMLElement>(null);
  const [idMap, setIdMap] = useState<Record<string, number>>({});
  const [nextId, setNextId] = useState(1);
  const [sortEl, setSortEl] = useState<null | HTMLElement>(null);
  const [dueEditId, setDueEditId] = useState<string | null>(null);
  const [dueEditValue, setDueEditValue] = useState<Date | null>(null);
  const [dueSubmitting, setDueSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingSubmitting, setEditingSubmitting] = useState(false);

  const toggleCompleted = async (todo: Todo) => {
    const next = !todo.completed;
    setItems((prev) => prev.map((t) => (t.id === todo.id ? { ...t, completed: next } : t)));
    try {
      await fetch(`/api/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: next }),
      });
      // 若当前过滤非 all，需要同步刷新以反映过滤结果
      if (status !== 'all') {
        await fetchTodos();
      }
    } catch (_) {
      setItems((prev) => prev.map((t) => (t.id === todo.id ? { ...t, completed: !next } : t)));
    }
  };

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const sortDir = sortBy === 'dueDate' ? 'asc' : 'desc';
      const res = await fetch(`/api/todos?status=${status}&sortBy=${sortBy}&sortDir=${sortDir}`, {
        cache: 'no-store',
      });
      const json = await res.json();
      const newItems: Todo[] = json.data?.items || [];
      setItems(newItems);
      setIdMap((prev) => {
        let updated = { ...prev };
        let counter = nextId;
        for (const t of newItems) {
          if (updated[t.id] === undefined) {
            updated[t.id] = counter++;
          }
        }
        if (counter !== nextId) setNextId(counter);
        return updated;
      });
    } catch (e) {
      // noop
    } finally {
      setLoading(false);
    }
  };

  const startEditTitle = (todo: Todo) => {
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
    const prev = items;
    setItems((curr) => curr.map((t) => (t.id === id ? { ...t, title } : t)));
    try {
      await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      setEditingId(null);
      setEditingTitle('');
    } catch (_) {
      setItems(prev);
    } finally {
      setEditingSubmitting(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [status, sortBy]);

  const rows = useMemo(() => {
    const arr = [...items];
    if (sortBy === 'order') {
      arr.sort((a, b) => (idMap[a.id] ?? 0) - (idMap[b.id] ?? 0));
    } else if (sortBy === 'dueDate') {
      arr.sort((a, b) => {
        const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return aTime - bTime; // 升序
      });
    }
    return arr;
  }, [items, sortBy, idMap]);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    try {
      await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim(), dueDate: newDue || undefined }),
      });
      setOpen(false);
      setNewTitle('');
      setNewDue('');
      await fetchTodos();
    } catch (_) {}
  };

  const handleInlineCreate = async () => {
    const title = inlineTitle.trim();
    if (!title) return;
    setInlineSubmitting(true);
    try {
      await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      setInlineEditing(false);
      setInlineTitle('');
      await fetchTodos();
    } catch (_) {
      setInlineEditing(false);
    } finally {
      setInlineSubmitting(false);
    }
  };

  const formatDateTime = (iso?: string) => {
    if (!iso) return '';
    try {
      return format(new Date(iso), 'yyyy/MM/dd HH:mm');
    } catch {
      return '';
    }
  };

  const isOverdue = (todo: Todo) => {
    if (!todo.dueDate || todo.completed) return false;
    try {
      return new Date(todo.dueDate).getTime() < Date.now();
    } catch {
      return false;
    }
  };

  const openDueDialog = (todo: Todo) => {
    setDueEditId(todo.id);
    setDueEditValue(todo.dueDate ? new Date(todo.dueDate) : new Date());
  };

  const closeDueDialog = () => {
    if (!dueSubmitting) {
      setDueEditId(null);
      setDueEditValue(null);
    }
  };

  const saveDueDate = async () => {
    const id = dueEditId;
    if (!id) return;
    setDueSubmitting(true);
    const newIso = dueEditValue ? new Date(dueEditValue).toISOString() : undefined;
    const prev = items;
    setItems((curr) => curr.map((t) => (t.id === id ? { ...t, dueDate: newIso } : t)));
    try {
      await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dueDate: newIso }),
      });
      closeDueDialog();
    } catch (_) {
      setItems(prev);
      closeDueDialog();
    } finally {
      setDueSubmitting(false);
    }
  };

  const mergeDateAndTime = (datePart: Date | null, timePart: Date | null): Date | null => {
    if (!datePart && !timePart) return null;
    const base = new Date(datePart || timePart || new Date());
    const hours = timePart ? timePart.getHours() : dueEditValue?.getHours() ?? 0;
    const minutes = timePart ? timePart.getMinutes() : dueEditValue?.getMinutes() ?? 0;
    const merged = new Date(base);
    merged.setHours(hours, minutes, 0, 0);
    return merged;
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
        </Stack>
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
                {rows.map((todo, idx) => (
                  <TableRow key={todo.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={todo.completed}
                        disableRipple
                        sx={{ p: 0.5 }}
                        icon={
                          <RadioButtonUncheckedOutlinedIcon
                            fontSize="small"
                            sx={{ color: 'grey.500' }}
                          />
                        }
                        checkedIcon={
                          <Box
                            component="span"
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              bgcolor: '#419E34',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <CheckIcon sx={{ color: '#fff', fontSize: 16 }} />
                          </Box>
                        }
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleCompleted(todo);
                        }}
                      />
                    </TableCell>
                    <TableCell onDoubleClick={() => startEditTitle(todo)} sx={{ cursor: 'text' }}>
                      {editingId === todo.id ? (
                        <TextField
                          autoFocus
                          fullWidth
                          size="small"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onBlur={cancelEditTitle}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              saveEditTitle();
                            } else if (e.key === 'Escape') {
                              e.preventDefault();
                              cancelEditTitle();
                            }
                          }}
                        />
                      ) : (
                        <Typography variant="body2">{todo.title}</Typography>
                      )}
                    </TableCell>
                    <TableCell onDoubleClick={() => openDueDialog(todo)} sx={{ cursor: 'pointer' }}>
                      {todo.dueDate ? (
                        <Typography color={isOverdue(todo) ? 'error' : 'inherit'}>
                          {formatDateTime(todo.dueDate)}
                        </Typography>
                      ) : (
                        <CalendarTodayOutlinedIcon
                          sx={{ color: 'text.disabled' }}
                          fontSize="small"
                        />
                      )}
                    </TableCell>
                    <TableCell>{formatDateTime(todo.createdAt)}</TableCell>
                    <TableCell sx={{ width: 140, whiteSpace: 'nowrap' }}>
                      {idMap[todo.id] ?? ''}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow
                  hover
                  onClick={() => {
                    setInlineEditing(true);
                    setInlineTitle('');
                  }}
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
                        onChange={(e) => setInlineTitle(e.target.value)}
                        onBlur={() => {
                          if (!inlineSubmitting) {
                            setInlineEditing(false);
                            setInlineTitle('');
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleInlineCreate();
                          } else if (e.key === 'Escape') {
                            e.preventDefault();
                            setInlineEditing(false);
                            setInlineTitle('');
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
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

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
        {[
          { key: 'active', label: '进行中' },
          { key: 'completed', label: '已完成' },
          { key: 'all', label: '全部任务' },
        ].map((opt) => (
          <MenuItem
            key={opt.key}
            onClick={() => {
              setStatus(opt.key as any);
              setFilterEl(null);
            }}
            selected={status === (opt.key as any)}
            sx={{
              ...(status === (opt.key as any) && { color: 'primary.main' }),
              minWidth: 180,
            }}
          >
            <Box sx={{ flex: 1 }}>{opt.label}</Box>
            {status === (opt.key as any) && <CheckIcon fontSize="small" />}
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
        {[
          { key: 'createdAt', label: 'Created at' },
          { key: 'dueDate', label: 'Due Date' },
          { key: 'order', label: 'Task ID' },
        ].map((opt) => (
          <MenuItem
            key={opt.key}
            onClick={() => {
              setSortBy(opt.key as any);
              setSortEl(null);
            }}
            selected={sortBy === (opt.key as any)}
            sx={{
              ...(sortBy === (opt.key as any) && { color: 'primary.main' }),
              minWidth: 200,
            }}
          >
            <Box sx={{ flex: 1 }}>{opt.label}</Box>
            {sortBy === (opt.key as any) && <CheckIcon fontSize="small" />}
          </MenuItem>
        ))}
      </Menu>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>New Task</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              autoFocus
              label="Task Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              fullWidth
            />
            <TextField
              label="Due Date"
              type="datetime-local"
              value={newDue}
              onChange={(e) => setNewDue(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!newTitle.trim()}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(dueEditId)} onClose={closeDueDialog}>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex' }}>
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                value={dueEditValue}
                onChange={(newDate) => setDueEditValue(mergeDateAndTime(newDate, null))}
                slotProps={{
                  layout: { sx: { bgcolor: '#0000' } },
                  actionBar: { actions: [] },
                }}
              />
              <MultiSectionDigitalClock
                value={dueEditValue}
                onChange={(newTime) => setDueEditValue(mergeDateAndTime(dueEditValue, newTime))}
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
            onClick={closeDueDialog}
            sx={{
              bgcolor: 'common.white',
              color: 'common.black',
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            取消
          </Button>
          <Button variant="contained" onClick={saveDueDate} disabled={dueSubmitting}>
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
