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
import { useDispatch, useSelector } from "react-redux";
import helpdesk from "@/layouts/helpdesk";
import { setMasterData } from "@/redux/master.slice";
import MasterDataService from "@/services/masterdata.service";
import DispatchService from "@/services/dispatch.service";
import ChangeRequestTable from "@/components/helpdesk/changeRequestTable";
import ContactNumberChangeRequestModal from "@/components/helpdesk/contactNoChangeRequestModal";
import AddressChangeRequestModal from "@/components/helpdesk/addressChangeRequestModal";

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
    date: moment().format("YYYY-MM-DD"),
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
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [flag, setFlag] = useState(false);


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
      if (selectedRow.requestType === "Phone") {
        setFlag(true);
        console.log("Request Type is phone");
      } else if (selectedRow.requestType === "Address"){
        setFlag(false);
        console.log("Request Type is address");
      }
      setOpenModal(true);
      console.log("Change Request modal is opened");
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    console.log("Change Request modal is closed");
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
          empId: 1001,
          empName: "Raja",
          teamName: "IT",
          phoneNo: "9988776655",
          requestType: "Phone",
          status: "pending",
        },
        {
          empId: 1002,
          empName: "Mohan",
          teamName: "Sales",
          phoneNo: "9878685848",
          requestType: "Address",
          status: "Approved",
        },
        {
          empId: 1003,
          empName: "Seeta",
          teamName: "Accounts",
          phoneNo: "9745367823",
          requestType: "Phone",
          status: "Rejected",
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f9f9f9",
          borderRadius: "10px",
          margin: "30px 0",
          padding: "0 13px",
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
          className="filterContainer"
          style={{
            // backgroundColor: "yellow",
            height: "120px",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
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
                  height: "52px",
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
          <h3>Change Request Module Summary</h3>
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
              {flag ? (
                <ContactNumberChangeRequestModal onClose={handleModalClose} />
              ) : (
                <AddressChangeRequestModal onClose={handleModalClose} />
              )}
            </Box>
          </Modal>
        </div>
        <ChangeRequestTable list={list} onRowsSelected={handleRowsSelected} />
      </div>
    </div>
  );
};

export default helpdesk(MainComponent);
