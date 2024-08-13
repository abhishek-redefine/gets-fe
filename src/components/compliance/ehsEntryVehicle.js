import React, { useEffect, useState } from "react";
import Grid from "@/components/grid";
import ComplianceService from "@/services/compliance.service";
import { useDispatch } from "react-redux";
import AddEhsEntryVehicle from "./addEhsEntryVehicle";
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
import LoaderComponent from "../common/loading";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  height: 600,
};

const EhsEntryVehicle = ({
  EhsVehicleData,
  ehsStatusList,
  setEhsVehicleOpen,
}) => {
  console.log("EhsEntryVehicle", EhsVehicleData);
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
      display: "Ehs done by",
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
  console.log("EhsEntryVehicle", EhsVehicleData);
  const [editEhsEntryVehicleOpen, setEditEhsEntryVehicleOpen] = useState(false);
  const [editEhsEntryVehicle, setEditEhsEntryVehicle] = useState(false);
  const [ehsVehicleData, setEhsVehicleData] = useState([]);
  const [ehsStatus, setEhsStatus] = useState("");
  const [searchDate, setSearchDate] = useState(moment());
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
  });
  const [searchBean, setSearchBean] = useState({
    createdDate: "",
    ehsStatus: "",
    entityId: EhsVehicleData.id,
  });

  const [documentUrl, setDocumentUrl] = useState();
  const [noFile, setNoFile] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [loading, setLoading] = useState(false);

  const onMenuItemClick = async (key, clickedItem) => {
    if (key === "view") {
      if (clickedItem?.ehsFileUrl != "") {
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
      setLoading(true);
      var date = moment(searchDate).format("YYYY-MM-DD");
      let params = new URLSearchParams(pagination);
      var filter = { ...searchBean };
      filter.createdDate = date;
      filter.ehsStatus = ehsStatus;
      console.log(filter);
      Object.keys(filter).forEach((objKey) => {
        if (filter[objKey] === null || filter[objKey] === "") {
          delete filter[objKey];
        }
      });
      const response = !resetFlag
        ? await ComplianceService.getEhsHistoryByVehicleId(
            params.toString(),
            filter
          )
        : await ComplianceService.getEhsHistoryByVehicleId(params.toString(), {
            createdDate: date,
            entityId: EhsVehicleData.id,
          });
      console.log(response.data.data);
      setEhsVehicleData(response.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const initializer = async () => {
    try {
    } catch (e) {}
  };

  useEffect(() => {
    initializer();
  }, []);

  return (
    <div>
      <div className="internalSettingContainer">
        {!editEhsEntryVehicleOpen && (
          <div>
            <h4 className="pageSubHeading">Vehicle Summary</h4>
            <div className="addUpdateFormContainer">
              <div>
                <div className="form-control-input">
                  <div style={{ fontWeight: "700" }}>Vehicle Id</div>
                  <div>{EhsVehicleData.vehicleId}</div>
                </div>
                <div className="form-control-input">
                  <div style={{ fontWeight: "700" }}>Vehicle Make</div>
                  <div>{EhsVehicleData.vehicleMake}</div>
                </div>
                <div className="form-control-input">
                  <div style={{ fontWeight: "700" }}>Vehicle Model</div>
                  <div>{EhsVehicleData.vehicleModel}</div>
                </div>
                <div className="form-control-input">
                  <div style={{ fontWeight: "700" }}>Vehicle Owner Name</div>
                  <div>{EhsVehicleData.vehicleOwnerName}</div>
                </div>
              </div>
              <div>
                <div className="form-control-input">
                  <div style={{ fontWeight: "700" }}>Fuel Type</div>
                  <div>{EhsVehicleData.fuelType}</div>
                </div>
                <div className="form-control-input">
                  <div style={{ fontWeight: "700" }}>Induction Date</div>
                  <div>{EhsVehicleData.inductionDate}</div>
                </div>
                <div className="form-control-input">
                  <div style={{ fontWeight: "700" }}>Manufacturing Date</div>
                  <div>{EhsVehicleData.manufacturingDate}</div>
                </div>
                <div className="form-control-input">
                  <div style={{ fontWeight: "700" }}>Status</div>
                  <div>{EhsVehicleData.complianceStatus}</div>
                </div>
              </div>
              <div>
                <div className="form-control-input">
                  <div style={{ fontWeight: "700" }}>EHS Status</div>
                  <div>{EhsVehicleData.ehsStatus}</div>
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
                  onClick={searchEhsHistory}
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
                    searchEhsHistory(true);
                    setEhsStatus("");
                    setEhsVehicleOpen(false);
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
                listing={ehsVehicleData}
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
        {editEhsEntryVehicleOpen && (
          <AddEhsEntryVehicle
            EditEhsEntryVehicle={editEhsEntryVehicle}
            VehicleId={EhsVehicleData.id}
            UpdateId={
              editEhsEntryVehicle.specialId !== ""
                ? editEhsEntryVehicle.specialId
                : false
            }
          />
        )}
      </div>
      {loading ? (
        <div
          style={{
            position: "absolute",
            // backgroundColor: "pink",
            zIndex: "1",
            top: "55%",
            left: "50%",
          }}
        >
          <LoaderComponent />
        </div>
      ) : (
        " "
      )}
    </div>
  );
};

export default EhsEntryVehicle;
