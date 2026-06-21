import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Alert, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SkeletonLoader from './SkeletonLoader';

interface Goal {
    id: string;
    content: string;
    status: string;
}

const Goals = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [newGoal, setNewGoal] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/goals')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch goals');
                }
                return res.json();
            })
            .then(data => {
                setGoals(data.goals);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleAddGoal = () => {
        if (newGoal.trim() === '') return;

        fetch('/api/goals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: newGoal }),
        })
        .then(res => res.json())
        .then(data => {
            setGoals([...goals, data]);
            setNewGoal('');
        })
        .catch(err => setError(err.message));
    };

    const handleDeleteGoal = (id: string) => {
        fetch(`/api/goals/${id}`, { method: 'DELETE' })
            .then(() => {
                setGoals(goals.filter(goal => goal.id !== id));
            })
            .catch(err => setError(err.message));
    };

    const handleToggleStatus = (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'completed' : 'active';
        fetch(`/api/goals/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        })
        .then(() => {
            setGoals(goals.map(goal =>
                goal.id === id ? { ...goal, status: newStatus } : goal
            ));
        })
        .catch(err => setError(err.message));
    };


    if (loading) return <SkeletonLoader />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>My Goals</Typography>
            <Box sx={{ display: 'flex', mb: 2 }}>
                <TextField
                    label="New Goal"
                    variant="outlined"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') handleAddGoal();
                    }}
                    fullWidth
                />
                <Button variant="contained" onClick={handleAddGoal} sx={{ ml: 2 }}>Add</Button>
            </Box>
            <List>
                {goals.map((goal) => (
                    <ListItem key={goal.id} disablePadding sx={{ py: 1 }}>
                        <Checkbox
                            checked={goal.status === 'completed'}
                            onChange={() => handleToggleStatus(goal.id, goal.status)}
                        />
                        <ListItemText
                            primary={goal.content}
                            sx={{
                                textDecoration: goal.status === 'completed' ? 'line-through' : 'none',
                                color: goal.status === 'completed' ? 'text.secondary' : 'text.primary'
                            }}
                        />
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteGoal(goal.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Goals;
