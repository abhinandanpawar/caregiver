import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const ForbiddenPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
        textAlign: 'center',
      }}
    >
      <Typography variant="h1" component="h1" gutterBottom>
        403
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Access Denied
      </Typography>
      <Typography sx={{ mb: 4 }}>
        You do not have permission to view this page.
      </Typography>
      <Button variant="contained" component={Link} to="/">
        Go to Homepage
      </Button>
    </Box>
  );
};

export default ForbiddenPage;