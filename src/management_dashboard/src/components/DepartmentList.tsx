import { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  CardContent,
  Alert,
  Skeleton,
  Box,
} from '@mui/material';

interface Department {
  name: string;
  score: number;
  headcount: number;
}

const DepartmentList = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8001/api/v1/dashboard/departments');
        if (!response.ok) {
          throw new Error('Failed to fetch department data');
        }
        const data = await response.json();
        setDepartments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Wellness by Department
        </Typography>
        {loading && (
          <Box>
            <Skeleton variant="text" height={48} />
            <Skeleton variant="text" height={48} />
            <Skeleton variant="text" height={48} />
            <Skeleton variant="text" height={48} />
          </Box>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && (
          <List>
            {departments.map((dept) => (
              <ListItem key={dept.name} secondaryAction={<Typography variant="body1">{dept.score}</Typography>}>
                <ListItemText primary={dept.name} secondary={`Headcount: ${dept.headcount}`} />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default DepartmentList;