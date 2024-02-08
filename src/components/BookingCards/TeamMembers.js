import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Card,
  CardContent,
} from '@material-ui/core';

const useStyles = makeStyles({
  tableContainer: {
    maxWidth: 600,
    margin: 'auto',
  },
  card: {
    marginTop: 20,
    maxWidth: 300,
    float: 'right',
  },
  buttonContainer: {
    textAlign: 'right',
    marginTop: 20,
  },
});

const TeamMembersComponent = () => {
  const classes = useStyles();
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Dummy data
  const dummyData = [
    { id: 1, name: 'John Doe', employeeId: 'E1234', gender: 'Male', team: 'Engineering', useMaterialUICard: true, format: 'Full-time' },
    { id: 2, name: 'Jane Smith', employeeId: 'E5678', gender: 'Female', team: 'Marketing', useMaterialUICard: false, format: 'Part-time' },
    { id: 3, name: 'Alex Johnson', employeeId: 'E91011', gender: 'Male', team: 'Design', useMaterialUICard: true, format: 'Full-time' },
    { id: 4, name: 'Emily Brown', employeeId: 'E121314', gender: 'Female', team: 'Product Management', useMaterialUICard: false, format: 'Contractor' },
  ];

  const handleSelectMember = (memberId) => {
    const selectedIndex = selectedMembers.indexOf(memberId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedMembers, memberId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedMembers.slice(1));
    } else if (selectedIndex === selectedMembers.length - 1) {
      newSelected = newSelected.concat(selectedMembers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedMembers.slice(0, selectedIndex),
        selectedMembers.slice(selectedIndex + 1)
      );
    }

    setSelectedMembers(newSelected);
  };

  const isSelected = (memberId) => selectedMembers.indexOf(memberId) !== -1;

  return (
    <div>
      <TableContainer className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Checkbox</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Employee Id</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Use Material UI Card</TableCell>
              <TableCell>Format</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyData.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>
                  <Checkbox
                    checked={isSelected(row.id)}
                    onChange={() => handleSelectMember(row.id)}
                  />
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.employeeId}</TableCell>
                <TableCell>{row.gender}</TableCell>
                <TableCell>{row.team}</TableCell>
                <TableCell>{row.useMaterialUICard ? 'Yes' : 'No'}</TableCell>
                <TableCell>{row.format}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Card className={classes.card}>
        <CardContent>
          <div className={classes.buttonContainer}>
            <Button variant="contained" color="primary">
              Back
            </Button>
            <Button variant="contained" color="primary" style={{ marginLeft: '10px' }}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamMembersComponent;
