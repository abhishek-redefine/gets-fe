import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Box,
  TextField,
  Autocomplete,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { DATE_FORMAT, MASTER_DATA_TYPES } from "@/constants/app.constants.";
import { useDispatch, useSelector } from "react-redux";
import billing from "@/layouts/billing";
import { setMasterData } from "@/redux/master.slice";
import MasterDataService from "@/services/masterdata.service";
import TripSheetEntryDetails from "@/components/billing/tripSheetEntryDetails";
import TripSheetEntryTable from "@/components/billing/tripSheetEntryTable";
import TransferTripModal from "@/components/billing/transferTripModal";
import ManualGenerateTripModal from "@/components/billing/manualGenerateTripModal";
import ManualCreateTripDetails from "@/components/billing/manualCreateTripDetails";
import ComplianceService from "@/services/compliance.service";
import BillingService from "@/services/billing.service";

const style = {
  tripTransferStyle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 650,
    bgcolor: "background.paper",
    height: 400,
    borderRadius: 5,
  },
  generateTripStyle: {
    position: "absolute",
    top: "41%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 650,
    bgcolor: "background.paper",
    height: 400,
    borderRadius: 5,
  },
};

const MainComponent = () => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [searchValues, setSearchValues] = useState({
    tripId: "",
    vehicleNumber: vehicleNumber,
    startDate: "",
    endDate: "",
  });
  const [list, setList] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const { ShiftType: shiftTypes } = useSelector((state) => state.master);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [selectedVehicleRegistrationNo, setSelectedVehicleRegistrationNo] =
    useState("");
  const [searchValuesData, setSearchValuesData] = useState({});
  const [searchedVehicle, setSearchedvehicle] = useState([]);
  const [openSearchVehicle, setOpenSearchVehicle] = useState(false);

  const searchForVehicle = async (e) => {
    try {
      if (e.target.value) {
        console.log("searchForVehicle", e.target.value);
        const response = await ComplianceService.searchVehicle(e.target.value);
        console.log(response);
        const { data } = response || {};
        setSearchedvehicle(data);
        console.log("Searched vehicle>>", searchedVehicle);
      } else {
        setSearchedvehicle([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onChangeVehicleHandler = (newValue) => {
    console.log("on vehicle change handler", newValue);
    setVehicleNumber(newValue?.vehicleRegistrationNumber);
    // setVehicleId(newValue?.vehicleId);
  };

  const handleRowsSelected = (selectedRow) => {
    setSelectedRow(selectedRow);
    console.log("Trip sheet selected row >>>: ", selectedRow);
  };

  const handleEditTripClick = () => {
    // console.log("edit trip selected row>>", selectedRow);
    if (selectedRow) {
      setDetailsScreenFlag(true);
      console.log("Selected row vehicle ID: ", selectedRow.vehicleId);
      handleTripInfoScreenOpen();
      setManualCreateTripDetailsScreenOpen(false);
      setSelectedRow(null);
    }
  };

  const handleTransferTripClick = () => {
    if (selectedRow) {
      console.log("Selected row vehicle ID: ", selectedRow.vehicleId);
      console.log(
        "Selected row vehicle registration Number: ",
        selectedRow.vehicleRegistration
      );
      setSelectedVehicleId(selectedRow.vehicleId);
      setSelectedVehicleRegistrationNo(selectedRow.vehicleRegistration);
      handleTripTransferModalOpen();
      setSelectedRow(null);
    }
  };

  const handleCreateTripDetailsScreen = () => {
    setDetailsScreenFlag(true);
    setTripDetailsScreenOpen(false);
    handleCreateTripDetailsScreenOpen();
  };

  const [detailsScreenFlag, setDetailsScreenFlag] = useState(false);
  const [tripDetailsScreenOpen, setTripDetailsScreenOpen] = useState(false);
  const [
    manualCreateTripDetailsScreenOpen,
    setManualCreateTripDetailsScreenOpen,
  ] = useState(false);

  const handleTripInfoScreenOpen = () => {
    console.log("Trip Details Screen opened");
    setTripDetailsScreenOpen(true);
  };

  const handleTripInfoScreenClose = () => {
    console.log("Trip Details Screen closed");
    setTripDetailsScreenOpen(false);
    setDetailsScreenFlag(false);
  };

  const handleCreateTripDetailsScreenOpen = () => {
    console.log("Create Trip Details Screen closed");
    setManualCreateTripDetailsScreenOpen(true);
  };

  const handleCreateTripDetailsScreenClose = () => {
    console.log("Create Trip Details Screen closed");
    setManualCreateTripDetailsScreenOpen(false);
    setDetailsScreenFlag(false);
  };

  const [openTripTransferModal, setOpenTripTransferModal] = useState(false);

  const handleTripTransferModalOpen = () => {
    console.log("handle trip transfer modal open");
    setOpenTripTransferModal(true);
  };

  const handleTripTransferModalClose = () => {
    console.log("handle trip transfer modal close");
    setOpenTripTransferModal(false);
    // console.log("edit trip selected row>>", selectedRow);
  };

  const [openGenerateTripModal, setOpenGenerateTripModal] = useState(false);
  const handleGenerateTripModalOpen = () => {
    console.log("Generate Trip modal open");
    setOpenGenerateTripModal(true);
  };

  const handleGenerateTripModalClose = () => {
    console.log("Generate Trip modal close");
    setOpenGenerateTripModal(false);
    // console.log("edit trip selected row>>", selectedRow);
  };

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    let newSearchValues = { ...searchValues };
    if (name === "startDate" || name === "endDate")
      newSearchValues[name] = value.format("YYYY-MM-DD");
    else newSearchValues[name] = value;
    setSearchValues(newSearchValues);
  };

  const fetchMasterData = async (type) => {
    try {
      const response = await MasterDataService.getMasterData(type);
      const { data } = response || {};
      if (data?.length) {
        console.log(data);
        dispatch(setMasterData({ data, type }));
      }
    } catch (e) {}
  };

  const resetFilter = () => {
    let allSearchValue = {
      tripId: "",
      vehicleNumber: "",
      startDate: "",
      endDate: "",
    };
    setSearchValues(allSearchValue);
    setVehicleNumber("");
    setSearchedvehicle([]);
    setSelectedFilter("");
    setFilterValue("");
  };

  const fetchSummary = async () => {
    try {
      let allSearchValues = { ...searchValues };
      Object.keys(allSearchValues).forEach((objKey) => {
        if (
          allSearchValues[objKey] === null ||
          allSearchValues[objKey] === ""
        ) {
          delete allSearchValues[objKey];
        }
      });
      let tripId = allSearchValues.tripId;
      console.log("tripId>>>", tripId);
      setLoading(true);
      if (selectedFilter === "Trip Id") {
        const response = await BillingService.getTripByTripId(tripId);
        console.log("response>>>", response.data);
        setList([response.data]);
      }
      if (selectedFilter === "Vehicle Number") {
        console.log("allSearchValues>>>", allSearchValues);
        const params = new URLSearchParams(allSearchValues);
        const response = await BillingService.getTripByVehicleNumber(
          params.toString()
        );
        console.log("response>>>", response);
        setList(response.data);
      }
      resetFilter();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!shiftTypes?.length) {
      fetchMasterData(MASTER_DATA_TYPES.SHIFT_TYPE);
    }
    // fetchAllOffices();
  }, []);

  const handleSearchValues = (data) => {
    console.log("Search values changed: ", data);
    setSearchValuesData(data);
  };

  useEffect(() => {
    if (!selectedRow) {
      console.log("Row unselected");
      // setSelectedRow(null);
    }
  }, [selectedRow]);

  useEffect(() => {
    setSearchValues((prevSearchValues) => ({
      ...prevSearchValues,
      vehicleNumber: vehicleNumber,
    }));
  }, [vehicleNumber]);

  useEffect(() => {
    console.log("searchValues changed: ", searchValues);
  }, [searchValues]);

  useEffect(() => {
    console.log("list>>>", list);
  }, [list]);

  return (
    <div>
      {detailsScreenFlag ? (
        <div>
          {tripDetailsScreenOpen ? (
            <TripSheetEntryDetails
              onClose={handleTripInfoScreenClose}
              tripdetails={list}
            />
          ) : (
            ""
          )}
          {manualCreateTripDetailsScreenOpen ? (
            <ManualCreateTripDetails
              onClose={handleCreateTripDetailsScreenClose}
              tripdetails={searchValuesData}
            />
          ) : (
            ""
          )}
        </div>
      ) : (
        <div>
          <div
            className="filterContainer"
            style={{
              flexWrap: "wrap",
              alignItems: "center",
              backgroundColor: "#f9f9f9",
              borderRadius: "10px",
              margin: "30px 0",
              padding: "0 13px",
              // gap: "10px",
            }}
          >
            <div
              className="form-control-input"
              style={{ minWidth: 350, display: "flex" }}
            >
              <div
                style={{
                  marginRight: 0,
                  borderRadius: "4px 0 4px 4px",
                  borderColor: "red",
                  width: "160px",
                }}
              >
                <FormControl
                  sx={{
                    backgroundColor: "#ffffff",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "4px 0 0 4px",
                      "& fieldset": {
                        borderRight: "1px solid white",
                      },
                    },
                  }}
                >
                  <InputLabel id="filter-select-label">Search By</InputLabel>
                  <Select
                    labelId="filter-select-label"
                    value={selectedFilter}
                    onChange={(e) => {
                      setSelectedFilter(e.target.value);
                      setFilterValue("");
                    }}
                    sx={{
                      width: "160px",
                      // backgroundColor: "pink",
                    }}
                  >
                    <MenuItem value="Trip Id">Trip Id</MenuItem>
                    <MenuItem value="Vehicle Number">Vehicle Number</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div
                style={{
                  width: "230px",
                }}
              >
                {selectedFilter === "" && (
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "0 4px 4px 0",
                      borderWidth: 1,
                      borderColor: "#c4c4c4",
                      borderStyle: "solid",
                      height: 56,
                    }}
                  ></div>
                )}
                {selectedFilter === "Trip Id" && (
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    label="Trip Id"
                    name="tripId"
                    sx={{
                      backgroundColor: "#ffffff",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "0 4px 4px 0",
                      },
                    }}
                    value={searchValues.tripId}
                    onChange={handleFilterChange}
                    type="number"
                  />
                )}
                {selectedFilter === "Vehicle Number" && (
                  <FormControl
                    variant="outlined"
                    sx={{
                      backgroundColor: "#ffffff",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "0 4px 4px 0",
                      },
                    }}
                  >
                    <Autocomplete
                      disablePortal
                      id="search-vehicle"
                      options={searchedVehicle}
                      autoComplete
                      open={openSearchVehicle}
                      onOpen={() => {
                        setOpenSearchVehicle(true);
                      }}
                      onClose={() => {
                        setOpenSearchVehicle(false);
                      }}
                      onChange={(e, val) => onChangeVehicleHandler(val)}
                      getOptionKey={(vehicle) => vehicle.vehicleNumber}
                      getOptionLabel={(vehicle) =>
                        vehicle.vehicleRegistrationNumber
                      }
                      freeSolo
                      name="vehicle"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Search Vehicle"
                          onChange={searchForVehicle}
                          value={searchValues.vehicleNumber}
                        />
                      )}
                    />
                  </FormControl>
                )}
              </div>
            </div>

            {selectedFilter === "Vehicle Number" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  // backgroundColor: "pink",
                }}
              >
                <div
                  className="form-control-input"
                  style={{ backgroundColor: "white" }}
                >
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      name="startDate"
                      format={DATE_FORMAT}
                      value={
                        searchValues.startDate
                          ? moment(searchValues.startDate)
                          : null
                      }
                      onChange={(e) =>
                        handleFilterChange({
                          target: { name: "startDate", value: e },
                        })
                      }
                      label="Start Date"
                    />
                  </LocalizationProvider>
                </div>

                <div
                  className="form-control-input"
                  style={{ backgroundColor: "white" }}
                >
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      name="endDate"
                      format={DATE_FORMAT}
                      value={
                        searchValues.endDate
                          ? moment(searchValues.endDate)
                          : null
                      }
                      onChange={(e) =>
                        handleFilterChange({
                          target: { name: "endDate", value: e },
                        })
                      }
                      label="End Date"
                      minDate={
                        searchValues.startDate
                          ? moment(searchValues.startDate)
                          : null
                      }
                    />
                  </LocalizationProvider>
                </div>
              </div>
            )}

            <div className="form-control-input" style={{ minWidth: "70px" }}>
              <button
                type="submit"
                onClick={() => fetchSummary()}
                className="btn btn-primary filterApplyBtn"
              >
                Apply
              </button>
            </div>
            <div className="form-control-input" style={{ minWidth: "70px" }}>
              <button
                type="submit"
                onClick={resetFilter}
                className="btn btn-primary filterApplyBtn"
              >
                Reset
              </button>
            </div>
          </div>
          <div
            style={{
              backgroundColor: "#f9f9f9",
              borderRadius: "6px",
              padding: "25px",
              // backgroundColor: "green",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "white",
                marginBottom: "10px",
                padding: "20px 20px",
                borderRadius: "20px 20px 0 0",
              }}
            >
              <h3>Details</h3>
              <div style={{ display: "flex" }}>
                <button
                  className="btn btn-primary"
                  style={{
                    width: "110px",
                    padding: "10px",
                    margin: "0 10px",
                  }}
                  onClick={handleEditTripClick}
                >
                  Edit Trip
                </button>
                <button
                  className="btn btn-primary"
                  style={{
                    width: "140px",
                    padding: "10px",
                    margin: "0 10px",
                  }}
                  onClick={handleTransferTripClick}
                >
                  Transfer Trip
                </button>
                <Modal
                  open={openTripTransferModal}
                  onClose={handleTripTransferModalClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style.tripTransferStyle}>
                    <TransferTripModal
                      onClose={handleTripTransferModalClose}
                      vehicleId={selectedVehicleId}
                      vehicleRegistrationNumber={selectedVehicleRegistrationNo}
                    />
                  </Box>
                </Modal>
                <button
                  className="btn btn-primary"
                  style={{
                    width: "140px",
                    padding: "10px",
                    margin: "0 10px",
                  }}
                  onClick={handleGenerateTripModalOpen}
                >
                  Create Trip
                </button>
                <Modal
                  open={openGenerateTripModal}
                  onClose={handleGenerateTripModalClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style.generateTripStyle}>
                    <ManualGenerateTripModal
                      onClose={handleGenerateTripModalClose}
                      createdTripScreenOpen={handleCreateTripDetailsScreen}
                      searchValuesdata={(searchValues) =>
                        handleSearchValues(searchValues)
                      }
                    />
                  </Box>
                </Modal>
              </div>
            </div>
            <TripSheetEntryTable
              isLoading={loading}
              list={list}
              onRowsSelected={handleRowsSelected}
              selectedRow={selectedRow}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default billing(MainComponent);
