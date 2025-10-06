import { Box, Typography } from '@mui/material';
import FeedbackForms from '../components/FeedbackForms';

const FeedbackPage = () => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Feedback Center
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Your feedback is valuable. Please take a moment to fill out any available forms.
      </Typography>
      <FeedbackForms />
    </Box>
  );
};

export default FeedbackPage;