import React, { useState } from 'react';
import BookingsPage from '../index';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import TablePagination from '@mui/material/TablePagination';

const SearchBooking = () => {
  const [selectedValues, setSelectedValues] = useState({
    officeId: '',
    shiftType: '',
    shiftTime: ''
  });

  const handleChange = (event) => {
    setSelectedValues({
      ...selectedValues,
      [event.target.name]: event.target.value
    });
  };

  const clearSelections = () => {
    setSelectedValues({
      officeId: '',
      shiftType: '',
      shiftTime: ''
    });
  };

  const bookingsData = [
    { bookingId: 1, name: 'John Doe', employeeId: 'E001', gender: 'Male', special: 'Yes', team: 'A' },
    { bookingId: 2, name: 'Jane Doe', employeeId: 'E002', gender: 'Female', special: 'No', team: 'B' },
    { bookingId: 1, name: 'John Doe', employeeId: 'E001', gender: 'Male', special: 'Yes', team: 'A' },
    { bookingId: 2, name: 'Jane Doe', employeeId: 'E002', gender: 'Female', special: 'No', team: 'B' },
    { bookingId: 1, name: 'John Doe', employeeId: 'E001', gender: 'Male', special: 'Yes', team: 'A' },
    { bookingId: 2, name: 'Jane Doe', employeeId: 'E002', gender: 'Female', special: 'No', team: 'B' },
    { bookingId: 1, name: 'John Doe', employeeId: 'E001', gender: 'Male', special: 'Yes', team: 'A' },
    { bookingId: 2, name: 'Jane Doe', employeeId: 'E002', gender: 'Female', special: 'No', team: 'B' },
    { bookingId: 1, name: 'John Doe', employeeId: 'E001', gender: 'Male', special: 'Yes', team: 'A' },
    { bookingId: 2, name: 'Jane Doe', employeeId: 'E002', gender: 'Female', special: 'No', team: 'B' },
    // Add more data as needed
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, bookingsData.length - page * rowsPerPage);

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelection = (event, bookingId) => {
    if (event.target.checked) {
      setSelectedRows([...selectedRows, bookingId]);
    } else {
      setSelectedRows(selectedRows.filter(id => id !== bookingId));
    }
  };

  return (
    <div>
      <BookingsPage />
      
      {/* Filters, Apply, and Search */}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', marginLeft: '16px', marginRight: '16px' }}>
        {/* Filter icon */}
        <Button variant="outlined" color="primary" style={{ height: "35px", color: "#000", marginRight: '10px', fontSize:"12px"}}>
          <TuneOutlinedIcon /> Filter
        </Button>

        {/* Dropdowns */}
        <div style={{ display: 'flex' }}>
          <FormControl variant="outlined" style={{ marginRight: '10px' }}>
            <InputLabel id="office-id-label" style={{ fontSize: '12px' }}>Office ID</InputLabel>
            <Select 
              labelId="office-id-label" 
              style={{ width: '125px', height: "35px", fontSize:"12px" }} 
              label="Office ID" 
              value={selectedValues.officeId}
              onChange={handleChange}
              name="officeId"
            >
              <MenuItem value="">Select Office ID</MenuItem>
              <MenuItem value={1}>Office 1</MenuItem>
              <MenuItem value={2}>Office 2</MenuItem>
              {/* Add more dropdown options as needed */}
            </Select>
          </FormControl>

          {/* Datepicker */}
          <FormControl variant="outlined" style={{ marginRight: '10px' }}>
            <InputLabel id="shift-type-label" style={{ fontSize: '12px' }}>Shift Type</InputLabel>
            <Select 
              labelId="shift-type-label" 
              style={{ width: '125px', height: "35px", fontSize:"12px" }} 
              label="Shift Type" 
              value={selectedValues.shiftType}
              onChange={handleChange}
              name="shiftType"
            >
              <MenuItem value="">Select Shift Type</MenuItem>
              <MenuItem value={1}>Shift Type 1</MenuItem>
              <MenuItem value={2}>Shift Type 2</MenuItem>
              {/* Add more dropdown options as needed */}
            </Select>
          </FormControl>

          <FormControl variant="outlined">
            <InputLabel id="shift-time-label" style={{ fontSize: '12px' }}>Shift Time</InputLabel>
            <Select 
              labelId="shift-time-label" 
              style={{ width: '125px', height: "35px", fontSize:"12px "}} 
              label="Shift Time" 
              value={selectedValues.shiftTime}
              onChange={handleChange}
              name="shiftTime"
            >
              <MenuItem value="">Select Shift Time</MenuItem>
              <MenuItem value={1}>Shift Time 1</MenuItem>
              <MenuItem value={2}>Shift Time 2</MenuItem>
              {/* Add more dropdown options as needed */}
            </Select>
          </FormControl>
        </div>

        {/* Apply button */}
        <Button variant="contained" color="primary" style={{ height: "35px", fontSize:"12px", backgroundColor: "#F6CE47", color: "#161616", marginRight: '10px', marginLeft: "4px" }}>
          Apply
        </Button>

        {/* Search input and button */}
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', marginRight: '10px' }}>
          <input type="text" placeholder="Search..." style={{ height: "35px",fontSize: '12px', marginRight: '10px', paddingLeft: '10px', marginBottom: '0' }} />
          <Button variant="contained" color="primary" style={{ height: "35px", backgroundColor: "#F6CE47", color: "#161616", fontSize:"12px "}}>
            Search
          </Button>
        </div>
      </div>

      {/* Selected values bar */}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', marginLeft: '16px', marginRight: '16px' }}>
        <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '5px 10px', display: 'flex', alignItems: 'center', fontSize:"12px", backgroundColor: selectedValues.officeId || selectedValues.shiftType || selectedValues.shiftTime ? '#fff' : '#C6C8C8' }}>
          {selectedValues.officeId && <span style={{ marginRight: '10px' }}>{`Office: ${selectedValues.officeId}`}</span>}
          {selectedValues.shiftType && <span style={{ marginRight: '10px' }}>{`Shift Type: ${selectedValues.shiftType}`}</span>}
          {selectedValues.shiftTime && <span style={{ marginRight: '10px' }}>{`Shift Time: ${selectedValues.shiftTime}`}</span>}
          {selectedValues.officeId || selectedValues.shiftType || selectedValues.shiftTime ? <Button onClick={clearSelections}><CloseIcon /></Button> : null}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '16px', marginTop: '10px', fontSize: '12px' }}>
        <Button variant="outlined" color="primary" style={{ marginRight: '1px', color: "#000",  fontSize:"12px"}}>
          Actions
        </Button>
        <Button variant="outlined" color="primary" style={{ marginRight: '1px', color:"#000", fontSize:"12px" }}>
          Edit Bookings
        </Button>
        <Button variant="outlined" color="primary" style={{ marginRight: '1px' ,color:"#000",  fontSize:"12px" }}>
          Cancel Bookings
        </Button>
        <Button variant="outlined" color="primary" style={{color:"#000" , fontSize: "12px"}}>
          Booking Change Logs
        </Button>
      </div>

      {/* Bookings table */}

      {/* Bookings table */}
      <div style={{ marginTop: '20px', marginLeft: '16px', marginRight: '16px', fontSize: "12px" }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '5px', textAlign: 'left', width: "4px" }}></th>
              <th style={{ border: '1px solid #ccc', padding: '5px', textAlign: 'left' }}>Booking Id</th>
              <th style={{ border: '1px solid #ccc', padding: '5px', textAlign: 'left' }}>Name</th>
              <th style={{ border: '1px solid #ccc', padding: '5px', textAlign: 'left' }}>Employee ID</th>
              <th style={{ border: '1px solid #ccc', padding: '5px', textAlign: 'left' }}>Gender</th>
              <th style={{ border: '1px solid #ccc', padding: '5px', textAlign: 'left' }}>Special</th>
              <th style={{ border: '1px solid #ccc', padding: '5px', textAlign: 'left' }}>Team</th>
            </tr>
          </thead>
          <tbody>
            {bookingsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((booking, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ccc', padding: '5px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(booking.bookingId)}
                    onChange={(event) => handleRowSelection(event, booking.bookingId)}
                  />
                </td>
                <td style={{ border: '1px solid #ccc', padding: '5px' }}>{booking.bookingId}</td>
                <td style={{ border: '1px solid #ccc', padding: '5px' }}>{booking.name}</td>
                <td style={{ border: '1px solid #ccc', padding: '5px' }}>{booking.employeeId}</td>
                <td style={{ border: '1px solid #ccc', padding: '5px' }}>{booking.gender}</td>
                <td style={{ border: '1px solid #ccc', padding: '5px' }}>{booking.special}</td>
                <td style={{ border: '1px solid #ccc', padding: '5px' }}>{booking.team}</td>
              </tr>
            ))}
            {emptyRows > 0 && (
              <tr style={{ height: 35 * emptyRows }}>
                <td colSpan={7} />
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {/* Pagination */}
      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: "12px", marginLeft: '16px', marginRight: '16px' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={bookingsData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          
        />
        <span>{`Show per page: ${rowsPerPage} | ${page * rowsPerPage + 1} - ${Math.min((page + 1) * rowsPerPage, bookingsData.length)} of ${bookingsData.length}`}</span>
      </div>
    </div>
  );
};

export default SearchBooking;
