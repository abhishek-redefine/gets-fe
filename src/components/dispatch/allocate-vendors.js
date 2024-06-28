import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { allocateVendorData } from "../../pages/dispatch/allocateVendorData";
import { Button, Menu, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Fade from "@mui/material/Fade";

const AllocateVendor = () => {
  const [data, setData] = useState(allocateVendorData);
  const [selectedRows, setSelectedRows] = useState({}); 
  const [selectedVendor, setSelectedVendor] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

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

  const handleSelectChange = (vendorName) => {
    setSelectedVendor(vendorName);
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

  const handleAssignVendor = () => {
    console.log("Selected Rows:", selectedRows);  
    const updatedData = data.map(item => {
      if (selectedRows[item.tripId]) {
        return {
          ...item,
          vendorName: selectedVendor,  
        };
      }
      return item;
    });
    console.log("Updated Data:", updatedData);  
    setData(updatedData);  
    setSelectedVendor('');  
    setSelectedRows({});  
  };

  const tableInstance = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    state: {
      rowSelection: selectedRows,
    },
    onRowSelectionChange: handleRowSelection,
    getRowId: row => row.tripId, 
  });

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
          <div style={{ backgroundColor: "white" }}>
            <Button
              id="fade-button"
              aria-controls={Boolean(anchorEl) ? "fade-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl) ? "true" : undefined}
              onClick={handleClick}
              endIcon={<KeyboardArrowDownIcon />}
              style={{
                color: "black",
                border: "2px solid #f6ce47",
                borderRadius: "6px",
                padding: "3px 10px",
                margin: "0 20px 0 0",
                fontWeight: "bold",
                cursor: "pointer",
                textTransform: "unset",
              }}
            >
              {selectedVendor || 'Vendor Name'}
            </Button>
            <Menu
              id="fade-menu"
              MenuListProps={{
                "aria-labelledby": "fade-button",
              }}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              TransitionComponent={Fade}
              style={{
                margin: "6px 0",
                textTransform: "unset",
                fontSize: "14px",
                fontFamily: "DM Sans",
              }}
            >
              <MenuItem onClick={() => handleSelectChange('Sk Travels')}>Sk Travels</MenuItem>
              <MenuItem onClick={() => handleSelectChange('World Travels')}>World Travels</MenuItem>
              <MenuItem onClick={() => handleSelectChange('Bharat Travels')}>Bharat Travels</MenuItem>
            </Menu>
            <button
              onClick={handleAssignVendor}  
              style={{
                backgroundColor: "#f6ce47",
                color: "black",
                border: "2px solid #f6ce47",
                borderRadius: "6px",
                fontWeight: "bold",
                padding: "6px 10px",
                cursor: "pointer",
                marginLeft: "30px",
              }}
            >
              Assign Vendor
            </button>
          </div>

          <div>
            <button
              style={{
                backgroundColor: "#f6ce47",
                color: "black",
                border: "2px solid #f6ce47",
                borderRadius: "6px",
                fontWeight: "bold",
                padding: "6px 10px",
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

export default AllocateVendor;
