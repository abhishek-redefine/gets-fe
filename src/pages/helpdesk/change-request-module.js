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
import { getFormattedLabel } from "@/utils/utils";
import OfficeService from "@/services/office.service";
import { useDispatch } from "react-redux";
import { toggleToast } from "@/redux/company.slice";
import helpdesk from "@/layouts/helpdesk";
import ChangeRequestTable from "@/components/helpdesk/changeRequestTable";
import ContactNumberChangeRequestModal from "@/components/helpdesk/contactNoChangeRequestModal";
import AddressChangeRequestModal from "@/components/helpdesk/addressChangeRequestModal";
import TripService from "@/services/trip.service";
import LoaderComponent from "@/components/loader";

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
    status: "RAISED",
    empName: "",
    empEmail: "",
  });
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({
    page: 0,
    size: 100,
  });
  const [loading, setLoading] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [isSearchUser, setIsSearchUser] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [flag, setFlag] = useState(false);
  const statusTypeOptions = ["RAISED", "APPROVE", "REJECT"];

  const onChangeHandler = (val) => {
    console.log("val>>>", val);
    if (val?.empId) {
      setSelectedUsers([val.data]);
      setSearchValues((prevValues) => ({
        ...prevValues,
        empEmail: val.data,
      }));
    } else {
      setSelectedUsers([]);
      setSearchValues((prevValues) => ({
        ...prevValues,
        empEmail: "",
      }));
    }
  };

  const handleChangeStatusClick = () => {
    if (selectedRow) {
      if (selectedRow.requestType === "mobile") {
        setFlag(true);
        console.log("Request Type is phone");
      } else if (selectedRow.requestType === "address") {
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

  const handleRowsSelected = (selectedRowDetails) => {
    setSelectedRow(() => selectedRowDetails);
    console.log("selected Request ID: ", selectedRowDetails?.id);
  };

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    let newSearchValues = { ...searchValues };
    newSearchValues[name] = value;
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
      status: "RAISED",
      empName: "",
      empEmail: "",
    };
    setSearchValues(allSearchValue);
    setSelectedUsers([]);
    setSearchedUsers([]);
  };

  const fetchSummary = async () => {
    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
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
      const response = await TripService.getChangeRequestSearchByBean(
        params,
        allSearchValues
      );
      console.log("change request list response data", response.data.data);
      setList(response.data.data);
      setSelectedRow(null);
      if (response.status === 500) {
        dispatch(
          toggleToast({
            message: `Failed! Please try again later.`,
            type: "error",
          })
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (newStatus) => {
    try {
      console.log("New Status>>>", newStatus);
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      let payload;
      // if (selectedRow.requestType === "mobile") {
      //   payload = {
      //     id: selectedRow.id,
      //     attemptTime: selectedRow.attemptTime,
      //     empId: selectedRow.empId,
      //     empName: selectedRow.empName,
      //     empEmail: selectedRow.empEmail,
      //     requestType: selectedRow.requestType,
      //     mob: selectedRow.mob,
      //     status: newStatus,
      //     officeId: selectedRow.officeId,
      //   };
      // } else if (selectedRow.requestType === "address") {
      payload = {
        id: selectedRow.id,
        attemptTime: selectedRow.attemptTime,
        empId: selectedRow.empId,
        empName: selectedRow.empName,
        empEmail: selectedRow.empEmail,
        requestType: selectedRow.requestType,
        address: selectedRow.address,
        geoCode: selectedRow.geoCode,
        mob: selectedRow.mob,
        zoneName: selectedRow.zoneName,
        areaName: selectedRow.areaName,
        nodal: selectedRow.nodal,
        landMark: selectedRow.landMark,
        status: newStatus,
        officeId: selectedRow.officeId,
      };
      // }
      const response = await TripService.changeRequestStatus(payload);
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
      console.log("selected row status inside update status>>>", selectedRow);
    } catch (err) {
      console.log("Error updating feedback status", err);
    } finally {
      setLoading(false);
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
  }, []);

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

          <div style={{ minWidth: "160px" }} className="form-control-input">
            <FormControl fullWidth>
              <InputLabel id="statusType-label">Status Type</InputLabel>
              <Select
                style={{ width: "160px", backgroundColor: "white" }}
                labelId="statusType-label"
                id="statusType"
                name="status"
                value={searchValues.status}
                label="Status Type"
                onChange={handleFilterChange}
              >
                {statusTypeOptions.map((item) => (
                  <MenuItem
                    value={item}
                    style={{
                      fontSize: "15px",
                    }}
                  >
                    {item}
                  </MenuItem>
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
                  label="Search by employee email"
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
                <ContactNumberChangeRequestModal
                  onClose={handleModalClose}
                  phoneRequestDetails={selectedRow}
                  updatedStatus={updateRequestStatus}
                />
              ) : (
                <AddressChangeRequestModal
                  onClose={handleModalClose}
                  addressRequestDetails={selectedRow}
                  updatedStatus={updateRequestStatus}
                />
              )}
            </Box>
          </Modal>
        </div>
        <ChangeRequestTable
          list={list}
          onRowsSelected={(row) => handleRowsSelected(row)}
          isLoading={loading}
        />
      </div>
      {/* {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            // backgroundColor: "#000000",
            zIndex: 1,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            opacity: 1,
            color: "#000000",
            // height: "100vh",
            // width: "100vw",
          }}
        >
          <LoaderComponent />
        </div>
      ) : (
        " "
      )} */}
    </div>
  );
};

export default helpdesk(MainComponent);
