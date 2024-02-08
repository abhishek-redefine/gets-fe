import React from 'react';
import { Card, CardContent, Button, Typography, Grid } from '@mui/material';

const UserDetails = ({ userSummary, scheduleSummary }) => {
  // Dummy data if props are not provided
  const dummyUserSummary = {
    name: "John Doe",
    phoneNumber: "123-456-7890",
    transportAddress: "123 Main St, City, Country",
    reportingManager: "Jane Smith",
    managerNumber: "987-654-3210",
    teamName: "Development Team",
    projectCode: "PROJ123",
  };

  const dummyScheduleSummary = {
    loginTime: "9:00 AM",
    logoutTime: "5:00 PM",
    adhoc: "Yes",
  };

  // If props are not provided, use dummy data
  userSummary = userSummary || dummyUserSummary;
  scheduleSummary = scheduleSummary || dummyScheduleSummary;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={8}>
        <Card style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>User Summary</Typography>
            <Typography variant="body1"><strong>Name:</strong> {userSummary.name}</Typography>
            <Typography variant="body1"><strong>Phone Number:</strong> {userSummary.phoneNumber}</Typography>
            <Typography variant="body1"><strong>Transport Address:</strong> {userSummary.transportAddress}</Typography>
            <Typography variant="body1"><strong>Reporting Manager:</strong> {userSummary.reportingManager}</Typography>
            <Typography variant="body1"><strong>Team Name:</strong> {userSummary.teamName}</Typography>
            <Typography variant="body1"><strong>Project Code:</strong> {userSummary.projectCode}</Typography>
          </CardContent>
          <Button variant="contained" color="primary" style={{ marginTop: 'auto', alignSelf: 'flex-end', marginRight: '16px', marginBottom: '16px' }}>View Profile</Button>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Schedule Summary</Typography>
            <Typography variant="body1"><strong>Login Time:</strong> {scheduleSummary.loginTime}</Typography>
            <Typography variant="body1"><strong>Logout Time:</strong> {scheduleSummary.logoutTime}</Typography>
            <Typography variant="body1"><strong>Adhoc:</strong> {scheduleSummary.adhoc}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} style={{ textAlign: 'right' }}>
        <Button variant="outlined" color="primary" style={{ marginRight: '10px' }}>Back</Button>
        <Button variant="contained" color="primary" style={{ marginRight: '25px'}}>Next</Button>
      </Grid>
    </Grid>
  );
};

export default UserDetails;
