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

const EhsEntryVehicle = ({ EhsVehicleData }) => {
  console.log("EhsEntryVehicle", EhsVehicleData);
  const headers = [
    {
      key: "ehsTitle",
      display: "Ehs Name",
    },
    {
      key: "ehsMandate",
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
  const [ehsVehicleData, setEhsVehicleData] = useState();
  const [searchDate, setSearchDate] = useState(moment());

  const onMenuItemClick = async (key, clickedItem) => {
    if (key === "addValues") {
      setEditEhsEntryVehicle(clickedItem);
      //setEditEhsEntryVehicleOpen(true);
    }
  };

  const searchEhsHistory = async () => {
    try {
      var date = moment(searchDate).format("YYYY-MM-DD");
      const response = await ComplianceService.getEhsHistoryByVehicleId(
        EhsVehicleData.id,
        date
      );
      console.log(response.data.vehicleEhsHistories);
      setEhsVehicleData(response.data.vehicleEhsHistories);
    } catch (err) {
      console.log(err);
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
            <div className="form-control-input" style={{ minWidth: "70px" }}>
              <button
                type="submit"
                onClick={searchEhsHistory}
                className="btn btn-primary filterApplyBtn"
              >
                Search
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
  );
};

export default EhsEntryVehicle;
