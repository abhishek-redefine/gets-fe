import dispatch from "@/layouts/dispatch";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
} from "@mui/material";
import Menu from "@mui/material/Menu";
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
import ReplicateTripModal from "@/components/dispatch/replicateTripModal";
import RouteEditor from "@/components/dispatch/route-editor";
import TripEditor from "@/components/dispatch/tripEditor";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import { useRouter } from "next/router";
import TripEditorNew from "@/components/dispatch/tripEditorNew";
import { toggleToast } from "@/redux/company.slice";
import TripEditor2 from "@/components/dispatch/tripEditor2";
// import TripEditorManual from "@/components/dispatch/tripEditor-pq";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  height: 650,
  borderRadius: 5,
};

const Routing = () => {
  const router = useRouter();
  const headers = [
    { field: "officeId", checkboxSelection: true },
    { field: "shiftType" },
    { field: "shiftTime" },
    { field: "bookingCount" },
    { field: "routingStatus" },
    { field: "dispatchStatus" },
    { field: "tripCount",
      cellRenderer: (params) => {
        const tripCount = params.value;

        const handleClick = () => {
          //clicked cell row data
          console.log(params.node.data);
        };

        return (
          <div style={{ cursor: 'pointer', textDecoration: 'underline', color: "blue"}} onClick={handleClick}>
            {tripCount}
          </div>
        );
      }
    },
    { field: "allocatedVendorCount" },
    { field: "allocatedCabCount" },
    { field: "fleetMix" },
    { field: "allocatedEscortCount" },
    { field: "backToBackCount" },
    { field: "smsSent" },
  ];
  const [offices, setOffice] = useState([]);
  const [searchValues, setSearchValues] = useState({
    officeId: "",
    date: moment().format("YYYY-MM-DD"),
    shiftType: "",
  });
  const [mrList, setMrList] = useState([
    {
      key: 1,
      value: "Generate Trips",
    },
    {
      key: 2,
      value: "Replicate Trips",
    },
    {
      key: 3,
      value: "Download Trips",
    },
    // {
    //   key: 4,
    //   value: "Upload Trips",
    // },
    {
      key: 5,
      value: "Generate Dummy Trips",
    },
    {
      key: 6,
      value: "Delete Trips",
    },
  ]);
  const [mb2b, setMb2b] = useState([
    // "Auto Generate B2B",
    "Manaual B2B Routes",
    "Delete B2B Mapping",
  ]);
  const [mva, setMva] = useState([
    // "Auto Vendor Allocation",
    "Allocate Vendors",
  ]);
  const [mca, setMca] = useState([
    "Allocate Cabs",
    "Download Cab Allocation",
    "Upload Cab Allocation",
    "Assign Cab Sticker",
  ]);
  const [downloadTripList, setDownloadTripList] = useState([
    "Download Tripsheet",
    "Download Trip Summary",
  ]);
  const [autoSuggestType, setAutoSuggestType] = useState([
    { name: "Vehicle", value: "vehicle" },
    { name: "Employee Name", value: "employee" },
    { name: "Trip Id", value: "tripId" },
    { name: "Vendor Name", value: "vendorName" },
  ]);
  const [searchBy, setSearchBy] = useState("vehicle");
  const [searched, setSearched] = useState([]);
  const [openSearch, setOpenSearch] = useState(false);
  const [searchValue, setSearchedValue] = useState("");
  const [showAction, setShowAction] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [showGenerateTrip, setShowGenerateTrip] = useState(false);
  const [manageTrip, setManageTrip] = useState();
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [routeEditorShow, setRouteEditorShow] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const searchByChangeHandler = (event) => {
    const { target } = event;
    const { value, name } = target;
    setSearchBy(value);
  };

  const autoSuggestSearch = async (e) => {
    const { target } = e;
    const { name, value } = target;
    console.log(value, searchBy);
    try {
      if (searchBy === "vehicle") {
      } else if (searchBy === "employee") {
      } else if (searchBy === "tripId") {
      } else if (searchBy === "vendorName") {
      }
    } catch (err) {
      console.log(err);
    }
  };

  const { ShiftType: shiftTypes } = useSelector((state) => state.master);

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
  const generateTripHandler = () => {
    handleModalOpen();
  };
  const replicateTripModal = () => {
    handleModalOpen();
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

  const manageTripHandler = (key, value) => {
    console.log(key, value, selectedRow);
    switch (key) {
      case 1:
        setManageTrip(1);
        generateTripHandler();
        break;
      case 2:
        setManageTrip(2);
        generateTripHandler();
        break;
      case 3:
        downloadTrip();
        break;
      case 5:
        setManageTrip(5);
        generateTripHandler();
        break;
      case 6:
        6;
        getAllTrips();
        break;
    }
  };

  const getAllTrips = async () => {
    try {
      const queryParams = {
        shiftId: selectedRow.shiftId,
        tripDate: searchValues.date,
      };
      const params = new URLSearchParams(queryParams);
      const response = await DispatchService.getTripByShiftIdAndTripDate(
        params
      );
      console.log(response.data);
      var data = response?.data;
      var flag = false;
      var tripIds = [];
      data.map((val, index) => {
        tripIds.push(val.id);
      });
      deleteTrip(tripIds);
      // setTripData(response.data);
      //await getTripsMember(response.data);
    } catch (er) {
      console.log(er);
    }
  };

  const deleteTrip = async (tripId) => {
    try {
      const response = DispatchService.deleteTrip(tripId);
      console.log(response.data);
      if (response.status === 200) {
        dispatch(
          toggleToast({
            message: "Trips deleted successfully!",
            type: "success",
          })
        );
        return true;
      }
    } catch (err) {
      console.log(err);
      dispatch(
        toggleToast({
          message: "Trips deleted successfully!",
          type: "success",
        })
      );
    }
  };
  const downloadTrip = async () => {
    try {
      const shiftId = selectedRow.shiftId;
      const selectedDate = searchValues.date;
      console.log(shiftId, selectedDate);
      const response = await DispatchService.downloadTrip(
        shiftId,
        selectedDate
      );
      const data = await response.data;
      console.log(typeof data);
      const byteArray = new Uint8Array(data);
      console.log(byteArray);
      const blob = new Blob([byteArray], {
        type: "application/octet-stream",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `trips${selectedDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
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
      officeId: offices[0].officeId,
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
            {offices.length > 0 && (
              <div style={{ minWidth: "180px" }} className="form-control-input">
                <FormControl fullWidth>
                  <InputLabel id="primary-office-label">
                    Primary Office
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
                    {!!offices?.length &&
                      offices.map((office, idx) => (
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
            {/* <div className="filterContainer">
            <div style={{ minWidth: "160px" }} className="form-control-input">
              <FormControl fullWidth>
                <InputLabel id="shiftType-label">Search By</InputLabel>
                <Select
                  style={{ width: "160px" }}
                  labelId="shiftType-label"
                  id="shiftType"
                  name="shiftType"
                  value={searchBy}
                  label="Shift Type"
                  onChange={searchByChangeHandler}
                >
                  {autoSuggestType.map((sT, idx) => (
                    <MenuItem key={idx} value={sT.value}>
                      {sT.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="form-control-input">
              <FormControl variant="outlined">
                <Autocomplete
                  disablePortal
                  id="search-team"
                  options={searched}
                  autoComplete
                  open={openSearch}
                  onOpen={() => {
                    setOpenSearch(true);
                  }}
                  onClose={() => {
                    setOpenSearch(false);
                  }}
                  onChange={(e, val) => setSearchValues(val)}
                  getOptionKey={(item) => item.itemId}
                  getOptionLabel={(item) => item.itemName}
                  freeSolo
                  name="team"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search"
                      onChange={autoSuggestSearch}
                    />
                  )}
                />
              </FormControl>
            </div>
            <div className="form-control-input" style={{ minWidth: "70px" }}>
              <button
                type="submit"
                //onClick={searchBookings}
                className="btn btn-primary filterApplyBtn"
              >
                Search
              </button>
            </div>
          </div> */}
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
              <div className="d-flex" style={{ alignItems: "center" }}>
                <h3 style={{ paddingLeft: 10 }}>Dispatch Summary</h3>
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
                      <button className="dropbtn">Manage Trips</button>
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
                        <MenuItem
                          onClick={() => {
                            const fileInput = document.createElement("input");
                            fileInput.type = "file";
                            fileInput.accept = ".xlsx";
                            fileInput.onchange = (e) => {
                              const file = e.target.files[0];
                              setSelectedFile(file);
                            };
                            fileInput.click();
                          }}
                        >
                          Upload Trips
                        </MenuItem>
                      </div>
                    </div>
                  </div>
                  <div style={{ minWidth: "180px" }} className="mx-4">
                    <div className="dropdown">
                      <button className="dropbtn">
                        Manage Back to Back Routes
                      </button>
                      <div className="dropdown-content">
                        {!!mb2b?.length &&
                          mb2b.map((mr, idx) => (
                            <MenuItem
                              key={idx}
                              value={mr}
                              onClick={() => {
                                if (idx === 1) {
                                  router.push("B2B-routing");
                                }
                              }}
                            >
                              {mr}
                            </MenuItem>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ minWidth: "180px" }} className="mx-4">
                    <div className="dropdown">
                      <button className="dropbtn">
                        Manage Vendor Allocation
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
                      <button className="dropbtn">Manage Cab Allocation</button>
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
                      <button className="dropbtn">Download Trip Sheets</button>
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
              {manageTrip === 1 ? (
                <GenerateTripModal
                  data={selectedRow}
                  onClose={handleModalClose}
                  selectedDate={searchValues.date}
                  dummy={false}
                />
              ) : manageTrip === 2 ? (
                <ReplicateTripModal
                  onClose={handleModalClose}
                  data={selectedRow}
                  date={searchValues.date}
                />
              ) : manageTrip === 5 ? (
                <GenerateTripModal
                  data={selectedRow}
                  onClose={handleModalClose}
                  selectedDate={searchValues.date}
                  dummy={true}
                  officeData={offices}
                  shiftTypes={shiftTypes}
                />
              ) : (
                <></>
              )}
            </Box>
          </Modal>
        </div>
      ) : (
        // <RouteEditor
        //   edit={(flag) => setRouteEditorShow(flag)}
        //   shiftId={selectedRow.shiftId}
        //   selectedDate={searchValues.date}
        // />
        // <TripEditor
        //   edit={(flag) => setRouteEditorShow(flag)}
        //   shiftId={selectedRow.shiftId}
        //   selectedDate={searchValues.date}
        // />
        // <TripEditorNew
        //   edit={(flag) => setRouteEditorShow(flag)}
        //   shiftId={selectedRow.shiftId}
        //   selectedDate={searchValues.date}
        // />
        <TripEditor2
          edit={(flag) => setRouteEditorShow(flag)}
          shiftId={selectedRow.shiftId}
          selectedDate={searchValues.date}
        />
        // <TripEditorManual/>
      )}
    </div>
  );
};

export default dispatch(Routing);
