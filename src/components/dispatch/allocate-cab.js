// import React, { useEffect, useMemo, useState } from "react";
// import {
//   MaterialReactTable,
//   useMaterialReactTable,
// } from "material-react-table";
// import { TextField } from "@mui/material";
// import Autocomplete from '@mui/material/Autocomplete';
// import DispatchService from "@/services/dispatch.service";
// import { toggleToast } from '@/redux/company.slice';
// import { useDispatch, useSelector } from "react-redux";

// const AllocateCab = ({ tripList,allocationComplete }) => {
//   const dispatch = useDispatch();
//   const [data, setData] = useState(tripList);
//   const [selectedRows, setSelectedRows] = useState({});
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedVehicle, setSelectedVehicle] = useState('');
//   const [openSearchVN, setOpenSearchVN] = useState(false);
//   const [vendor, setVendor] = useState("");
//   const [searchedVehicle, setSearchedvehicle] = useState([]);
//   const [vehicleId, setVehicleId] = useState();
//   const [tripId, setTripId] = useState();

//   const sampleVehicleNumbers = [
//     { vehicleNumber: 'MH12AB1234' },
//     { vehicleNumber: 'MH12CD5678' },
//     { vehicleNumber: 'MH12EF9012' },
//     { vehicleNumber: 'MH12GH3456' },
//     { vehicleNumber: 'MH12IJ7890' },
//   ];

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: 'id',
//         header: "ID",
//         size: 150,
//       },
//       {
//         accessorKey: 'tripIdForUI',
//         header: "Trip ID",
//         size: 150,
//       },
//       {
//         accessorKey: 'backToBack',
//         header: 'BackToBack',
//         size: 150,
//       },
//       {
//         accessorKey: 'noOfSeats',
//         header: "Vehicle Type",
//         size: 200,
//       },
//       {
//         accessorKey: 'routeName',
//         header: "First Pickup/ Last Drop",
//         size: 150,
//       },
//       {
//         accessorKey: 'zone',
//         header: 'Zone',
//         size: 150,
//       },
//       {
//         accessorKey: 'noOfEmployees',
//         header: 'No. of Employees',
//         size: 150,
//       },
//       {
//         accessorKey: 'escortStatus',
//         header: 'Escort Trip',
//         size: 150,
//       },
//       {
//         accessorKey: 'special',
//         header: 'Special',
//         size: 150,
//       },
//       {
//         accessorKey: 'vendorName',
//         header: 'Vendor Name',
//         size: 150,
//       },
//       {
//         accessorKey: 'vehicleNumber',
//         header: 'Vehicle Number',
//         size: 150,
//         Cell: ({ value, row }) => (
//           <VehicleNumberCell
//             value={value}
//             onChange={(newValue) => {
//               row.setValue('vehicleNumber', newValue);
//             }}
//             options={sampleVehicleNumbers}
//           />
//         ),
//       },
//       {
//         accessorKey: 'driverName',
//         header: 'Driver Name',
//         size: 150,
//       },
//     ],
//     []
//   );

//   const getAutoSuggestVehicle = async (event) => {
//     try {
//       const text = event.target.value;
//       if (text) {
//         console.log(tableInstance.getRow(parseInt(Object.keys(selectedRows)[0])).original.vendorName);
//         const vendorName = tableInstance.getRow(parseInt(Object.keys(selectedRows)[0])).original.vendorName;
//         const response = await DispatchService.autoSuggestVehicleByVendor(vendorName, text);
//         console.log(response);
//         const { data } = response || {};
//         setSearchedvehicle(data);
//       }
//       else {
//         setSearchedvehicle([]);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   const handleSelectChange = (vehicleNumber) => {
//     setSelectedVehicle(vehicleNumber);
//     handleClose();
//   };

//   const handleRowSelection = (rowSelection) => {
//     setSelectedRows(rowSelection);
//   };

//   useEffect(() => {
//     console.log(parseInt(Object.keys(selectedRows)[0]));
//     selectedRows && setTripId(parseInt(Object.keys(selectedRows)[0]));
//   }, [selectedRows]);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleAssignVehicle = async () => {
//     console.log("Selected Rows:", selectedRows);
//     try {
//       const response = await DispatchService.allocateVehicle(tripId, vehicleId);
//       console.log(response);
//       if (response.status === 201) {
//         dispatch(toggleToast({ message: 'Cab allocated to the trip successfully!', type: 'success' }));
//       }
//       const updatedData = data.map(item => {
//         if (selectedRows[item.id]) {
//           return {
//             ...item,
//             vehicleNumber: selectedVehicle,
//             driverName: response.data.driverName
//           };
//         }
//         return item;
//       });
//       console.log("Updated Data:", updatedData);
//       setData(updatedData);
//       setSearchedvehicle([]);
//       setSelectedVehicle('');
//       setSelectedRows({});
//     }
//     catch (err) {
//       dispatch(toggleToast({ message: 'Please try again in after some time.', type: 'error' }));
//       console.log(err);
//     }
//   };

//   const tableInstance = useMaterialReactTable({
//     columns,
//     data,
//     enableRowSelection: (row) => row.vendorName !== "",
//     enableSelectAll: false,
//     enableMultiRowSelection: false,
//     state: {
//       rowSelection: selectedRows,
//     },
//     onRowSelectionChange: handleRowSelection,
//     getRowId: row => row.id,
//   });

//   const onChangeVehicleHandler = (newValue, name, key) => {
//     console.log("on change handler", newValue);
//     setVehicleId(newValue?.vehicleId);
//     setSelectedVehicle(newValue?.vehicleRegistrationNumber);
//   };

//   return (
//     <div>
//       <div
//         style={{
//           backgroundColor: '#f9f9f9',
//           padding: '16px 20px',
//           borderRadius: '10px',
//           margin: '20px 0',
//         }}
//       >
//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             backgroundColor: 'white',
//             padding: '16px 20px',
//             borderRadius: '10px',
//             width: '100%',
//           }}
//         >
//           <div style={{ backgroundColor: 'white', display: 'flex' }}>
//             <Autocomplete
//               disablePortal
//               id="search-vehicle-number"
//               options={searchedVehicle}
//               autoComplete
//               open={openSearchVN}
//               onOpen={() => {
//                 setOpenSearchVN(true);
//               }}
//               onClose={() => {
//                 setOpenSearchVN(false);
//               }}
//               onChange={(e, val) =>
//                 onChangeVehicleHandler(val, "vehicle", "vehicleId")
//               }
//               getOptionKey={(vehicle) => vehicle.vehicleId}
//               getOptionLabel={(vehicle) => vehicle.vehicleRegistrationNumber}
//               freeSolo
//               name="vehicleNumber"
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   paddingBottom: '5px',
//                   width: '220px',
//                 },
//               }}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Search Vehicle Number"
//                   onChange={getAutoSuggestVehicle}
//                   InputProps={{
//                     ...params.InputProps,
//                     sx: { fontSize: "15px", fontFamily: 'DM Sans' }
//                   }}
//                   InputLabelProps={{
//                     sx: { fontSize: "15px", fontFamily: 'DM Sans', }
//                   }}
//                 />
//               )}
//             />
//             <button
//               onClick={handleAssignVehicle}
//               style={{
//                 backgroundColor: '#f6ce47',
//                 color: 'black',
//                 border: '2px solid #f6ce47',
//                 borderRadius: '6px',
//                 fontSize: '15px',
//                 fontWeight: 'bold',
//                 padding: '6px 10px',
//                 cursor: 'pointer',
//                 marginLeft: '30px',
//               }}
//             >
//               Assign Vehicle
//             </button>
//           </div>

//           <div>
//             <button
//               onClick={()=>allocationComplete()}
//               style={{
//                 backgroundColor: '#f6ce47',
//                 color: 'black',
//                 border: '2px solid #f6ce47',
//                 borderRadius: '6px',
//                 fontSize: '15px',
//                 fontWeight: 'bold',
//                 padding: '13px 10px',
//                 cursor: 'pointer',
//               }}
//             >
//               Allocation Complete
//             </button>
//           </div>
//         </div>
//       </div>

//       <div
//         style={{
//           margin: '30px 0 0',
//           backgroundColor: '#f9f9f9',
//           padding: '16px 20px',
//           borderRadius: '10px',
//         }}
//       >
//         <MaterialReactTable table={tableInstance} />
//       </div>
//     </div>
//   );
// };

// // Custom cell renderer for Vehicle Number column
// const VehicleNumberCell = ({ value, onChange, options }) => (
//   <Autocomplete
//     id="search-vehicle-number-cell"
//     options={options}
//     autoComplete
//     defaultValue={value}
//     onChange={(e, val) => onChange(val ? val.vehicleNumber : '')}
//     getOptionLabel={(option) => option.vehicleNumber}
//     freeSolo
//     renderInput={(params) => (
//       <TextField
//         {...params}
//         onChange={(e) => onChange(e.target.value)}
//         InputProps={{
//           ...params.InputProps,
//           sx: { fontSize: '15px', fontFamily: 'DM Sans' },
//         }}
//         InputLabelProps={{
//           sx: { fontSize: '15px', fontFamily: 'DM Sans' },
//         }}
//       />
//     )}
//   />
// );

// export default AllocateCab;

// Cab Allocation table
import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import DispatchService from "@/services/dispatch.service";
import { toggleToast } from "@/redux/company.slice";
import { useDispatch, useSelector } from "react-redux";
import LoaderComponent from "../common/loading";

const AllocateCab = ({ tripList, allocationComplete, setTripList }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [selectedVehicle, setSelectedVehicle] = useState();
  const [searchedVehicleNumbers, setSearchedVehicleNumbers] = useState([]);
  const [vendor, setVendor] = useState("");
  const [searchedVehicle, setSearchedvehicle] = useState([]);
  const [loading, setLoading] = useState(false);

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
        accessorKey: "routeName",
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
        accessorKey: "escortStatus",
        header: "Escort Trip",
        size: 150,
      },
      {
        accessorKey: "special",
        header: "Special",
        size: 150,
      },
      {
        accessorKey: "vendorName",
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
              {row.original.vehicleNumber ? (
                <div>{row.original.vehicleNumber}</div>
              ) : (
                <VehicleNumberCell
                  value={value}
                  rowData={row}
                  onClick={(row) => row.vendorName}
                  onChange={(newValue) => {
                    row.setValue("vehicleNumber", newValue);
                  }}
                  // options={setSearchedvehicle}
                />
              )}
            </>
          );
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
  });

  const VehicleNumberCell = ({ value, onChange, options, rowData }) => {
    const [localSearchedVehicle, setLocalSearchedVehicle] = useState([]);
    const [openSearchVN, setOpenSearchVN] = useState(false);
    const getAutoSuggestVehicle = async (event) => {
      try {
        setLoading(true);
        const text = event.target.value;
        if (text) {
          // console.log(rowData.original);
          setSelectedRows(rowData.original.id);
          const vendorName = rowData.original.vendorName;
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
      } finally {
        setLoading(false);
      }
    };

    const VehicleChangeHandler = (event, value) => {
      console.log("tripId>>>>>>>>>>>>", rowData.original.id, "vehicleId");
      // console.log(value?.vehicleId);
      setSelectedVehicle(value?.vehicleNumber);
      if (value?.vehicleId) {
        handleAssignVehicle(
          rowData.original.id,
          value?.vehicleId,
          value?.vehicleRegistrationNumber
        );
      }
      setOpenSearchVN(false);
      setLocalSearchedVehicle([]);
    };

    return (
      <>
        <Autocomplete
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
        />
        {loading ? (
          <div
            style={{
              position: "absolute",
              // backgroundColor: "pink",
              zIndex: "1",
              top: "55%",
              left: "50%",
            }}
          >
            <LoaderComponent />
          </div>
        ) : (
          " "
        )}
      </>
    );
  };

  const handleAssignVehicle = async (tripId, vehicleId, vehicleNumber) => {
    try {
      setLoading(true);
      console.log("Data before updating >>>>>>>", tripList);
      const response = await DispatchService.allocateVehicle(tripId, vehicleId);
      // console.log(response);

      if (response.status === 201) {
        dispatch(
          toggleToast({
            message: "Cab allocated to the trip successfully!",
            type: "success",
          })
        );
      }

      if (vehicleNumber && response.data?.driverName) {
        setTripList((prevTripList) => {
          if (Array.isArray(prevTripList)) {
            const updatedData = prevTripList.map((item) => {
              if (tripId === item.id) {
                return {
                  ...item,
                  vehicleNumber: vehicleNumber,
                  driverName: response.data.driverName,
                };
              }
              return item;
            });

            console.log("Updated Data:", updatedData);

            // Update state
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
      dispatch(
        toggleToast({
          message: "Please try again after some time.",
          type: "error",
        })
      );
      console.log(err);
    } finally {
      setLoading(false);
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

      {loading ? (
        <div
          style={{
            position: "absolute",
            // backgroundColor: "pink",
            zIndex: "1",
            top: "55%",
            left: "50%",
          }}
        >
          <LoaderComponent />
        </div>
      ) : (
        " "
      )}
    </div>
  );
};

export default AllocateCab;
