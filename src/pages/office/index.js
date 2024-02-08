import React, { useState } from "react";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import CloseIcon from "@mui/icons-material/Close";
import TablePagination from "@mui/material/TablePagination";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/AdminSettings/Sidebar";

const Office = () => {
  const [selectedValues, setSelectedValues] = useState({
    officeId: "",
  });

  const [selectedOffices, setSelectedOffices] = useState([]);

  const handleChange = (event) => {
    setSelectedValues({
      ...selectedValues,
      [event.target.name]: event.target.value,
    });
  };

  const clearSelections = () => {
    setSelectedValues({
      officeId: "",
    });
    setSelectedOffices([]);
  };

  const officeData = [
    {
      officeId: 1,
      name: "Office 1",
      city: "City 1",
      geoCode: "Geo Code 1",
      clientName: "Client 1",
    },
    {
      officeId: 2,
      name: "Office 2",
      city: "City 2",
      geoCode: "Geo Code 2",
      clientName: "Client 2",
    },
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

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, officeData.length - page * rowsPerPage);

  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", marginTop: "8px", marginLeft: "4px" }}>
            <Button
              variant="outlined"
              style={{
                height: "35px",
                fontSize: "12px",
                backgroundColor: "black",
                color: "white",
                marginRight: "8px",
              }}
            >
              View Office
            </Button>
            <Button
              variant="outlined"
              style={{
                height: "35px",
                fontSize: "12px",
                backgroundColor: "black",
                color: "white",
              }}
            >
              Office Mapping
            </Button>
          </div>

          {/* Filters */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "20px",
              marginLeft: "16px",
              marginRight: "16px",
            }}
          >
            {/* Filter icon */}
            <Button
              variant="outlined"
              color="primary"
              style={{
                height: "35px",
                color: "#000",
                marginRight: "10px",
                fontSize: "12px",
              }}
            >
              <TuneOutlinedIcon /> Filter
            </Button>

            {/* Dropdown */}
            <div>
              <FormControl variant="outlined" style={{ marginRight: "10px" }}>
                <InputLabel id="office-id-label" style={{ fontSize: "12px" }}>
                  Office ID
                </InputLabel>
                <Select
                  labelId="office-id-label"
                  style={{ width: "125px", height: "35px", fontSize: "12px" }}
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
            </div>

            {/* Clear selection */}
            {selectedValues.officeId && (
              <Button onClick={clearSelections}>
                <CloseIcon />
              </Button>
            )}
          </div>

          {/* Selected values bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "10px",
              marginLeft: "16px",
              marginRight: "16px",
            }}
          >
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "5px 10px",
                display: "flex",
                alignItems: "center",
                fontSize: "12px",
                backgroundColor: selectedValues.officeId ? "#fff" : "#C6C8C8",
              }}
            >
              {selectedValues.officeId && (
                <span
                  style={{ marginRight: "10px" }}
                >{`Office: ${selectedValues.officeId}`}</span>
              )}
            </div>
          </div>

          <div
            style={{
              marginTop: "20px",
              marginLeft: "16px",
              marginRight: "16px",
            }}
          >
            <h5>Office List</h5>
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                marginTop: "24px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      fontSize: "12px",
                      border: "1px solid #ccc",
                      padding: "5px",
                    }}
                  >
                    Office ID
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      fontSize: "12px",
                      border: "1px solid #ccc",
                      padding: "5px",
                    }}
                  >
                    Office Name
                  </th>
                  <th style={{ textAlign: "left", fontSize: "12px", border: "1px solid #ccc",
                      padding: "5px",  }}>City</th>
                  <th style={{ textAlign: "left", fontSize: "12px",  border: "1px solid #ccc",
                      padding: "5px", }}>
                    Geo Code
                  </th>
                  <th style={{ textAlign: "left", fontSize: "12px" ,  border: "1px solid #ccc",
                      padding: "5px",}}>
                    Client Name
                  </th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "12px" }}>
                {" "}
                {/* Decrease font size for table data */}
                {officeData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((office, index) => (
                    <tr key={index}>
                      <td style={{ textAlign: "left", fontSize: "12px" ,  border: "1px solid #ccc",
                      padding: "5px",}}>{office.officeId}</td>
                      <td style={{ textAlign: "left", fontSize: "12px" ,  border: "1px solid #ccc",
                      padding: "5px",}}>{office.name}</td>
                      <td style={{ textAlign: "left", fontSize: "12px" ,  border: "1px solid #ccc",
                      padding: "5px",}}>{office.city}</td>
                      <td style={{ textAlign: "left", fontSize: "12px" ,  border: "1px solid #ccc",
                      padding: "5px",}}>{office.geoCode}</td>
                      <td style={{ textAlign: "left", fontSize: "12px" ,  border: "1px solid #ccc",
                      padding: "5px",}}>{office.clientName}</td>
                    </tr>
                  ))}
                {emptyRows > 0 && (
                  <tr style={{ height: 35 * emptyRows }}>
                    <td colSpan={5} />
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12px",
              marginLeft: "16px",
              marginRight: "16px",
            }}
          >
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={officeData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <span>{`Show per page: ${rowsPerPage} | ${
              page * rowsPerPage + 1
            } - ${Math.min((page + 1) * rowsPerPage, officeData.length)} of ${
              officeData.length
            }`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Office;
