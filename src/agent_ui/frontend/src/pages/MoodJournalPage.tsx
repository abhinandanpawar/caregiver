import { useState } from 'react';
import { Typography, Paper, Grid, TextField, Button } from '@mui/material';

const MoodJournalPage = () => {
  const [mood, setMood] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    try {
      const response = await fetch('/api/mood-journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood, notes }),
      });

      if (response.ok) {
        alert('Mood saved successfully!');
        setMood('');
        setNotes('');
      } else {
        alert('Failed to save mood. Please try again.');
      }
    } catch (error) {
      console.error('Error saving mood:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <Typography variant="h4" sx={{ mt: 4, mb: 4 }}>
        Daily Mood Journal
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">How are you feeling today?</Typography>
            {/* Simple text input for mood for now */}
            <TextField
              label="Your Mood"
              variant="outlined"
              fullWidth
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              sx={{ mt: 2 }}
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
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save Mood
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default MoodJournalPage;