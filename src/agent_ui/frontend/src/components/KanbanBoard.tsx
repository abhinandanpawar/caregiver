import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Box, Typography, Button, TextField, Paper, IconButton, CircularProgress, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Task {
  id: string;
  content: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

interface BoardData {
  columns: Column[];
}

// --- Sortable Task Component ---
const SortableTask = ({ task, onDelete }: { task: Task, onDelete: (id: string) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: 'Task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{ p: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'grab', '&:active': { cursor: 'grabbing' } }}
    >
      <Typography>{task.content}</Typography>
      <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} onPointerDown={(e) => e.stopPropagation()}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
};

// --- Column Component ---
const KanbanColumn = ({ column, onAddTask, onDeleteTask, onDeleteColumn }: { column: Column, onAddTask: (colId: string, content: string) => void, onDeleteTask: (taskId: string) => void, onDeleteColumn: (colId: string) => void }) => {
  const [newTaskContent, setNewTaskContent] = useState('');

  const handleAddTask = () => {
    if (newTaskContent.trim() !== '') {
      onAddTask(column.id, newTaskContent);
      setNewTaskContent('');
    }
  };

  return (
    <Paper sx={{ width: 300, p: 2, bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{column.title}</Typography>
        <IconButton size="small" onClick={() => onDeleteColumn(column.id)}>
          <DeleteIcon />
        </IconButton>
      </Box>

      <Box sx={{ flexGrow: 1, minHeight: 100 }}>
        <SortableContext items={column.tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {column.tasks.map(task => (
            <SortableTask key={task.id} task={task} onDelete={onDeleteTask} />
          ))}
        </SortableContext>
      </Box>

      <Box sx={{ mt: 2, display: 'flex' }}>
        <TextField
          size="small"
          placeholder="New task..."
          value={newTaskContent}
          onChange={(e) => setNewTaskContent(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') handleAddTask(); }}
          fullWidth
        />
        <IconButton color="primary" onClick={handleAddTask}>
          <AddIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};


// --- Main Kanban Board Component ---
const KanbanBoard = () => {
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchBoard();
  }, []);

  const fetchBoard = () => {
    setLoading(true);
    fetch('/api/board')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch board data');
        return res.json();
      })
      .then(data => {
        setBoardData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  const saveBoard = (newData: BoardData) => {
    fetch('/api/board', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData),
    })
    .catch(err => setError(err.message));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { id } = active;
    setActiveId(id as string);

    if (boardData) {
      for (const col of boardData.columns) {
        const task = col.tasks.find(t => t.id === id);
        if (task) {
          setActiveTask(task);
          break;
        }
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Find columns containing active and over elements
    const activeColumn = findColumnOfTask(activeId as string);
    const overColumn = findColumnOfTask(overId as string) || findColumn(overId as string);

    if (!activeColumn || !overColumn) return;

    if (activeColumn.id !== overColumn.id) {
      setBoardData((prev) => {
        if (!prev) return prev;

        const activeItems = activeColumn.tasks;
        const overItems = overColumn.tasks;
        const activeIndex = activeItems.findIndex(t => t.id === activeId);
        const overIndex = overItems.findIndex(t => t.id === overId);

        let newIndex: number;
        if (overId in prev.columns.map(c => c.id)) {
            newIndex = overItems.length + 1;
        } else {
            const isBelowOverItem =
            over &&
            active.rect.current.translated &&
            active.rect.current.translated.top > over.rect.top + over.rect.height;
            const modifier = isBelowOverItem ? 1 : 0;
            newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
        }


        const newColumns = prev.columns.map(col => {
            if (col.id === activeColumn.id) {
                return { ...col, tasks: col.tasks.filter(t => t.id !== activeId) };
            }
            if (col.id === overColumn.id) {
                return {
                    ...col,
                    tasks: [
                        ...col.tasks.slice(0, newIndex),
                        activeItems[activeIndex],
                        ...col.tasks.slice(newIndex, col.tasks.length)
                    ]
                }
            }
            return col;
        });

        return { columns: newColumns };
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeColumn = findColumnOfTask(activeId as string);
    const overColumn = findColumnOfTask(overId as string);

    if (activeColumn && overColumn && activeColumn.id === overColumn.id) {
      setBoardData(prev => {
        if (!prev) return prev;

        const activeIndex = activeColumn.tasks.findIndex(t => t.id === activeId);
        const overIndex = overColumn.tasks.findIndex(t => t.id === overId);

        if (activeIndex !== overIndex) {
            const newColumns = prev.columns.map(col => {
                if (col.id === activeColumn.id) {
                    return {
                        ...col,
                        tasks: arrayMove(col.tasks, activeIndex, overIndex)
                    };
                }
                return col;
            });
            const newData = { columns: newColumns };
            saveBoard(newData);
            return newData;
        }

        return prev;
      });
    } else if (boardData) {
        // If it was moved between columns, the DragOver handled the state change,
        // we just need to save the final state here.
        saveBoard(boardData);
    }
  };

  const findColumnOfTask = (taskId: string) => {
    if (!boardData) return null;
    return boardData.columns.find(col => col.tasks.some(task => task.id === taskId));
  };

  const findColumn = (colId: string) => {
      if (!boardData) return null;
      return boardData.columns.find(col => col.id === colId);
  }

  const handleAddTask = (columnId: string, content: string) => {
    if (!boardData) return;
    const newTask: Task = { id: `task-${Date.now()}`, content };

    const newData = {
      columns: boardData.columns.map(col =>
        col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col
      )
    };
    setBoardData(newData);
    saveBoard(newData);
  };

  const handleDeleteTask = (taskId: string) => {
    if (!boardData) return;
    const newData = {
      columns: boardData.columns.map(col => ({
        ...col,
        tasks: col.tasks.filter(t => t.id !== taskId)
      }))
    };
    setBoardData(newData);
    saveBoard(newData);
  };

  const handleAddColumn = () => {
    if (!boardData) return;
    const title = prompt("Enter column title:");
    if (!title) return;

    const newColumn: Column = { id: `col-${Date.now()}`, title, tasks: [] };
    const newData = { columns: [...boardData.columns, newColumn] };
    setBoardData(newData);
    saveBoard(newData);
  };

  const handleDeleteColumn = (colId: string) => {
      if (!boardData) return;
      if (!window.confirm("Are you sure you want to delete this column and all its tasks?")) return;

      const newData = { columns: boardData.columns.filter(c => c.id !== colId) };
      setBoardData(newData);
      saveBoard(newData);
  }

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!boardData) return null;

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Kanban Board</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddColumn}>
          Add Column
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 2 }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {boardData.columns.map(col => (
            <KanbanColumn
              key={col.id}
              column={col}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onDeleteColumn={handleDeleteColumn}
            />
          ))}

          <DragOverlay dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }),
          }}>
            {activeId && activeTask ? (
              <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.8, rotate: '5deg' }}>
                <Typography>{activeTask.content}</Typography>
              </Paper>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Box>
    </Box>
  );
};

export default KanbanBoard;
