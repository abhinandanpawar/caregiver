import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  CardContent,
} from '@mui/material';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/v1/dashboard/departments')
      .then((res) => res.json())
      .then((data) => setDepartments(data))
      .catch(() => setError('Could not load department data.'));
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Wellness by Department
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        {!error && departments.length === 0 && (
          <Typography>Loading departments...</Typography>
        )}
        {!error && departments.length > 0 && (
          <List>
            {departments.map((dept) => (
              <ListItem key={dept.name}>
                <ListItemText primary={dept.name} />
                <Typography variant="body1">{dept.score}</Typography>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default DepartmentList;