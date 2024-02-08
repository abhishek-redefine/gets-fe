import React, { useState } from 'react';
import { Card, CardContent, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination, Typography, Grid, Radio } from '@mui/material';
import Button from '@mui/material/Button';

const TeamDetails = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  // Dummy data
  const teamsData = [
    { id: 1, name: "Team 1", strengths: "Strength 1", manager: "Manager 1" },
    { id: 2, name: "Team 2", strengths: "Strength 2", manager: "Manager 2" },
    { id: 3, name: "Team 3", strengths: "Strength 3", manager: "Manager 3" },
    { id: 4, name: "Team 4", strengths: "Strength 4", manager: "Manager 4" },
    { id: 5, name: "Team 5", strengths: "Strength 5", manager: "Manager 5" },
    { id: 6, name: "Team 6", strengths: "Strength 6", manager: "Manager 6" },
    { id: 7, name: "Team 7", strengths: "Strength 7", manager: "Manager 7" },
    { id: 8, name: "Team 8", strengths: "Strength 8", manager: "Manager 8" },
    { id: 9, name: "Team 9", strengths: "Strength 9", manager: "Manager 9" },
    { id: 10, name: "Team 10", strengths: "Strength 10", manager: "Manager 10" },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRadioChange = (event, teamId) => {
    setSelectedTeamId(teamId);
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Team Details</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Team Name</TableCell>
                <TableCell>Strengths</TableCell>
                <TableCell>Manager</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? teamsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : teamsData
              ).map((team, index) => (
                <TableRow key={team.id}>
                  <TableCell>
                    <Radio 
                      color="primary" 
                      size="small" 
                      checked={selectedTeamId === team.id} 
                      onChange={(event) => handleRadioChange(event, team.id)} 
                    />
                  </TableCell>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>{team.strengths}</TableCell>
                  <TableCell>{team.manager}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container justifyContent="space-between" alignItems="center" mt={2}>
          <Grid item>
            <Typography variant="caption">{`Page ${page + 1} of ${Math.ceil(teamsData.length / rowsPerPage)}`}</Typography>
          </Grid>
          <Grid item>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={teamsData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" >
              Next
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TeamDetails;
