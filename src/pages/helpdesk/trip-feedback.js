import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
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
import { useDispatch } from "react-redux";
import helpdesk from "@/layouts/helpdesk";
import TripFeedbackTable from "@/components/helpdesk/tripFeedbackTable";
import TripFeedbackModal from "@/components/helpdesk/tripFeedbackModal";
import TripService from "@/services/trip.service";

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
    tripDateStr: moment().format("YYYY-MM-DD"),
    rating: "",
    email: "",
  });
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({
    page: 0,
    size: 100,
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [isSearchUser, setIsSearchUser] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowCurrentSatus, setRowCurrentStatus] = useState("");
  const [selectedUserEmail, setSelectedUserEmail] = useState();
  const [feedbackId, setFeedbackId] = useState("");
  // const [feedbackStatus, setFeedbackStatus] = useState("");

  const rating = ["1", "2", "3", "4", "5"];

  const onChangeHandler = (val) => {
    console.log(val);
    if (val?.empId) {
      setSelectedUsers([val.data]);
      const email = val.data;
      if (email) {
        setSearchValues((prevValues) => ({
          ...prevValues,
          email: email,
        }));
      } else {
        console.error("Email is undefined");
      }
      setSelectedUserEmail(val.empId);
    } else {
      setSelectedUsers([]);
      setSearchValues((prevValues) => ({
        ...prevValues,
        email: "",
      }));
      setSelectedUserEmail(null);
    }
  };

  const handleChangeStatusClick = () => {
    if (selectedRow) {
      setOpenModal(true);
      setRowCurrentStatus(selectedRow.feedbackStatus);
      console.log("current status>>>", rowCurrentSatus);
      console.log("Trip feedback modal is opened");
    } else {
      setSelectedRow(null);
      setRowCurrentStatus("");
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

  const handleRowsSelected = (selectedRowDetails) => {
    setSelectedRow(() => selectedRowDetails);
    console.log("selected feedback ID: ", selectedRowDetails?.id);
    setFeedbackId(selectedRowDetails?.id);
  };

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    let newSearchValues = { ...searchValues };
    if (name === "tripDateStr")
      newSearchValues[name] = value.format("YYYY-MM-DD");
    else newSearchValues[name] = value;
    setSearchValues(newSearchValues);
  };

  const fetchAllOffices = async () => {
    try {
      const response = await OfficeService.getAllOffices();
      const { data } = response || {};
      const { clientOfficeDTO } = data || {};
      console.log(clientOfficeDTO);
      setOffice(clientOfficeDTO);
    } catch (e) {}
  };

  const resetFilter = () => {
    let allSearchValue = {
      officeId: "",
      tripDateStr: moment().format("YYYY-MM-DD"),
      rating: "",
      email: "",
    };
    setSearchValues(allSearchValue);
  };

  const fetchSummary = async () => {
    try {
      let params = new URLSearchParams(pagination);
      console.log("Search values>>>", searchValues);
      let allSearchValues = { ...searchValues };
      Object.keys(allSearchValues).forEach((objKey) => {
        if (
          allSearchValues[objKey] === null ||
          allSearchValues[objKey] === ""
        ) {
          delete allSearchValues[objKey];
        }
      });
      const response = await TripService.getFeedbackSearchByBean(
        params,
        allSearchValues
      );
      console.log("feedback response data", response.data.data);
      setList(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateFeedbackStatus = async (newStatus) => {
    // console.log("New Status>>>", newStatus);
    try {
      console.log("New Status>>>", newStatus);
      const response = await TripService.tripFeedbackUpdateStatus(
        feedbackId,
        newStatus
      );
      console.log("Updated status response data", response);
      if (response.status === 200) {
        fetchSummary();
      }
      if (response.status === 500) {
        dispatch(
          toggleToast({
            message: "Failed! Try again later.",
            type: "error",
          })
        );
      }
    } catch (err) {
      console.log("Error updating feedback status", err);
    }
  };

  useEffect(() => {
    console.log("list>>>", list);
  }, [list]);

  useEffect(() => {
    fetchAllOffices();
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [pagination, searchValues]);

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
        <div className="filterContainer" style={{ flexWrap: "wrap" }}>
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
                name="tripDateStr"
                format={DATE_FORMAT}
                value={
                  searchValues.tripDateStr
                    ? moment(searchValues.tripDateStr)
                    : null
                }
                onChange={(e) =>
                  handleFilterChange({
                    target: { name: "tripDateStr", value: e },
                  })
                }
              />
            </LocalizationProvider>
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
              name="email"
              sx={{
                "& .MuiOutlinedInput-root": {
                  // padding: "7px 9px",
                  // height: "54px",
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search employee by ID"
                  onChange={searchForRM}
                  // size="medium"
                  style={{ backgroundColor: "#fff" }}
                />
              )}
            />
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
              <TripFeedbackModal
                onClose={handleModalClose}
                currentStatus={rowCurrentSatus}
                statusUpdated={updateFeedbackStatus}
              />
            </Box>
          </Modal>
        </div>
        <TripFeedbackTable
          list={list}
          onRowsSelected={(row) => handleRowsSelected(row)}
        />
      </div>
    </div>
  );
};

export default helpdesk(MainComponent);
