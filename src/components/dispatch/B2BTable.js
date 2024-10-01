import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Radio from "@mui/material/Radio";
import { styled } from "@mui/material/styles";
import LoaderComponent from "../loader";

const columns = [
  { id: "id", label: "ID", minWidth: 100 },
  { id: "routeName", label: "Trip Name", minWidth: 150 },
  { id: "shiftTime", label: "Shift Time", minWidth: 150 },
  { id: "vendorName", label: "Vendor Name", minWidth: 150 },
  { id: "noOfSeats", label: "Vehicle Type", minWidth: 150 },
  { id: "employeeCount", label: "Employee Count", minWidth: 160 },
  { id: "escortStatus", label: "Escort Status", minWidth: 150 },
];

const StyledRadio = styled(Radio)({
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

const StickyHeadTable = (props) => {
  const {
    rows,
    selectedTrips,
    setSelectedTrips,
    pairedTrips,
    setSelectedTripsUI,
    pairedList,
    b2bList,
    type,
    b2bPair,
    autoSelect,
    autoSelectTrip,
    handleSelectRow,
    setSelectedB2bId,
    isLoading,
  } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [flag, setFlag] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSelectTrip = (
    tripId,
    tripIdForUI,
    isPaired,
    isB2bTrip,
    autoFlag,
    b2bId
  ) => {
    console.log(isPaired, isB2bTrip, b2bId);
    if (selectedTrips.includes(tripId)) {
      isPaired ||
        (isB2bTrip && !autoFlag && autoSelect(type, tripId, "unselectedTrips"));
      !isPaired || (!isB2bTrip && handleSelectRow(type, tripId));
      // setSelectedTrips([]);
      // setSelectedTripsUI([]);
    } else {
      isPaired || (isB2bTrip && autoSelect(type, tripId, "selectedTrips"));
      !isPaired && !isB2bTrip && handleSelectRow(type, tripId);
      // setSelectedTrips([tripId]);
      // setSelectedTripsUI([tripIdForUI]);
    }
    if (isPaired || (isB2bTrip && autoFlag)) {
      console.log("autoFlag === true inside");
      autoFlag
        ? autoSelect(type, tripId, "unselectedTrips")
        : autoSelect(type, tripId, "selectedTrips");
    }

    if (b2bId) {
      setSelectedB2bId(b2bId.b2bId);
    } else {
      setSelectedB2bId(null);
    }
  };

  useEffect(() => {
    console.log(autoSelectTrip);
    console.log("Login and logout", selectedTrips);
    if (autoSelectTrip) {
      setFlag(true);
    } else {
      setFlag(false);
    }
  }, [autoSelectTrip]);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", margin: "10px" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell padding="radio"></TableCell>
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
          {isLoading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={columns.length + 1}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100px",
                    }}
                  >
                    <LoaderComponent />
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isSelected = selectedTrips.includes(row.id);
                  const isPaired = pairedTrips.includes(row.id);
                  var index = b2bList.findIndex((item) => item.id === row.id);
                  const isB2bTrip = index !== -1;
                  const autoFlag = flag && autoSelectTrip === row.id;
                  return (
                    <StyledTableRow
                      hover={!isPaired}
                      role="radio"
                      tabIndex={-1}
                      key={row.id}
                      isPaired={isPaired}
                      onClick={() =>
                        handleSelectTrip(
                          row.id,
                          row.tripIdForUI,
                          isPaired,
                          isB2bTrip,
                          autoFlag,
                          b2bList[index]
                        )
                      }
                    >
                      <TableCell padding="radio">
                        <StyledRadio
                          checked={isSelected || autoFlag}
                          onChange={() =>
                            handleSelectTrip(
                              row.id,
                              row.tripIdForUI,
                              isPaired,
                              isB2bTrip,
                              autoFlag,
                              b2bList[index]
                            )
                          }
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
                              : column.id === "id"
                              ? `TRIP-${value}`
                              : value}
                            {column.id === "id" && isPaired && (
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
                            {column.id === "id" && isB2bTrip && (
                              <span
                                style={{
                                  marginLeft: "10px",
                                  backgroundColor: "#66C76C",
                                  color: "white",
                                  padding: "2px 10px",
                                  borderRadius: "10px",
                                }}
                              >
                                {b2bList[index].b2bId}
                              </span>
                            )}
                          </TableCell>
                        );
                      })}
                    </StyledTableRow>
                  );
                })}
            </TableBody>
          )}
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
