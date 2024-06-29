import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { allocateVendorData } from "../../pages/dispatch/allocateVendorData";
import { TextField } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';



const AllocateCab = () => {
  const [data, setData] = useState(allocateVendorData);
  const [selectedRows, setSelectedRows] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [searchedVehicleNumbers, setSearchedVehicleNumbers] = useState([]);
  const [openSearchVN, setOpenSearchVN] = useState(false);

  const sampleVehicleNumbers = [
    { vehicleNumber: "MH12AB1234" },
    { vehicleNumber: "MH12CD5678" },
    { vehicleNumber: "MH12EF9012" },
    { vehicleNumber: "MH12GH3456" },
    { vehicleNumber: "MH12IJ7890" }
  ];


  const columns = useMemo(
    () => [
      {
        accessorKey: 'tripId',
        header: "Trip ID",
        size: 150,
      },
      {
        accessorKey: 'backToBack',
        header: "BackToBack",
        size: 150,
      },
      {
        accessorKey: 'vehicleType',
        header: "Vehicle Type",
        size: 200,
      },
      {
        accessorKey: 'firstPickup/lastDrop',
        header: "First Pickup/ Last Drop",
        size: 150,
      },
      {
        accessorKey: 'zone',
        header: "Zone",
        size: 150,
      },
      {
        accessorKey: 'noOfEmployees',
        header: "No. of Employees",
        size: 150,
      },
      {
        accessorKey: 'escortStatus',
        header: "Escort Trip",
        size: 150,
      },
      {
        accessorKey: 'special',
        header: "Special",
        size: 150,
      },
      {
        accessorKey: 'vendorName',
        header: "Vendor Name",
        size: 150,
      },
      {
        accessorKey: 'vehicleNumber',
        header: "Vehicle Number",
        size: 150,
      },
      {
        accessorKey: 'driverName',
        header: "Driver Name",
        size: 150,
      },
    ],
    []
  );

  const handleSelectChange = (vehicleNumber) => {
    setSelectedVehicle(vehicleNumber);
    handleClose();
  };

  const handleRowSelection = (rowSelection) => {
    setSelectedRows(rowSelection);
  };
  

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAssignVehicle = () => {
    console.log("Selected Rows:", selectedRows);
    const updatedData = data.map(item => {
      if (selectedRows[item.tripId]) {
        return {
          ...item,
          vehicleNumber: selectedVehicle,
        };
      }
      return item;
    });
    console.log("Updated Data:", updatedData);
    setData(updatedData);
    setSelectedVehicle('');
    setSelectedRows({});
    // setSearchedVehicleNumbers([]);
  };

  const tableInstance = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    enableSelectAll: false,
    enableMultiRowSelection: false,
    state: {
      rowSelection: selectedRows,
    },
    onRowSelectionChange: handleRowSelection,
    getRowId: row => row.tripId,
  });

  const searchForVehicleNumbers = (event) => {
    const value = event.target.value.toLowerCase();
    const filteredVehicleNumbers = sampleVehicleNumbers.filter(vn =>
      vn.vehicleNumber.toLowerCase().includes(value)
    );
    setSearchedVehicleNumbers(filteredVehicleNumbers);
  };

  return (
    <div>
      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: "16px 20px",
          borderRadius: "10px",
          margin: "20px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "white",
            padding: "16px 20px",
            borderRadius: "10px",
            width: "100%",
          }}
        >
          <div style={{ backgroundColor: "white", display: 'flex' }}>
            <Autocomplete
              disablePortal
              id="search-vehicle-number"
              options={searchedVehicleNumbers}
              autoComplete
              open={openSearchVN}
              onOpen={() => {
                setOpenSearchVN(true);
              }}
              onClose={() => {
                setOpenSearchVN(false);
              }}
              defaultValue={{ vehicleNumber: ""}}
              onChange={(e, val) => handleSelectChange(val ? val.vehicleNumber : "")}
              getOptionKey={(vn) => vn.vehicleNumber}
              getOptionLabel={(vn) => `${vn.vehicleNumber}`}
              freeSolo
              name="vehicleNumber"
              sx={{
                "& .MuiOutlinedInput-root": {
                  paddingBottom: "5px", width: '220px',
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Vehicle Number"
                  onChange={searchForVehicleNumbers}
                  InputProps={{
                    ...params.InputProps,
                    sx: { fontSize: "15px", fontFamily: 'DM Sans' } 
                  }}
                  InputLabelProps={{
                    sx: { fontSize: "15px", fontFamily: 'DM Sans',}
                  }}
                />
              )}
            />
            <button
              onClick={handleAssignVehicle}
              style={{
                backgroundColor: "#f6ce47",
                color: "black",
                border: "2px solid #f6ce47",
                borderRadius: "6px",
                fontSize: '15px',
                fontWeight: "bold",
                padding: "6px 10px",
                cursor: "pointer",
                marginLeft: "30px",
              }}
            >
              Assign Vehicle
            </button>
          </div>

          <div>
            <button
              style={{
                backgroundColor: "#f6ce47",
                color: "black",
                border: "2px solid #f6ce47",
                borderRadius: "6px",
                fontSize: '15px',
                fontWeight: "bold",
                padding: "13px 10px",
                cursor: "pointer",
              }}
            >
              Allocation Complete
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          margin: "30px 0 0",
          backgroundColor: "#f9f9f9",
          padding: "16px 20px",
          borderRadius: "10px",
        }}
      >
        <MaterialReactTable table={tableInstance} />
      </div>
    </div>
  );
};

export default AllocateCab;

