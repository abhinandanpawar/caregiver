import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';

const LandingPage = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <Box
        sx={{
          py: 10,
          textAlign: 'center',
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          color: 'white',
        }}
      >
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Unlock Your Team's Potential
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            A proactive approach to employee well-being and productivity.
          </Typography>
          <Button variant="contained" size="large" sx={{ mr: 2 }}>
            Get Started
          </Button>
          <Button variant="outlined" size="large" sx={{ color: 'white', borderColor: 'white' }}>
            Request a Demo
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center" sx={{ mb: 6 }}>
          Key Features
        </Typography>
        <Grid container spacing={4}>
          {['Personalized Insights', 'Goal Tracking', 'Mood Journal', 'Kanban Board'].map((feature) => (
            <Grid item xs={12} sm={6} md={3} key={feature}>
              <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6">{feature}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ py: 8, backgroundColor: '#f5f5f5' }}>
        <Container>
          <Typography variant="h4" component="h2" gutterBottom textAlign="center" sx={{ mb: 6 }}>
            How It Works
          </Typography>
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ mb: 2 }}>1. Sign Up</Typography>
              <Typography>Create an account to get started.</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ mb: 2 }}>2. Use The Tools</Typography>
              <Typography>Engage with the mood journal, goals, and kanban board.</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ mb: 2 }}>3. Gain Insights</Typography>
              <Typography>Receive personalized insights to improve your well-being.</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Screenshot Gallery */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center" sx={{ mb: 6 }}>
          Platform in Action
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}><Paper sx={{ height: 200, backgroundColor: '#ccc' }} /></Grid>
          <Grid item xs={12} sm={6} md={3}><Paper sx={{ height: 200, backgroundColor: '#ccc' }} /></Grid>
          <Grid item xs={12} sm={6} md={3}><Paper sx={{ height: 200, backgroundColor: '#ccc' }} /></Grid>
          <Grid item xs={12} sm={6} md={3}><Paper sx={{ height: 200, backgroundColor: '#ccc' }} /></Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;