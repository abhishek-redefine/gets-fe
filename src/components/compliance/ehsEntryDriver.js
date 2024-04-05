import React, { useEffect, useState } from "react";
import Grid from "@/components/grid";
import ComplianceService from "@/services/compliance.service";
import { useDispatch } from "react-redux";
import AddEhsEntryDriver from "./addEhsEntryDriver";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import moment from "moment";
import IframeComponent from "../iframe/Iframe";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  height: 600,
};

const EhsEntryDriver = ({ EhsDriverData, ehsStatusList, SetEhsDriverOpen }) => {
  console.log("EhsEntryDriver", EhsDriverData);
  const headers = [
    {
      key: "ehsTitle",
      display: "Ehs Name",
    },
    {
      key: "ehsMandatoryStatus",
      display: "Mandatory Status",
    },
    {
      key: "ehsFrequency",
      display: "Frequency",
    },

    {
      key: "ehsStatus",
      display: "EHS Status",
    },
    {
      key: "ehsDueDate",
      display: "EHS Due Date",
    },
    {
      key: "remarks",
      display: "Remarks",
    },
    {
      key: "updatedBy",
      display: "Ehs done By",
    },
    {
      key: "hamburgerMenu",
      html: (
        <>
          <span className="material-symbols-outlined">more_vert</span>
        </>
      ),
      navigation: true,
      menuItems: [
        {
          display: "View Image",
          key: "view",
        },
      ],
    },
  ];

  const dispatch = useDispatch();

  const [editEhsEntryDriverOpen, setEditEhsEntryDriverOpen] = useState(false);
  const [editEhsEntryDriver, setEditEhsEntryDriver] = useState(false);
  const [ehsStatus, setEhsStatus] = useState("");
  const [ehsDriverData, setEhsDriverData] = useState();
  const [searchDate, setSearchDate] = useState(moment());
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
  });
  const [searchBean, setSearchBean] = useState({
    createdDate: "",
    ehsStatus: "",
    entityId: EhsDriverData.id,
  });

  const [documentUrl, setDocumentUrl] = useState();
  const [noFile, setNoFile] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onMenuItemClick = async (key, clickedItem) => {
    if (key === "view") {
      if (clickedItem?.ehsFileUrl) {
        setNoFile(false);
        setDocumentUrl(clickedItem?.ehsFileUrl.replace("gets-dev.", ""));
        handleOpen();
      } else {
        setNoFile(true);
        setDocumentUrl("");
        handleOpen();
      }
    }
  };

  const searchEhsHistory = async (resetFlag = false) => {
    try {
      var date = moment(searchDate).format("YYYY-MM-DD");
      let params = new URLSearchParams(pagination);
      var filter = { ...searchBean };
      filter.createdDate = date;
      filter.ehsStatus = ehsStatus;
      Object.keys(filter).forEach((objKey) => {
        if (filter[objKey] === null || filter[objKey] === "") {
          delete filter[objKey];
        }
      });
      console.log(filter, resetFlag);
      const response = !resetFlag
        ? await ComplianceService.getEhsHistoryByDriverId(
            params.toString(),
            filter
          )
        : await ComplianceService.getEhsHistoryByDriverId(params.toString(), {
            createdDate: date,
            entityId: EhsDriverData.id,
          });
      console.log(response.data.data);
      setEhsDriverData(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const initializer = async () => {
    try {
      //   var url =
      //     "http://localhost:8010/api/v1/ehs/inspection/driver/4/history/2024-04-03";
      //   const response = await ComplianceService.getEhsHistoryByDriverId;
    } catch (e) {}
  };

  useEffect(() => {
    initializer();
  }, []);

  return (
    <div className="internalSettingContainer">
      {!editEhsEntryDriverOpen && (
        <div>
          <h4 className="pageSubHeading">User Summary</h4>
          <div className="addUpdateFormContainer">
            <div>
              <div className="form-control-input">
                <div style={{ fontWeight: "700" }}>Name</div>
                <div>{EhsDriverData.name}</div>
              </div>
              <div className="form-control-input">
                <div style={{ fontWeight: "700" }}>Vendor</div>
                <div>{EhsDriverData.vendorName}</div>
              </div>
              <div className="form-control-input">
                <div style={{ fontWeight: "700" }}>Driver Id</div>
                <div>{EhsDriverData.id}</div>
              </div>
              <div className="form-control-input">
                <div style={{ fontWeight: "700" }}>Office Id</div>
                <div>{EhsDriverData.officeId}</div>
              </div>
            </div>
            <div>
              <div className="form-control-input">
                <div style={{ fontWeight: "700" }}>License No.</div>
                <div>{EhsDriverData.licenseNo}</div>
              </div>
              <div className="form-control-input">
                <div style={{ fontWeight: "700" }}>Phone No.</div>
                <div>{EhsDriverData.mobile}</div>
              </div>
              <div className="form-control-input">
                <div style={{ fontWeight: "700" }}>Gender</div>
                <div>{EhsDriverData.gender}</div>
              </div>
              <div className="form-control-input">
                <div style={{ fontWeight: "700" }}>Status</div>
                <div>{EhsDriverData.complianceStatus}</div>
              </div>
            </div>
            <div>
              <div className="form-control-input">
                <div style={{ fontWeight: "700" }}>EHS Status</div>
                <div>{EhsDriverData.ehsStatus}</div>
              </div>
            </div>
          </div>
          <div className="filterContainer">
            <div className="form-control-input">
              <InputLabel>EHS Date</InputLabel>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  name="ehsDate"
                  format={"DD-MM-YYYY"}
                  value={searchDate}
                  onChange={(e) => {
                    var newDate = moment(e);
                    setSearchDate(newDate);
                  }}
                />
              </LocalizationProvider>
            </div>
            <div style={{ minWidth: "180px" }} className="form-control-input">
              <FormControl fullWidth>
                <InputLabel id="ehs-status-label">EHS Status</InputLabel>
                <Select
                  style={{ width: "180px" }}
                  labelId="ehs-status-label"
                  id="ehsStatusId"
                  value={ehsStatus}
                  name="ehsStatusId"
                  label="EHS Status"
                  onChange={(e) => setEhsStatus(e.target.value)}
                >
                  {!!ehsStatusList?.length &&
                    ehsStatusList.map((status, idx) => (
                      <MenuItem key={idx} value={status.value}>
                        {status.displayName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
            <div className="form-control-input" style={{ minWidth: "70px" }}>
              <button
                type="submit"
                onClick={() => searchEhsHistory(false)}
                className="btn btn-primary filterApplyBtn"
              >
                Search
              </button>
            </div>
            <div className="form-control-input" style={{ minWidth: "70px" }}>
              <button
                type="submit"
                onClick={() => {
                  searchEhsHistory(true);
                  setEhsStatus("");
                }}
                className="btn btn-primary filterApplyBtn"
              >
                Reset
              </button>
            </div>
            <div className="form-control-input" style={{ minWidth: "70px" }}>
              <button
                type="submit"
                onClick={() => {
                  searchEhsHistory(false);
                  setEhsStatus("");
                  SetEhsDriverOpen(false);
                }}
                className="btn btn-primary filterApplyBtn"
              >
                Back
              </button>
            </div>
          </div>
          <div className="gridContainer">
            <Grid
              headers={headers}
              listing={ehsDriverData}
              onMenuItemClick={onMenuItemClick}
            />
          </div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              {noFile ? (
                <div>
                  <h1>No file is present</h1>
                </div>
              ) : (
                <IframeComponent url={documentUrl} />
              )}
            </Box>
          </Modal>
        </div>
      )}
      {/* {editEhsEntryDriverOpen && (
        <AddEhsEntryDriver
          EditEhsEntryDriver={editEhsEntryDriver}
          DriverId={EhsDriverData.id}
          UpdateId={
            editEhsEntryDriver.specialId !== ""
              ? editEhsEntryDriver.specialId
              : false
          }
        />
      )} */}
    </div>
  );
};

export default EhsEntryDriver;
