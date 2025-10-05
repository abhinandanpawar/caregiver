import { useState } from 'react';
import {
  Typography, Paper, Grid, TextField, Button, Snackbar, Alert, CircularProgress, Box
} from '@mui/material';

const MoodJournalPage = () => {
  const [mood, setMood] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/mood-journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood, notes }),
      });

      if (response.ok) {
        setNotification({ open: true, message: 'Mood saved successfully!', severity: 'success' });
        setMood('');
        setNotes('');
      } else {
        setNotification({ open: true, message: 'Failed to save mood. Please try again.', severity: 'error' });
      }
    } catch (error) {
      console.error('Error saving mood:', error);
      setNotification({ open: true, message: 'An error occurred. Please try again.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mt: 4, mb: 4 }}>
        Daily Mood Journal
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">How are you feeling today?</Typography>
            <TextField
              label="Your Mood"
              variant="outlined"
              fullWidth
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              sx={{ mt: 2 }}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Add some notes</Typography>
            <TextField
              label="Your Notes"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ mt: 2 }}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSave} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Save Mood'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MoodJournalPage;