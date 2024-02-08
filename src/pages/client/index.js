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
import AddHoliday from "@/components/AdminSettings/AddHoliday";


const Client = () => {
  const [selectedValues, setSelectedValues] = useState({
    officeId: "",
  });

  const [selectedClients, setSelectedClients] = useState([]);

  const [showAddHoliday, setShowAddHoliday] = useState(false);

  const handleChange = (event) => {
    setSelectedValues({
      ...selectedValues,
      [event.target.name]: event.target.value,
    });
  };

  const toggleClientSelection = (clientId) => {
    const isSelected = selectedClients.includes(clientId);
    if (isSelected) {
      setSelectedClients(selectedClients.filter((id) => id !== clientId));
    } else {
      setSelectedClients([...selectedClients, clientId]);
    }
  };

  const clearSelections = () => {
    setSelectedValues({
      officeId: "",
    });
    setSelectedClients([]);
  };

  const clientData = [
    {
      clientId: 1,
      name: "Client 1",
      officeId: "Office 1",
      location: "Location 1",
    },
    {
      clientId: 2,
      name: "Client 2",
      officeId: "Office 2",
      location: "Location 2",
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
    rowsPerPage - Math.min(rowsPerPage, clientData.length - page * rowsPerPage);

  return (
    <div>
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar />

        <div style={{ flex: 1 }}>
          <Button
            variant="outlined"
            color="primary"
            style={{
              height: "35px",
              color: "#fff",
              backgroundColor: "black",
              fontSize: "12px",
              marginTop: "8px",
              marginLeft: "4px",
            }}
           
          >
            Holiday
          </Button>
          {showAddHoliday && <AddHoliday />}
          
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

          {/* Clients table */}
          <div
            style={{
              marginTop: "20px",
              marginLeft: "16px",
              marginRight: "16px",
              fontSize: "12px",
              position: "relative",
            }}
          >
            {/* Buttons */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                marginBottom: "12px",
                display: "flex",
                gap: "10px",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                style={{
                  fontSize: "12px",
                  backgroundColor: "#F6CE47",
                  color: "#000",
                }}
                // onClick={() => setShowAddHoliday(true)
                // }
              >
                Add Holiday
              </Button>
              <Button
                variant="outlined"
                color="primary"
                style={{ fontSize: "12px", color: "#000" }}
              >
                Remove Holiday
              </Button>
            </div>

            <h3>Holiday List</h3>
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
                      border: "1px solid #ccc",
                      padding: "5px",
                      textAlign: "left",
                    }}
                  >
                    {/* Checkbox for selecting all clients */}
                    <input
                      type="checkbox"
                      checked={
                        selectedClients.length === clientData.length &&
                        clientData.length !== 0
                      }
                      onChange={() => {
                        if (selectedClients.length === clientData.length) {
                          setSelectedClients([]);
                        } else {
                          setSelectedClients(
                            clientData.map((client) => client.clientId)
                          );
                        }
                      }}
                    />
                  </th>
                  <th
                    style={{
                      border: "1px solid #ccc",
                      padding: "5px",
                      textAlign: "left",
                    }}
                  >
                    Client Id
                  </th>
                  <th
                    style={{
                      border: "1px solid #ccc",
                      padding: "5px",
                      textAlign: "left",
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      border: "1px solid #ccc",
                      padding: "5px",
                      textAlign: "left",
                    }}
                  >
                    Office ID
                  </th>
                  <th
                    style={{
                      border: "1px solid #ccc",
                      padding: "5px",
                      textAlign: "left",
                    }}
                  >
                    Location
                  </th>
                </tr>
              </thead>
              <tbody>
                {clientData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((client, index) => (
                    <tr key={index}>
                      <td style={{ border: "1px solid #ccc", padding: "5px" }}>
                        <input
                          type="checkbox"
                          checked={selectedClients.includes(client.clientId)}
                          onChange={() =>
                            toggleClientSelection(client.clientId)
                          }
                        />
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "5px" }}>
                        {client.clientId}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "5px" }}>
                        {client.name}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "5px" }}>
                        {client.officeId}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "5px" }}>
                        {client.location}
                      </td>
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

          {/* Pagination */}
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
              count={clientData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <span>{`Show per page: ${rowsPerPage} | ${
              page * rowsPerPage + 1
            } - ${Math.min((page + 1) * rowsPerPage, clientData.length)} of ${
              clientData.length
            }`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Client;

