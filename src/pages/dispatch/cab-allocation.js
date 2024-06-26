import dispatch from "@/layouts/dispatch";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getFormattedLabel } from "@/utils/utils";
import OfficeService from "@/services/office.service";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import {
  DATE_FORMAT,
  DEFAULT_PAGE_SIZE,
  MASTER_DATA_TYPES,
  SHIFT_TYPE,
} from "@/constants/app.constants.";
import { useDispatch, useSelector } from "react-redux";
import MasterDataService from "@/services/masterdata.service";
import GridNew from "@/components/gridNew";
import GenerateTripModal from "@/components/dispatch/genrateTripModal";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import DispatchService from "@/services/dispatch.service";
import { setMasterData } from "@/redux/master.slice";
import RouteEditor from "@/components/dispatch/route-editor";
import CabStickerModal from "@/components/dispatch/cabStickerModel";



const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  height: 550,
  borderRadius: 5,
};

const MainComponent = () => {
  const headers = [
    { field: "officeId", checkboxSelection: true },
    { field: "shiftType" },
    { field: "shiftTime" },
    { field: "bookingCount" },
    { field: "routingStatus" },
    { field: "dispatchStatus" },
    { field: "tripCount" },
    { field: "allocatedVendorCount" },
    { field: "allocatedCabCount" },
    { field: "fleetMix" },
    { field: "allocatedEscortCount" },
    { field: "backToBackCount" },
    { field: "smsSent" },
  ];
  const [office, setOffice] = useState([]);
  const [searchValues, setSearchValues] = useState({
    officeId: "",
    shiftType: "",
    date: moment().format("YYYY-MM-DD"),
    transportType: "",
  });

  const [mrList, setMrList] = useState([]);
  const [mb2b, setMb2b] = useState([]);
  const [mva, setMva] = useState([]);
  const [mca, setMca] = useState([ ]);
  const [downloadTripList, setDownloadTripList] = useState([]);
  const [selectedLogoutTrips, setSelectedLogoutTrips] = useState([]);
  const [selectedLoginTrips, setSelectedLoginTrips] = useState([]);
  const [pairedTrips, setPairedTrips] = useState([]);
  const [pairedTripIds, setPairedTripIds] = useState([]);
  const { ShiftType: shiftTypes } = useSelector((state) => state.master);
  const dispatch = useDispatch();
  const [showAction, setShowAction] = useState(false);
  const [routeEditorShow, setRouteEditorShow] = useState(false);
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);
  const [manageTrip, setManageTrip] = useState();
  const [selectedRow, setSelectedRow] = useState([]);



  const handlePairTrips = () => {
    if (selectedLogoutTrips.length === 1 && selectedLoginTrips.length === 1) {
      const newPairedTrip = `${selectedLogoutTrips[0]}-${selectedLoginTrips[0]}`;
      setPairedTrips([
        ...pairedTrips,
        selectedLogoutTrips[0],
        selectedLoginTrips[0],
      ]);
      setPairedTripIds([...pairedTripIds, newPairedTrip]);
      setSelectedLogoutTrips([]);
      setSelectedLoginTrips([]);
    }
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
        dispatch(setMasterData({ data, type }));
      }
    } catch (e) {}
  };


  const fetchSummary = async () => {
    try {
      console.log("search values>>>>>", searchValues);
      let allSearchValues = { ...searchValues };
      Object.keys(allSearchValues).forEach((objKey) => {
        if (
          allSearchValues[objKey] === null ||
          allSearchValues[objKey] === ""
        ) {
          delete allSearchValues[objKey];
        }
      });
      const response = await DispatchService.getAllSummary(allSearchValues);
      console.log(response);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const selectedRowHandler = (flag, row) => {
    setShowAction(flag);
    setSelectedRow(row);
  };

  const resetFilter = () => {
    let allSearchValue = {
      officeId: office[0].officeId,
      date: moment().format("YYYY-MM-DD"),
      shiftType: "",
    };
    setSearchValues(allSearchValue);
  };

  useEffect(() => {
    if (!shiftTypes?.length) {
      fetchMasterData(MASTER_DATA_TYPES.SHIFT_TYPE);
    }
    fetchAllOffices();
  }, []);

  return (
    <div>
      {!routeEditorShow ? (
        <div className="gridContainer">
          <div className="filterContainer">
            {office.length > 0 && (
              <div style={{ minWidth: "180px" }} className="form-control-input">
                <FormControl fullWidth>
                  <InputLabel id="primary-office-label">
                    Office ID
                  </InputLabel>
                  <Select
                    style={{ width: "180px" }}
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

            <div className="form-control-input">
              <InputLabel htmlFor="date">Date</InputLabel>
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
            </div>
            <div style={{ minWidth: "160px" }} className="form-control-input">
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
            </div>
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
          <div className="d-flex" style={{ justifyContent: "flex-end" }}>
            <div className="filterContainer">
              <div className="form-control-input" style={{ minWidth: "170px" }}>
                {showAction && (
                  <button
                    type="submit"
                    onClick={() => setRouteEditorShow(true)}
                    className="btn btn-primary filterApplyBtn"
                    style={{ width: "100%" }}
                  >
                    Route Editor
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="commonTable">
            <div
              className="d-flex"
              style={{ margin: "15px 0", justifyContent: "space-between" }}
            >
              <div className="d-flex" style={{ alignItems: "center"}}>
                <h3 style={{ paddingLeft: 10 }}>Routing Details</h3>
              </div>
              {showAction && (
                <div
                  className="d-flex"
                  style={{
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{ minWidth: "60px" }}
                    className="form-control-input"
                  >
                    <h4>Actions</h4>
                  </div>
                  <div style={{ minWidth: "180px" }} className="mx-4">
                    <div className="dropdown">
                      <button className="dropbtn">Allocate Cabs</button>
                      <div className="dropdown-content">
                        {!!mrList?.length &&
                          mrList.map((mr, idx) => (
                            <MenuItem
                              key={idx}
                              value={mr.key}
                              onClick={() =>
                                manageTripHandler(mr.key, mr.value)
                              }
                            >
                              {mr.value}
                            </MenuItem>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ minWidth: "180px" }} className="mx-4">
                    <div className="dropdown">
                      <button className="dropbtn">
                        Auto Allocate Cabs
                      </button>
                      <div className="dropdown-content">
                        {!!mb2b?.length &&
                          mb2b.map((mr, idx) => (
                            <MenuItem key={idx} value={mr}>
                              {mr}
                            </MenuItem>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ minWidth: "180px" }} className="mx-4">
                    <div className="dropdown">
                      <button className="dropbtn" onClick={handleModalOpen}>
                        Assign Cab Stickers
                      </button>
                      <div className="dropdown-content">
                        {!!mva?.length &&
                          mva.map((mr, idx) => (
                            <MenuItem key={idx} value={mr}>
                              {mr}
                            </MenuItem>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ minWidth: "180px" }} className="mx-4">
                    <div className="dropdown">
                      <button className="dropbtn">Upload Cab Allocation</button>
                      <div className="dropdown-content">
                        {!!mca?.length &&
                          mca.map((mr, idx) => (
                            <MenuItem key={idx} value={mr}>
                              {mr}
                            </MenuItem>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ minWidth: "180px" }} className="mx-4">
                    <div className="dropdown">
                      <button className="dropbtn">Download</button>
                      <div className="dropdown-content">
                        {!!downloadTripList?.length &&
                          downloadTripList.map((list, idx) => (
                            <MenuItem key={idx} value={list}>
                              {list}
                            </MenuItem>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <GridNew
              data={data}
              headers={headers}
              setShowAction={(flag, row) => selectedRowHandler(flag, row)}
            />
          </div>

        <Modal
            open={openModal}
            onClose={handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
                <CabStickerModal
                  data={selectedRow}
                  onClose={handleModalClose}
                  selectedDate={searchValues.date}
                  dummy={false}
                />
            </Box>
          </Modal>
        </div>
      ) : (
        <RouteEditor
          shiftId={selectedRow.shiftId}
          selectedDate={searchValues.date}
        />
        // <TripEditor />
      )}    
    </div>
    
  );
};

export default dispatch(MainComponent);
