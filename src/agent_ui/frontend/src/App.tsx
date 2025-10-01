import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';

import KanbanPage from './pages/KanbanPage';
import GoalsPage from './pages/GoalsPage';

// Placeholder components for the remaining pages
const Dashboard = () => <Typography variant="h4" sx={{ mt: 4 }}>Dashboard</Typography>;
const DataTransparency = () => <Typography variant="h4" sx={{ mt: 4 }}>Data Transparency</Typography>;
const Settings = () => <Typography variant="h4" sx={{ mt: 4 }}>Settings</Typography>;

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            WAVES Personal Dashboard
          </Typography>
          <Button color="inherit" component={Link} to="/">Dashboard</Button>
          <Button color="inherit" component={Link} to="/kanban">Kanban</Button>
          <Button color="inherit" component={Link} to="/goals">Goals</Button>
          <Button color="inherit" component={Link} to="/data-transparency">Data Transparency</Button>
          <Button color="inherit" component={Link} to="/settings">Settings</Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/kanban" element={<KanbanPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/data-transparency" element={<DataTransparency />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;