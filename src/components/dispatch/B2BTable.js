import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";

const columns = [
  { id: "tripId", label: "Trip ID", minWidth: 150 },
  { id: "tripName", label: "Trip Name", minWidth: 150 },
  { id: "shiftTime", label: "Shift Time", minWidth: 150 },
  { id: "vendorName", label: "Vendor Name", minWidth: 150 },
  { id: "vehicleType", label: "Vehicle Type", minWidth: 150 },
  { id: "employeeCount", label: "Employee Count", minWidth: 160 },
  { id: "escortStatus", label: "Escort Status", minWidth: 150 },
];

const StyledCheckbox = styled(Checkbox)({
  "&.Mui-checked": {
    color: "#303232",
  },
});

const StyledTableRow = styled(TableRow)(({ theme, isPaired }) => ({
  backgroundColor: isPaired ? "#d0d0d0" : "inherit", 
  "&:hover": {
    backgroundColor: isPaired ? "#d0d0d0" : theme.palette.action.hover,
  },
}));

const StickyHeadTable = ({ rows, selectedTrips, setSelectedTrips, pairedTrips }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSelectTrip = (tripId) => {
    if (selectedTrips.includes(tripId)) {
      setSelectedTrips([]); 
    } else {
      setSelectedTrips([tripId]); 
    }
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", margin: "10px" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    fontWeight: "bold",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "15px",
                    padding: "8px 16px",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              const isSelected = selectedTrips.includes(row.tripId);
              const isPaired = pairedTrips.includes(row.tripId);
              return (
                <StyledTableRow
                  hover={!isPaired}
                  role="checkbox"
                  tabIndex={-1}
                  key={row.tripId}
                  isPaired={isPaired}
                  onClick={() => handleSelectTrip(row.tripId)}
                >
                  <TableCell padding="checkbox">
                    <StyledCheckbox
                      checked={isSelected || isPaired}
                      onChange={() => handleSelectTrip(row.tripId)}
                    />
                  </TableCell>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          fontSize: "13px",
                          padding: "0 16px",
                          fontFamily: "DM Sans, sans-serif",
                          color: "black",
                        }}
                      >
                        {column.format && typeof value === "number"
                          ? column.format(value)
                          : value}
                        {column.id === "tripId" && isPaired && (
                          <span
                            style={{
                              marginLeft: "10px",
                              backgroundColor: "#66C76C",
                              color: "white",
                              padding: "2px 10px",
                              borderRadius: "10px",
                            }}
                          >
                            Paired
                          </span>
                        )}
                      </TableCell>
                    );
                  })}
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default StickyHeadTable;
