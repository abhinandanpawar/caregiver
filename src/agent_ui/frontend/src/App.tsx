import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Container, Button, ThemeProvider, useMediaQuery, IconButton, Menu, MenuItem, Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { motion, AnimatePresence } from 'framer-motion';
import theme from './theme';

import GoalsPage from './pages/GoalsPage';
import DashboardPage from './pages/DashboardPage';
import MoodJournalPage from './pages/MoodJournalPage';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import FeedbackPage from './pages/FeedbackPage';
import FormFillPage from './pages/FormFillPage';
import KanbanPage from './pages/KanbanPage';

// Placeholder components for the remaining pages
const DataTransparency = () => <Typography variant="h4" sx={{ mt: 4 }}>Data Transparency</Typography>;
const Settings = () => <Typography variant="h4" sx={{ mt: 4 }}>Settings</Typography>;

const AppContent = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navLinks = [
    { title: 'Dashboard', path: '/dashboard' },
    { title: 'Mood Journal', path: '/mood-journal' },
    { title: 'Goals', path: '/goals' },
    { title: 'Kanban Board', path: '/kanban' },
    { title: 'Feedback', path: '/feedback' },
    { title: 'Data Transparency', path: '/data-transparency' },
    { title: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {!isLandingPage && (
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              WAVES Personal Dashboard
            </Typography>
            {isMobile ? (
              <>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenu}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  {navLinks.map((link) => (
                    <MenuItem key={link.title} onClick={handleClose} component={Link} to={link.path}>
                      {link.title}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Box>
                {navLinks.map((link) => (
                  <Button key={link.title} color="inherit" component={Link} to={link.path}>
                    {link.title}
                  </Button>
                ))}
              </Box>
            )}
          </Toolbar>
        </AppBar>
      )}
      <Container sx={{p: isLandingPage ? 0 : 2, m: isLandingPage ? 0 : 'auto', maxWidth: isLandingPage ? '100%' : 'lg' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Routes location={location}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/mood-journal" element={<MoodJournalPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/kanban" element={<KanbanPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/forms/:formId" element={<FormFillPage />} />
              <Route path="/data-transparency" element={<DataTransparency />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Container>
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
