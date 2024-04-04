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

const EhsEntryDriver = ({ EhsDriverData }) => {
  console.log("EhsEntryDriver", EhsDriverData);
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
    // {
    //     key: "ehsDueDate",
    //     display: "EHS Due Date"
    // },
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

  const [editEhsEntryDriverOpen, setEditEhsEntryDriverOpen] = useState(false);
  const [editEhsEntryDriver, setEditEhsEntryDriver] = useState(false);
  const [ehsDriverData, setEhsDriverData] = useState();
  const [searchDate, setSearchDate] = useState(moment());

  const onMenuItemClick = async (key, clickedItem) => {
    if (key === "addValues") {
      setEditEhsEntryDriver(clickedItem);
      //setEditEhsEntryDriverOpen(true);
    }
  };

  const searchEhsHistory = async () => {
    try {
      var date = moment(searchDate).format("YYYY-MM-DD");
      const response = await ComplianceService.getEhsHistoryByDriverId(
        EhsDriverData.id,
        date
      );
      console.log(response.data.driverEhsHistories);
      setEhsDriverData(response.data.driverEhsHistories);
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
              listing={ehsDriverData}
              onMenuItemClick={onMenuItemClick}
            />
          </div>
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
