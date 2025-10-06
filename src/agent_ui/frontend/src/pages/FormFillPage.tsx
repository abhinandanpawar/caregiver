import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  TextField,
} from '@mui/material';

interface Question {
  id: number;
  text: string;
  question_type: string;
}

interface Form {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

interface Answer {
  question_id: number;
  value: string;
}

const FormFillPage = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8001/api/v1/forms/${formId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch form details');
        }
        const data = await response.json();
        setForm(data);
        // Initialize answers state
        setAnswers(data.questions.map((q: Question) => ({ question_id: q.id, value: '' })));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(
      answers.map((ans) =>
        ans.question_id === questionId ? { ...ans, value } : ans
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Note: In a real app, the employee's auth token would be sent.
      // The current backend implementation uses a mock user.
      const response = await fetch('http://127.0.0.1:8001/api/v1/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_id: form?.id, answers }),
      });
      if (response.ok) {
        alert('Thank you for your feedback!');
        navigate('/'); // Redirect to dashboard after submission
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
  }

  if (!form) {
    return <Typography>Form not found.</Typography>;
  }

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h4" gutterBottom>{form.title}</Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>{form.description}</Typography>
      <form onSubmit={handleSubmit}>
        {form.questions.map((question, index) => (
          <Box key={question.id} sx={{ mb: 3 }}>
            <Typography variant="h6">{`${index + 1}. ${question.text}`}</Typography>
            <TextField
              fullWidth
              required
              multiline
              rows={3}
              variant="outlined"
              value={answers.find(a => a.question_id === question.id)?.value || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              sx={{ mt: 1 }}
            />
          </Box>
        ))}
        <Button type="submit" variant="contained" size="large">
          Submit Feedback
        </Button>
      </form>
    </Paper>
  );
};

export default FormFillPage;