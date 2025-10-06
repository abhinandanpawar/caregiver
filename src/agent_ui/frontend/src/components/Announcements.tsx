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
} from '@mui/material';

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
}

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        // This endpoint is now public and doesn't require a token
        const response = await fetch('http://127.0.0.1:8001/api/v1/announcements');
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

    fetchAnnouncements();
  }, []);

  return (
    <Paper sx={{ p: 2, mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Company Announcements
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
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
    </Paper>
  );
};

export default Announcements;