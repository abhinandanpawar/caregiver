import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, ThemeProvider } from '@mui/material';
import theme from './theme';

import KanbanPage from './pages/KanbanPage';
import GoalsPage from './pages/GoalsPage';
import HomePage from './pages/HomePage';
import MoodJournalPage from './pages/MoodJournalPage';

// Placeholder components for the remaining pages
const DataTransparency = () => <Typography variant="h4" sx={{ mt: 4 }}>Data Transparency</Typography>;
const Settings = () => <Typography variant="h4" sx={{ mt: 4 }}>Settings</Typography>;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              WAVES Personal Dashboard
            </Typography>
            <Button color="inherit" component={Link} to="/">Dashboard</Button>
            <Button color="inherit" component={Link} to="/mood-journal">Mood Journal</Button>
            <Button color="inherit" component={Link} to="/kanban">Kanban</Button>
            <Button color="inherit" component={Link} to="/goals">Goals</Button>
            <Button color="inherit" component={Link} to="/data-transparency">Data Transparency</Button>
            <Button color="inherit" component={Link} to="/settings">Settings</Button>
          </Toolbar>
        </AppBar>
        <Container>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/mood-journal" element={<MoodJournalPage />} />
            <Route path="/kanban" element={<KanbanPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/data-transparency" element={<DataTransparency />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;