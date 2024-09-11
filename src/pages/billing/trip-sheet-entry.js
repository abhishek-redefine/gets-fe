import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Box,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { getFormattedLabel } from "@/utils/utils";
import { DATE_FORMAT, MASTER_DATA_TYPES } from "@/constants/app.constants.";
import OfficeService from "@/services/office.service";
import { useDispatch, useSelector } from "react-redux";
import billing from "@/layouts/billing";
import { setMasterData } from "@/redux/master.slice";
import MasterDataService from "@/services/masterdata.service";
import TripSheetEntryDetails from "@/components/billing/tripSheetEntryDetails";
import TripSheetEntryTable from "@/components/billing/tripSheetEntryTable";
import TransferTripModal from "@/components/billing/transferTripModal";
import ManualGenerateTripModal from "@/components/billing/manualGenerateTripModal";
import ManualCreateTripDetails from "@/components/billing/manualCreateTripDetails";

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
  const [office, setOffice] = useState([]);
  const [searchValues, setSearchValues] = useState({
    officeId: "",
    shiftType: "",
    date: moment().format("YYYY-MM-DD"),
    shiftTime: "",
  });
  const [list, setList] = useState([]);

  const { ShiftType: shiftTypes } = useSelector((state) => state.master);
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({
    page: 0,
    size: 100,
  });
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [selectedVehicleRegistrationNo, setSelectedVehicleRegistrationNo] =
    useState("");
  const [searchValuesData, setSearchValuesData] = useState({});

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
    if (name === "date") newSearchValues[name] = value.format("YYYY-MM-DD");
    else newSearchValues[name] = value;
    setSearchValues(newSearchValues);
  };

  const fetchAllOffices = async () => {
    try {
      const response = await OfficeService.getAllOffices();
      const { data } = response || {};
      const { clientOfficeDTO } = data || {};
      console.log(clientOfficeDTO);
      setSearchValues(
        { ...searchValues },
        (searchValues["officeId"] = clientOfficeDTO[0]?.officeId)
      );
      setOffice(clientOfficeDTO);
    } catch (e) {}
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
      officeId: office[0].officeId,
      date: moment().format("YYYY-MM-DD"),
      shiftType: "",
    };
    setSearchValues(allSearchValue);
  };

  const fetchSummary = async () => {
    try {
      let params = new URLSearchParams(pagination);
      let allSearchValues = { ...searchValues };
      Object.keys(allSearchValues).forEach((objKey) => {
        if (
          allSearchValues[objKey] === null ||
          allSearchValues[objKey] === ""
        ) {
          delete allSearchValues[objKey];
        }
      });
      const data = [
        {
          vehicleId: "4",
          vehicleRegistration: "DL04C196",
          vehicleType: "Cab",
          vendor: "Active",
          date: "04-08-2024",
          id: "747",
          km: "20",
          hrs: "4",
          issueType: "Km. Issue",
          shiftTime: "09:30",
          shiftType: "LOGOUT",
        },
      ];
      setList(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!shiftTypes?.length) {
      fetchMasterData(MASTER_DATA_TYPES.SHIFT_TYPE);
    }
    fetchAllOffices();
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

  return (
    <div>
      {detailsScreenFlag ? (
        <div>
          {tripDetailsScreenOpen ? (
            <TripSheetEntryDetails onClose={handleTripInfoScreenClose} tripdetails={list}/>
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
              backgroundColor: "#f9f9f9",
              borderRadius: "10px",
              margin: "30px 0",
              padding: "0 13px",
            }}
          >
            {office.length > 0 && (
              <div style={{ minWidth: "180px" }} className="form-control-input">
                <FormControl fullWidth>
                  <InputLabel id="primary-office-label">Office ID</InputLabel>
                  <Select
                    style={{ width: "180px", backgroundColor: "white" }}
                    labelId="primary-office-label"
                    id="officeId"
                    value={searchValues.officeId}
                    name="officeId"
                    label="Office ID"
                    onChange={handleFilterChange}
                  >
                    {!!office?.length &&
                      office.map((office, idx) => (
                        <MenuItem key={idx} value={office.officeId}>
                          {getFormattedLabel(office.officeId)}, {office.address}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
            )}

            <div
              className="form-control-input"
              style={{ backgroundColor: "white" }}
            >
              <InputLabel style={{ backgroundColor: "#f9f9f9" }} htmlFor="date">
                Date
              </InputLabel>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  name="date"
                  format={DATE_FORMAT}
                  value={searchValues.date ? moment(searchValues.date) : null}
                  onChange={(e) =>
                    handleFilterChange({
                      target: { name: "date", value: e },
                    })
                  }
                />
              </LocalizationProvider>
            </div>

            <div style={{ minWidth: "160px" }} className="form-control-input">
              <FormControl fullWidth>
                <InputLabel id="shiftType-label">Shift Type</InputLabel>
                <Select
                  style={{ width: "160px", backgroundColor: "white" }}
                  labelId="shiftType-label"
                  id="shiftType"
                  name="shiftType"
                  value={searchValues.shiftType}
                  label="Shift Type"
                  onChange={handleFilterChange}
                >
                  {shiftTypes.map((sT, idx) => (
                    <MenuItem key={idx} value={sT.value}>
                      {getFormattedLabel(sT.value)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            {/* <div style={{ minWidth: "160px", backgroundColor: 'white', }} className="form-control-input">
              <FormControl fullWidth>
                <InputLabel id="shiftType-label">Shift Time</InputLabel>
                <Select
                  style={{ width: "160px" }}
                  labelId="shiftType-label"
                  id="shiftType"
                  name="shiftType"
                  value={searchValues.shiftType}
                  label="Shift Type"
                  onChange={handleFilterChange}
                >
                  {shiftTypes.map((sT, idx) => (
                    <MenuItem key={idx} value={sT.value}>
                      {getFormattedLabel(sT.value)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div> */}
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
