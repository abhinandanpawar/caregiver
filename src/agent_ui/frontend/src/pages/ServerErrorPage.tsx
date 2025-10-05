import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const ServerErrorPage = () => {
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
        500
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Internal Server Error
      </Typography>
      <Typography sx={{ mb: 4 }}>
        Something went wrong on our end. Please try again later.
      </Typography>
      <Button variant="contained" component={Link} to="/">
        Go to Homepage
      </Button>
    </Box>
  );
};

export default ServerErrorPage;