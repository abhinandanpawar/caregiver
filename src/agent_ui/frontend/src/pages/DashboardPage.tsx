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
        <Grid item xs={12} md={6}>
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
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Personalized Insights</Typography>
            <Typography>
              Discover insights and recommendations tailored to you.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;