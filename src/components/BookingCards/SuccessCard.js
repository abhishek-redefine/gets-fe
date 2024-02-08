import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// SuccessCard component
const SuccessCard = ({ onActionClick }) => {
  return (
    <Box style={{ margin: "12px", display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 400, height: "250px",zIndex: "999", position: 'relative'}}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 80, color: 'green' }} />
          </Box>
          <Box sx={{ textAlign: 'center', marginTop: 2 }}>
            <h2>Great!</h2>
            <p>Your booking has been successfully created.</p>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
            <Button variant="contained" onClick={onActionClick}>View Booking</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SuccessCard;
