import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { TextField } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import DispatchService from "@/services/dispatch.service";
import { toggleToast } from '@/redux/company.slice';
import { useDispatch, useSelector } from "react-redux";
import LoaderComponent from "../loader";

const AllocateCab = ({ tripList, allocationComplete, setTripList, isLoading }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [selectedVehicle, setSelectedVehicle] = useState()
  const [searchedVehicleNumbers, setSearchedVehicleNumbers] = useState([]);
  const [vendor, setVendor] = useState("");
  const [searchedVehicle, setSearchedvehicle] = useState([]);

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
        size: 200,
      },
      // {
      //   accessorKey: "zone",
      //   header: "Zone",
      //   size: 150,
      // },
      {
        accessorKey: "bookingIds",
        header: "No. of Employees",
        size: 150,
        Cell: ({ cell }) => {
          var cellValue = cell.getValue();
          var count = cellValue.split(",");
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
        accessorKey: "special",
        header: "Special",
        size: 150,
      },
      {
        accessorKey: "actualVendorName",
        header: "Vendor Name",
        size: 150,
      },
      {
        accessorKey: "vehicleNumber",
        header: "Vehicle Number",
        size: 150,
        Cell: ({ value, row }) => {
          return (
            <>
              <VehicleNumberCell
                value={value}
                rowData={row}
                onClick={(row) => row.actualVendorName}
                onChange={(newValue) => {
                  row.setValue("vehicleNumber", newValue);
                }}
              // options={setSearchedvehicle}
              />
            </>
          )
        },
      },
      {
        accessorKey: "driverName",
        header: "Driver Name",
        size: 150,
      },
    ],
    []
  );

  const handleRowSelection = (rowSelection) => {
    setSelectedRows(rowSelection);
  };

  const tableInstance = useMaterialReactTable({
    columns,
    data: data,
    state: { isLoading },
    muiCircularProgressProps: {
      Component: <LoaderComponent />
    },
  });

  const VehicleNumberCell = ({ value, onChange, options, rowData }) => {
    const [localSearchedVehicle, setLocalSearchedVehicle] = useState([]);
    const [openSearchVN, setOpenSearchVN] = useState(false);
    const getAutoSuggestVehicle = async (event) => {
      try {
        const text = event.target.value;
        if (text) {
          // console.log(rowData.original);
          setSelectedRows(rowData.original.id);
          const vendorName = rowData.original.actualVendorName;
          // console.log(vendorName);
          const response = await DispatchService.autoSuggestVehicleByVendor(
            vendorName,
            text
          );
          // console.log(response.data);
          const { data } = response || {};
          setSearchedvehicle(data);
          setLocalSearchedVehicle(data);
        } else {
          setSearchedvehicle([]);
          setLocalSearchedVehicle([]);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const VehicleChangeHandler = (event, value) => {
      console.log("tripId>>>>>>>>>>>>", rowData.original.id, "vehicleId")
      // console.log(value?.vehicleId);
      setSelectedVehicle(value?.vehicleNumber);
      if (value?.vehicleId) {
        handleAssignVehicle(rowData.original.id, value?.vehicleId, value?.vehicleRegistrationNumber);
      }
      setOpenSearchVN(false);
      setLocalSearchedVehicle([]);
    }

    return (<Autocomplete
      id="search-vehicle-number-cell"
      options={localSearchedVehicle}
      autoComplete
      open={openSearchVN}
      onOpen={() => {
        setOpenSearchVN(true);
      }}
      onClose={() => {
        setOpenSearchVN(false);
      }}
      getOptionKey={(vehicle) => vehicle.vehicleId}
      getOptionLabel={(vehicle) => vehicle.vehicleRegistrationNumber}
      freeSolo
      onChange={(e, value) => VehicleChangeHandler(e, value)}
      renderInput={(params) => (
        <TextField
          {...params}
          onChange={getAutoSuggestVehicle}
          InputProps={{
            ...params.InputProps,
            sx: { fontSize: "15px", fontFamily: "DM Sans" },
          }}
          InputLabelProps={{
            sx: { fontSize: "15px", fontFamily: "DM Sans" },
          }}
        />
      )}
    />)
  };

  const handleAssignVehicle = async (tripId, vehicleId, vehicleNumber) => {
    try {
      console.log("Data before updating >>>>>>>", tripList);
      const response = await DispatchService.allocateVehicle(tripId, vehicleId);
      console.log(response.data);
      const responseStr = response.data;
      const driverStr = responseStr.split(' ');
      const index = driverStr.indexOf("is");
      console.log(driverStr);
      let result = '';
      if (index > 0) {
        for (var i = 0; i < index; i++) {
          result += driverStr[i] + " ";
        }
      }

      if (vehicleNumber && result !== "") {
        setTripList(prevTripList => {
          if (Array.isArray(prevTripList)) {
            const updatedData = prevTripList.map(item => {
              if (tripId === item.id) {
                return {
                  ...item,
                  vehicleNumber: vehicleNumber,
                  driverName: result
                };
              }
              return item;
            });

            console.log("Updated Data:", updatedData);

            // Update state
            if (updatedData) {
              dispatch(
                toggleToast({
                  message: "Cab allocated to the trip successfully!",
                  type: "success",
                })
              );
            }
            return updatedData;
          } else {
            console.error("Invalid data or missing values.");
            return prevTripList;
          }
        });
      }

      setSearchedvehicle([]);
      setSelectedRows({});
    } catch (err) {
      dispatch(toggleToast({ message: 'Please try again after some time.', type: 'error' }));
      console.log(err);
    }
  };

  useEffect(() => {
    setData(tripList);
  }, [tripList]);


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
          <div>
            <button
              onClick={() => allocationComplete()}
              style={{
                backgroundColor: "#f6ce47",
                color: "black",
                border: "2px solid #f6ce47",
                borderRadius: "6px",
                fontSize: "15px",
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
