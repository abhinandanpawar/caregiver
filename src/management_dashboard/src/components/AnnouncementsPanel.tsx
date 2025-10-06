import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
}

const AnnouncementsPanel = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const { token } = useAuth();

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8001/api/v1/announcements', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch announcements');
      }
      const data = await response.json();
      setAnnouncements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [token]);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:8001/api/v1/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to create announcement');
      }

      // Refresh the list after creating
      setNewTitle('');
      setNewContent('');
      fetchAnnouncements();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Manage Announcements
      </Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6">Create New Announcement</Typography>
        <Box component="form" onSubmit={handleCreateAnnouncement} sx={{ mt: 2 }}>
          <TextField
            label="Title"
            fullWidth
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Content"
            fullWidth
            required
            multiline
            rows={4}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Button type="submit" variant="contained">
            Post Announcement
          </Button>
        </Box>
      </Paper>

      <Typography variant="h6">Existing Announcements</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {announcements.map((ann) => (
            <ListItem key={ann.id} sx={{ borderBottom: '1px solid #eee' }}>
              <ListItemText
                primary={ann.title}
                secondary={`${new Date(ann.date).toLocaleDateString()} - ${ann.content}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default AnnouncementsPanel;