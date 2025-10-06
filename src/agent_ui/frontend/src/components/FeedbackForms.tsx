import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';

interface Form {
  id: number;
  title: string;
  description: string;
}

const FeedbackForms = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        // This endpoint is now public and doesn't require a token
        const response = await fetch('http://127.0.0.1:8001/api/v1/forms');
        if (!response.ok) {
          throw new Error('Failed to fetch forms');
        }
        const data = await response.json();
        setForms(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  return (
    <Paper sx={{ p: 2, mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Available Feedback Forms
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <List>
          {forms.map((form) => (
            <ListItem
              key={form.id}
              secondaryAction={
                <Button component={Link} to={`/forms/${form.id}`} variant="contained">
                  Fill Out
                </Button>
              }
              sx={{ borderBottom: '1px solid #eee' }}
            >
              <ListItemText
                primary={form.title}
                secondary={form.description}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default FeedbackForms;