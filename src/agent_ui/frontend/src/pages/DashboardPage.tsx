import { Typography, Paper, Grid, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Announcements from '../components/Announcements';

const DashboardPage = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mt: 4, mb: 4 }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Announcements />
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Daily Mood Journal</Typography>
            <Typography sx={{ mb: 2 }}>
              Log your mood and track your wellbeing over time.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/mood-journal"
            >
              Log Your Mood
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Personalized Goals</Typography>
            <Typography sx={{ mb: 2 }}>
              Set and track your personal wellbeing and work goals.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/goals"
            >
              View Goals
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Kanban Board</Typography>
            <Typography sx={{ mb: 2 }}>
              Manage your tasks and workflow visually.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/kanban"
            >
              Open Kanban
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
