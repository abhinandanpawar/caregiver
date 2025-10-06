import { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Container, Button } from '@mui/material';
import { useAuth } from './contexts/AuthContext';

const Layout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: '#2c3e50' }}>
        <Toolbar>
          <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, color: 'white', textDecoration: 'none' }}>
            WAVES Employee Wellness
          </Typography>
          {user && user.role === 'admin' && (
            <Button color="inherit" component={RouterLink} to="/admin">
              Admin Panel
            </Button>
          )}
          {user ? (
            <>
              <Typography sx={{ mx: 2 }}>
                {user.username} ({user.role})
              </Typography>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          backgroundColor: '#f4f6f8'
        }}
      >
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;