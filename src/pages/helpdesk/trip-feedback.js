import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Autocomplete,
  TextField,
  Modal,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { getFormattedLabel } from "@/utils/utils";
import { DATE_FORMAT, MASTER_DATA_TYPES } from "@/constants/app.constants.";
import OfficeService from "@/services/office.service";
import { useDispatch, useSelector } from "react-redux";
import helpdesk from "@/layouts/helpdesk";
import { setMasterData } from "@/redux/master.slice";
import MasterDataService from "@/services/masterdata.service";
import DispatchService from "@/services/dispatch.service";
import TripFeedbackTable from "@/components/helpdesk/tripFeedbackTable";
import TripFeedbackModal from "@/components/helpdesk/tripFeedbackModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  bgcolor: "background.paper",
  height: "auto",
  borderRadius: 5,
};

const MainComponent = () => {
  const [office, setOffice] = useState([]);
  const [searchValues, setSearchValues] = useState({
    officeId: "",
    shiftType: "",
    date: moment().format("YYYY-MM-DD"),
    team: "",
    rating: "",
  });
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({
    page: 0,
    size: 100,
  });

  const { ShiftType: shiftTypes } = useSelector((state) => state.master);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [isSearchUser, setIsSearchUser] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowCurrentSatus, setRowCurrentStatus] = useState("");

  const team = ["IT", "Sales", "Accounts"];

  const rating = ["1", "2", "3", "4", "5"];

  const onChangeHandler = (val) => {
    console.log("val>>>", val);
    if (val?.empId) {
      setSelectedUsers([val.data]);
      //   console.log("selcted users: ", [val.data]);
      setSelectedEmployeeId(val.empId);
      //   console.log("Saved Employee ID: ", val.empId);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleChangeStatusClick = () => {
    if (selectedRow) {
      setOpenModal(true);
      setRowCurrentStatus(selectedRow.status);
      console.log("Trip feedback modal is opened");
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    console.log("Trip feedback modal is closed");
  };

  const searchForRM = async (e) => {
    try {
      const response = await OfficeService.searchRM(e.target.value);
      const { data } = response || {};
      setSearchedUsers(data);
      console.log("serched users", searchedUsers);
    } catch (e) {
      console.error(e);
    }
  };

  const onSearchHandler = () => {
    console.log("Search button clicked");
  };

  const handleRowsSelected = (selectedRowId) => {
    setSelectedRow(selectedRowId);
    console.log("selected row employee ID: ", selectedRowId.empId);
  };

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    let newSearchValues = { ...searchValues };
    if (name === "date") newSearchValues[name] = value.format("YYYY-MM-DD");
    else newSearchValues[name] = value;
    setSearchValues(newSearchValues);
    console.log("New search values: ", JSON.stringify(newSearchValues));
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
      team: "",
      rating: "",
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
      const response = await DispatchService.getTripSearchByBean(
        params,
        allSearchValues
      );
      console.log("response data", response.data.data);
      const data = [
        {
          officeId: "HCLND001",
          empId: 1001,
          empName: "Raja",
          shiftType: "Login",
          shiftTime: "09:30",
          teamName: "IT",
          tripId: "Trip001",
          rating: 3,
          status: "Pending",
        },
        {
          officeId: "HCLND002",
          empId: 1002,
          empName: "Mohan",
          shiftType: "Login",
          shiftTime: "10:30",
          teamName: "Sales",
          tripId: "Trip002",
          rating: 2,
          status: "In Progress",
        },
        {
          officeId: "HCLND003",
          empId: 1003,
          empName: "Seeta",
          shiftType: "Login",
          shiftTime: "11:30",
          teamName: "Accounts",
          tripId: "Trip003",
          rating: 4,
          status: "Close",
        },
      ];
      //   setList(response.data.data);
      setList(data);
      var requestType = data[0].requestType;
      console.log("requestType>>>", requestType);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log("list>>>", list);
  }, [list]);

  useEffect(() => {
    if (!shiftTypes?.length) {
      fetchMasterData(MASTER_DATA_TYPES.SHIFT_TYPE);
    }
    fetchAllOffices();
  }, []);

  useEffect(() => {
    console.log("selcted users: ", selectedUsers);
  }, [selectedUsers]);

  useEffect(() => {
    console.log("Saved Employee ID: ", selectedEmployeeId);
  }, [selectedEmployeeId]);

  return (
    <div>
      <div
        style={{
          backgroundColor: "#f9f9f9",
          borderRadius: "10px",
          margin: "30px 0",
          padding: "0 13px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            // backgroundColor: "yellow"
          }}
        >
          <div className="filterContainer" style={{}}>
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

            <div
              style={{ minWidth: "160px", backgroundColor: "white" }}
              className="form-control-input"
            >
              <FormControl fullWidth>
                <InputLabel id="team-label">Team</InputLabel>
                <Select
                  style={{ width: "180px", backgroundColor: "white" }}
                  labelId="team-label"
                  id="team"
                  name="team"
                  value={searchValues.team}
                  label="Team"
                  onChange={handleFilterChange}
                >
                  {team.map((item) => (
                    <MenuItem key={item} value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div
              style={{ minWidth: "160px", backgroundColor: "white" }}
              className="form-control-input"
            >
              <FormControl fullWidth>
                <InputLabel id="rating-label">Rating</InputLabel>
                <Select
                  style={{ width: "180px", backgroundColor: "white" }}
                  labelId="rating-label"
                  id="rating"
                  name="rating"
                  value={searchValues.rating}
                  label="Rating"
                  onChange={handleFilterChange}
                >
                  {rating.map((item) => (
                    <MenuItem value={item}>{item}</MenuItem>
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
        </div>
        <div
          className="filterContainer"
          style={{
            // backgroundColor: "yellow",
            height: "120px",
            display: "flex",
            justifyContent: "flex-start",
            // backgroundColor: "pink"
          }}
        >
          <div
            style={{
              width: "300px",
              borderRadius: "6px",
              // backgroundColor: "pink",
            }}
            className="form-control-input"
          >
            <Autocomplete
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  // padding: "7px 9px",
                  // height: "54px",
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search by employee ID / name"
                  onChange={searchForRM}
                  // size="medium"
                  style={{ backgroundColor: "#fff" }}
                />
              )}
            />
          </div>

          <div className="form-control-input" style={{ minWidth: "90px" }}>
            <button
              type="search"
              onClick={onSearchHandler}
              className="btn btn-primary filterApplyBtn"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#f9f9f9",
          borderRadius: "6px",
          padding: "25px 20px",
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
          <h3>Trip Feedback Summary</h3>
          <div style={{ display: "flex" }}>
            <button
              className="btn btn-primary"
              style={{
                width: "140px",
                padding: "10px",
                margin: "0 10px",
              }}
              onClick={handleChangeStatusClick}
            >
              Change Status
            </button>
          </div>
          <Modal
            open={openModal}
            onClose={handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <TripFeedbackModal onClose={handleModalClose} currentStatus={rowCurrentSatus} />
            </Box>
          </Modal>
        </div>
        <TripFeedbackTable list={list} onRowsSelected={handleRowsSelected} />
      </div>
    </div>
  );
};

export default helpdesk(MainComponent);
