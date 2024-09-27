import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { allocateVendorData } from "../../sampleData/allocateVendorData";
import { Button, Menu, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Fade from "@mui/material/Fade";
import DispatchService from "@/services/dispatch.service";
import ComplianceService from "@/services/compliance.service";
import { useDispatch, useSelector } from "react-redux";
import { toggleToast } from '@/redux/company.slice';

const AllocateVendor = ({ tripList }) => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [vendorList,setVendorList] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const dispatch = useDispatch();

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Trip ID",
        size: 150,
        Cell: ({ cell }) => {
          return <div>TRIP-{cell.getValue()}</div>;
        },
      },
      {
        accessorKey: "noOfSeats",
        header: "Vehicle Type",
        size: 150,
        Cell: ({ cell }) => {
          return <div>{cell.getValue()}S</div>;
        },
      },
      {
        accessorKey: 'routeName',
        header: "First Pickup/ Last Drop",
        size: 150,
      },
      {
        accessorKey: "bookingIds",
        header: "No. of Employees",
        size: 150,
        Cell: ({ cell }) => {
          var cellValue = cell.getValue();
          var count = cellValue.split(",");
          console.log(count);
          return <div>{count.length}</div>;
        },
      },
      {
        accessorKey: "isEscortRequired",
        header: "Escort Trip",
        size: 150,
        Cell: ({ cell }) => {
          return <div>{cell.getValue() ? "Yes" : "No"}</div>;
        },
      },
      {
        accessorKey: 'special',
        header: "Special",
        size: 150,
      },
      {
        accessorKey: 'actualVendorName',
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

  const handleSelectChange = (vendorName,vendorId) => {
    setSelectedVendor(vendorName);
    setSelectedVendorId(vendorId);
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
      if (selectedRows[item.id]) {
        return {
          ...item,
          actualVendorName: selectedVendor,
        };
      }
      return item;
    });
    console.log("Updated Data:", updatedData);
    setData(updatedData);
    setSelectedVendor('');
    setSelectedVendorId(null);
    setSelectedRows({});
    allocateVendor(selectedRows);
  };

  const allocateVendor = async(selectedRows) =>{
    try{
      const tripIds = [];
      Object.keys(selectedRows).forEach((objKey) => {
        tripIds.push(parseInt(objKey));
      })
      console.log(tripIds);
      const response = await DispatchService.allocateVendor(selectedVendorId,tripIds);
      if(response.status === 201){
        dispatch(toggleToast({ message: 'Vendor added to the trip successfully!', type: 'success' }));
      }
      else{
        dispatch(toggleToast({ message: 'Please try again in after some time.', type: 'error' }));
      }
    }catch(err){
      dispatch(toggleToast({ message: 'Please try again in after some time.', type: 'error' }));
      console.log(err);
    }
  }

  const tableInstance = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    state: {
      rowSelection: selectedRows,
    },
    onRowSelectionChange: handleRowSelection,
    getRowId: row => row.id,
  });

  const getAllVendor = async () => {
    try {
      const response = await ComplianceService.getAllVendorCompany();
      console.log(response.data);
      var list = [];
      response.data.paginatedResponse.content.map((val,index)=>{
        const obj = {
          name : val.name,
          vendorId : val.id
        }
        list.push(obj);
      })
      console.log(list);
      setVendorList(list);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    setData(tripList);
    getAllVendor();

  }, []);

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
              {vendorList.map((item,idx)=>(
                <MenuItem onClick={() => handleSelectChange(item.name,item.vendorId)}>{item.name}</MenuItem>
              ))}
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

          {/* <div>
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
          </div> */}
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
