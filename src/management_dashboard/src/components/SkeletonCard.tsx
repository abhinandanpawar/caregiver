import { Card, CardContent, Skeleton } from '@mui/material';

const SkeletonCard = () => {
  return (
    <Card>
      <CardContent>
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={80} />
      </CardContent>
    </Card>
  );
};

export default SkeletonCard;