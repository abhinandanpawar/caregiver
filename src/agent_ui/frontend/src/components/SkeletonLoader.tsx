import { Skeleton, Box } from '@mui/material';

const SkeletonLoader = () => {
  return (
    <Box>
      <Skeleton variant="text" width="40%" height={40} />
      <Skeleton variant="rectangular" width="100%" height={118} sx={{ my: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={118} />
    </Box>
  );
};

export default SkeletonLoader;