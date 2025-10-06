import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useAuth } from '../contexts/AuthContext';

interface Form {
    id: number;
    title: string;
    description: string;
}

const FormBuilder = () => {
    const [forms, setForms] = useState<Form[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([{ text: '', question_type: 'text' }]);
    const { token } = useAuth();

    const fetchForms = async () => {
        const response = await fetch('http://127.0.0.1:8001/api/v1/forms', {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
            const data = await response.json();
            setForms(data);
        }
    };

    useEffect(() => {
        fetchForms();
    }, [token]);

    const handleAddQuestion = () => {
        setQuestions([...questions, { text: '', question_type: 'text' }]);
    };

    const handleQuestionChange = (index: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[index].text = value;
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newForm = { title, description, questions };

        const response = await fetch('http://127.0.0.1:8001/api/v1/forms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newForm),
        });

        if (response.ok) {
            // Reset form and refresh list
            setTitle('');
            setDescription('');
            setQuestions([{ text: '', question_type: 'text' }]);
            fetchForms();
        } else {
            alert('Failed to create form');
        }
    };

    return (
        <Box>
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Create New Feedback Form
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Form Title"
                        fullWidth
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Form Description"
                        fullWidth
                        required
                        multiline
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Questions</Typography>
                    {questions.map((q, index) => (
                        <TextField
                            key={index}
                            label={`Question ${index + 1}`}
                            fullWidth
                            required
                            value={q.text}
                            onChange={(e) => handleQuestionChange(index, e.target.value)}
                            sx={{ mb: 2 }}
                        />
                    ))}
                    <IconButton onClick={handleAddQuestion}>
                        <AddCircleOutlineIcon />
                    </IconButton>
                    <Button type="submit" variant="contained" sx={{ mt: 2, display: 'block' }}>
                        Save Form
                    </Button>
                </form>
            </Paper>
            <Divider sx={{ my: 4 }} />
            <Typography variant="h6" gutterBottom>
                Existing Forms
            </Typography>
            <List>
                {forms.map(form => (
                    <ListItem key={form.id}>
                        <ListItemText primary={form.title} secondary={form.description} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default FormBuilder;