import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { getFormattedLabel } from "@/utils/utils";
import {
  DATE_FORMAT,
  DEFAULT_PAGE_SIZE,
  MASTER_DATA_TYPES,
  SHIFT_TYPE,
} from "@/constants/app.constants.";
import OfficeService from "@/services/office.service";
import { useDispatch, useSelector } from "react-redux";
import dispatch from "@/layouts/dispatch";
import { setMasterData } from "@/redux/master.slice";
import MasterDataService from "@/services/masterdata.service";
import ApprovalsWorkflowTable from "@/components/dispatch/approvals-workflow";
import IssueType from "@/components/dispatch/issueType";
import DispatchService from "@/services/dispatch.service";
import Modal from "@mui/material/Modal";
import IssueTypeModal from "@/components/dispatch/approvalWorkflowModal";

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
  const [office, setOffice] = useState([]);
  const [searchValues, setSearchValues] = useState({
    officeId: "",
    shiftType: "",
    tripDateStr: moment().format("YYYY-MM-DD"),
    tripState: "All",
  });
  const { ShiftType: shiftTypes } = useSelector((state) => state.master);
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({
    page: 0,
    size: 100,
  });
  const [list, setList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => {
    setOpenModal(false);
    fetchSummary();
  };
  const [selectedRow, setSelectedRow] = useState([]);
  const [loading, setLoading] = useState(false);

  // Temprary
  const [showAction, setShowAction] = useState(false);
  const [issueTypeShow, setIssueTypeShow] = useState(false);
  // Temprary

  const issueType = [
    { value: "All", name: "All" },
    { value: "UNASSIGNED", name: "Vehicle Not Assigned" },
    { value: "Not Started", name: "Trip Not Started" },
    { value: "Not Ended", name: "Trip Not Ended" },
  ];

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    console.log(value, name);
    let newSearchValues = { ...searchValues };
    if (name === "tripDateStr")
      newSearchValues[name] = value.format("YYYY-MM-DD");
    else newSearchValues[name] = value;
    console.log(newSearchValues);
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
      tripDateStr: moment().format("YYYY-MM-DD"),
      shiftType: "",
      tripState: "All",
    };
    setSearchValues(allSearchValue);
  };

  const fetchSummary = async () => {
    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
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
      console.log(response.data.data);
      var tripList = [];
      response.data.data.map((item) => {
        let temp = item;
        switch (item.tripState) {
          case "UNASSIGNED":
            temp["tripState"] = "Vehicle Not Assigned";
            break;
          case "ACCEPTED":
            temp["tripState"] = "Trip Not Started";
            break;
          case "ASSIGNED":
            temp["tripState"] = "Trip Not Started";
            break;
          case "ONGOING":
            temp["tripState"] = "Trip Not Started";
            break;
          case "START":
            temp["tripState"] = "Trip Not Ended";
            break;
        }
        console.log(temp);
        tripList.push(temp);
      });
      console.log(tripList);
      setList(response.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const onRowSelect = (row) => {
    setSelectedRow(row);
    console.log("slected row data", row);
  };

  useEffect(() => {
    if (!shiftTypes?.length) {
      fetchMasterData(MASTER_DATA_TYPES.SHIFT_TYPE);
    }
    fetchAllOffices();
  }, []);

  return (
    <div>
      {!issueTypeShow ? (
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
            <div
              style={{ minWidth: "160px", backgroundColor: "white" }}
              className="form-control-input"
            >
              <FormControl fullWidth>
                <InputLabel id="ops-issue-type-label">
                  Ops Issue type
                </InputLabel>
                <Select
                  style={{ width: "180px", backgroundColor: "white" }}
                  labelId="ops-issue-type-label"
                  id="opsIssueType"
                  name="tripState"
                  value={searchValues.tripState}
                  label="Ops Issue type"
                  onChange={handleFilterChange}
                >
                  {issueType.map((item) => (
                    <MenuItem value={item.value}>{item.name}</MenuItem>
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
            {/* Temprary */}
            <div className="form-control-input" style={{ minWidth: "120px" }}>
              <button
                type="issue-type-btn"
                onClick={handleModalOpen}
                className="btn btn-primary filterApplyBtn"
                style={{ width: "120px" }}
              >
                Issue Type
              </button>
            </div>
            {/* <div className="form-control-input" style={{ minWidth: "120px" }}>
          <button
            type="submit"
            onClick={() => setIssueTypeShow(true)}
            className="btn btn-primary filterApplyBtn"
            style={{width: "120px"}}
          >
            Issue Type
          </button>
          </div> */}
          </div>

          <div
            style={{
              padding: "20px 10px",
              backgroundColor: "#f9f9f9",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            <ApprovalsWorkflowTable list={list} onRowSelect={onRowSelect} isLoading={loading} />
          </div>
          <Modal
            open={openModal}
            onClose={handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <IssueTypeModal data={selectedRow} onClose={handleModalClose} />
            </Box>
          </Modal>
        </div>
      ) : (
        <div>
          <IssueType />
        </div>
      )}
    </div>
  );
};

export default dispatch(MainComponent);
