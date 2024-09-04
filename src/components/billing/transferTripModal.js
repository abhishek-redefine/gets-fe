import { Autocomplete, Box, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import DispatchService from "@/services/dispatch.service";
import { useDispatch } from "react-redux";

const TransferTripModal = (props) => {
  const { onClose, vehicleId, vehicleRegistrationNumber } = props;
  const dispatch = useDispatch();
  const [selectedVehicle, setSelectedVehicle] = useState();
  const [searchedVehicle, setSearchedvehicle] = useState([]);

  const TransferDutyInfo = {
    "Vehicle ID": vehicleId,
    "Vehicle Registration": vehicleRegistrationNumber,
  };

  const onSubmitHandler = () => {
    console.log("Submitting and closing modal");
    onClose();
  };

  const VehicleNumberCell = ({}) => {
    const [localSearchedVehicle, setLocalSearchedVehicle] = useState([]);
    const [openSearchVN, setOpenSearchVN] = useState(false);
    const getAutoSuggestVehicle = async (event) => {
      try {
        const text = event.target.value;
        console.log("text: ", text);
        if (text) {
          // console.log(rowData.original);
          // setSelectedRows(rowData.original.id);
          // const vendorName = rowData.original.vendorName;
          // console.log(vendorName);
          const response = await DispatchService.autoSuggestVehicleByVendor(
            vendorName,
            text
          );
          console.log(response.data);
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
      // console.log("tripId>>>>>>>>>>>>", rowData.original.id, "vehicleId");
      console.log(value?.vehicleId);
      setSelectedVehicle(value?.vehicleNumber);
      if (value?.vehicleId) {
        handleAssignVehicle(
          // rowData.original.id,
          value?.vehicleId,
          value?.vehicleRegistrationNumber
        );
      }
      setOpenSearchVN(false);
      setLocalSearchedVehicle([]);
    };

    return (
      <Autocomplete
        fullWidth
        id="search-vehicle-number"
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
            label="Search by vehicle number"
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
    );
  };

  const handleAssignVehicle = async (tripId, vehicleId, vehicleNumber) => {
    try {
      console.log("Data before updating >>>>>>>", tripList);
      const response = await DispatchService.allocateVehicle(tripId, vehicleId);
      console.log(response);

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
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#FFF",
        borderRadius: 10,
        fontFamily: "DM Sans",
        padding: "30px 40px",
      }}
    >
      <h3>Transfer Duty</h3>
      <div style={{ marginTop: "25px" }}>
        <Box
          sx={{
            width: "100%",
            padding: "0 5px 20px",
          }}
        >
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={6}>
              {Object.entries(TransferDutyInfo).map(([key]) => (
                <p
                  key={key}
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    marginBottom: "25px",
                  }}
                >
                  {key}
                </p>
              ))}
            </Grid>
            <Grid item xs={6}>
              {Object.keys(TransferDutyInfo).map((value) => (
                <p
                  style={{
                    fontSize: "15px",
                    marginBottom: "25px",
                  }}
                >
                  {TransferDutyInfo[value]}
                </p>
              ))}
            </Grid>
          </Grid>
        </Box>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "0 5px",
        }}
      >
        <p
          style={{
            fontFamily: "DM Sans",
            fontSize: "15px",
            fontWeight: "600",
            width: "50%",
            marginRight: "10px",
          }}
        >
          Trip transfer to vehicle
        </p>
        {/* <Autocomplete
          fullWidth
          disablePortal
          id="search-user"
          options={searchedUsers}
          autoComplete
          open={isSearchUser}
          onOpen={() => {
            setIsSearchUser(true);
          }}
          onClose={() => {
            setIsSearchUser(false);
          }}
          onChange={(e, val) => onChangeHandler(val)}
          getOptionKey={(rm) => rm.empId}
          getOptionLabel={(rm) => `${rm.data} ${rm.empId}`}
          freeSolo
          name="reportingManager"
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search by employee ID / name"
              onChange={searchForRM}
              size="small"
            />
          )}
        /> */}
        <VehicleNumberCell />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          type="button"
          style={{
            backgroundColor: "#f6ce47",
            color: "black",
            border: "none",
            borderRadius: "6px",
            fontSize: "15px",
            padding: "13px 35px",
            cursor: "pointer",
            marginTop: "20px",
            position: "absolute",
            bottom: "50px",
          }}
          onClick={onSubmitHandler}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default TransferTripModal;
