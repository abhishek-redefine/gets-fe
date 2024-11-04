import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { getFormattedLabel } from "@/utils/utils";
import { DATE_FORMAT, MASTER_DATA_TYPES } from "@/constants/app.constants.";
import OfficeService from "@/services/office.service";
import { useDispatch, useSelector } from "react-redux";
import reports from "@/layouts/reports";
import { setMasterData } from "@/redux/master.slice";
import MasterDataService from "@/services/masterdata.service";
import ClickToCallTable from "@/components/reports/clickToCallTable";
import SafeReachVerificationTable from "@/components/reports/safeReachVerificationTable";
import SOSDeviceTable from "@/components/reports/sosDeviceTable";
import VehicleStoppageNoCommunicationTable from "@/components/reports/vehicleStoppageNoCommunicationTable";
import ReportService from "@/services/report.service";
import xlsx from "json-as-xlsx";

const MainComponent = () => {
  const [office, setOffice] = useState([]);
  const [searchValues, setSearchValues] = useState({
    officeId: "",
    shiftType: "",
    date: moment().format("YYYY-MM-DD"),
    reportType: "Click To Call Reports",
  });
  const [clickToCallReport, setClickToCallReport] = useState([]);
  const [safeReachReport, setSafeReachReport] = useState([]);
  const [sosDeviceReport, setSosDeviceReport] = useState([]);
  const [vehicleStoppageReport, setVehicleStoppageReport] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { ShiftType: shiftTypes } = useSelector((state) => state.master);
  const [reportHeading, setReportHeading] = useState("Click To Call Reports");

  const reports = [
    "Click To Call Reports",
    "Safe Reach Verification Reports",
    "SOS Device Reports",
    "Vehicle Stoppage No Communication Reports",
  ];

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
      reportType: "",
    };
    setSearchValues(allSearchValue);
  };

  const fetchSummary = async () => {
    try {
      setLoading(true);
      let allSearchValues = { ...searchValues };
      Object.keys(allSearchValues).forEach((objKey) => {
        if (
          allSearchValues[objKey] === null ||
          allSearchValues[objKey] === ""
        ) {
          delete allSearchValues[objKey];
        }
      });
      if (searchValues.reportType === "Click To Call Reports") {
        setReportHeading("Click To Call Reports");
        // const response = await ReportService.(
        //   allSearchValues
        // );
        // console.log(" data >>>>", response.data);
        // setClickToCallReport(response.data);
      } else if (
        searchValues.reportType === "Safe Reach Verification Reports"
      ) {
        setReportHeading("Safe Reach Verification Reports");
        // const response = await ReportService.(
        //   allSearchValues
        // );
        // console.log(" data >>>>", response.data);
        // setSafeReachReport(response.data);
      } else if (searchValues.reportType === "SOS Device Reports") {
        setReportHeading("SOS Device Reports");
        // const response = await ReportService.(
        //   allSearchValues
        // );
        // console.log(" data >>>>", response.data);
        // setSosDeviceReport(response.data);
      } else if (
        searchValues.reportType === "Vehicle Stoppage No Communication Reports"
      ) {
        setReportHeading("Vehicle Stoppage No Communication Reports");
        // const response = await ReportService.(
        //   allSearchValues
        // );
        // console.log(" data >>>>", response.data);
        // setVehicleStoppageReport(response.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (reportHeading) {
      if (reportHeading && reportHeading === "Click To Call Reports") {
        var data = [
          {
            sheet: reportHeading,
            columns: [
              {
                value: "callID",
                label: "Call ID",
              },
              {
                value: "tripId",
                label: "Trip ID",
              },
              {
                value: "callStatus",
                label: "Call Status",
              },
              {
                value: "vehicleID",
                label: "Vehicle ID",
              },
              {
                value: "employeeID",
                label: "Employee ID",
              },
              {
                value: "employeeName",
                label: "Employee Name",
              },
              {
                value: "gender",
                label: "Gender",
              },
              {
                value: "timeOfCall",
                label: "Time of Call",
              },
              {
                value: "callInitiationLocation",
                label: "Call Initiation Location",
              },
              {
                value: "callDistancefromPickUpPoint",
                label: "Call Distance from Pick-Up Point",
              },
              {
                value: "driverPhoneNumber",
                label: "Driver Phone Number",
              },
              {
                value: "employeePhoneNumber",
                label: "Employee Phone Number",
              },
              {
                value: "callBilledUnits",
                label: "Call Billed Units",
              },
              {
                value: "driverCallDuration",
                label: "Driver Call Duration",
              },
              {
                value: "employeeCallDuration",
                label: "Employee Call Duration",
              },
              {
                value: "callStartTime",
                label: "Call Start Time",
              },
              {
                value: "callEndTime",
                label: "Call End Time",
              },
              {
                value: "driverHangUpCause",
                label: "Driver Hang-Up Cause",
              },
              {
                value: "employeeHangUpCause",
                label: "Employee Hang-Up Cause",
              },
              {
                value: "callLogURL",
                label: "Call Log URL",
              },
              {
                value: "travelledOffice",
                label: "Travelled Office",
              },
            ],
            content: clickToCallReport,
          },
        ];
      } else if (
        reportHeading &&
        reportHeading === "Safe Reach Verification Reports"
      ) {
        var data = [
          {
            sheet: reportHeading,
            columns: [
              {
                value: "facility",
                label: "Facility",
              },
              {
                value: "office",
                label: "Office",
              },
              {
                value: "empId",
                label: "Employee ID",
              },
              {
                value: "empName",
                label: "Employee Name",
              },
              {
                value: "gender",
                label: "Gender",
              },
              {
                value: "projectName",
                label: "Project Name",
              },
              {
                value: "empEmail",
                label: "Employee Email",
              },
              {
                value: "tripId",
                label: "Trip ID",
              },
              {
                value: "tripType",
                label: "Trip Type",
              },
              {
                value: "tripDate",
                label: "Trip Date",
              },
              {
                value: "vehicleId",
                label: "Vehicle ID",
              },
              {
                value: "vehicleRegistrationNo",
                label: "Vehicle Registration No",
              },
              {
                value: "driverName",
                label: "Driver Name",
              },
              {
                value: "driverContact",
                label: "Driver Contact",
              },
              {
                value: "verificationStatus",
                label: "Verification Status",
              },
              {
                value: "verificationType",
                label: "Verification Type",
              },
              {
                value: "verificationTime",
                label: "Verification Time",
              },
              {
                value: "logoutShift",
                label: "Logout Shift",
              },
              {
                value: "teamManager",
                label: "Team Manager",
              },
              {
                value: "Planned SignIn Time",
                label: "Planned SignIn Time",
              },
              {
                value: "Actual SignIn Time",
                label: "Actual SignIn Time",
              },
              {
                value: "plannedSignoffTime",
                label: "Planned Signoff Time",
              },
              {
                value: "actualSignoffTime",
                label: "Actual Signoff Time",
              },
              {
                value: "pickupAddress",
                label: "Pickup Address",
              },
              {
                value: "dropAddress",
                label: "Drop Address",
              },
              {
                value: "distanceFromPlannedPickup",
                label: "Distance From Planned Pickup(Km)",
              },
              {
                value: "distanceFromPlannedDrop",
                label: "Distance From Planned Drop(Km)",
              },
              {
                value: "escortName",
                label: "Escort Name",
              },
              {
                value: "escortContact",
                label: "Escort Contact",
              },
              {
                value: "escortSignInTime",
                label: "Escort SignIn Time",
              },
              {
                value: "verifiedBy",
                label: "Verified By",
              },
              {
                value: "verifiedTime",
                label: "VerifiedTime",
              },
              {
                value: "comment",
                label: "Comment",
              },
            ],
            content: safeReachReport,
          },
        ];
      } else if (reportHeading && reportHeading === "SOS Device Reports") {
        var data = [
          {
            sheet: reportHeading,
            columns: [
              {
                value: "sNo",
                label: "S. No",
              },
              {
                value: "facility",
                label: "Facility",
              },
              {
                value: "vendorName",
                label: "Vendor Name",
              },
              {
                value: "vehicleId",
                label: "Vehicle ID",
              },
              {
                value: "vehicleRegistrationNo",
                label: "Vehicle Registration No",
              },
              {
                value: "driverName",
                label: "Driver Name",
              },
              {
                value: "driverContactNumber",
                label: "Driver Contact Number",
              },
              {
                value: "startTime",
                label: "Start Time",
              },
              {
                value: "triggerdTime",
                label: "Triggerd Time",
              },
              {
                value: "updateTime",
                label: "Update Time",
              },
              {
                value: "closedBy",
                label: "Closed By",
              },
              {
                value: "comments",
                label: "Comments",
              },
              {
                value: "triggeredLocation",
                label: "Triggered Location",
              },
              {
                value: "status",
                label: "Status",
              },
              {
                value: "severity",
                label: "Severity",
              },
              {
                value: "escalationLevel",
                label: "Escalation Level",
              },
            ],
            content: sosDeviceReport,
          },
        ];
      } else if (
        reportHeading &&
        reportHeading === "Vehicle Stoppage No Communication Reports"
      ) {
        var data = [
          {
            sheet: "Vehicle Stoppage Report",
            columns: [
              {
                value: "sNo",
                label: "S. No",
              },
              {
                value: "facility",
                label: "Facility",
              },
              {
                value: "Office",
                label: "Office",
              },
              {
                value: "vendorName",
                label: "Vendor Name",
              },
              {
                value: "vehicleId",
                label: "Vehicle ID",
              },
              {
                value: "vehicleRegistrationNo",
                label: "Vehicle Registration No",
              },
              {
                value: "tripId",
                label: "Trip ID",
              },
              {
                value: "driverName",
                label: "Driver Name",
              },
              {
                value: "driverContactNumber",
                label: "Driver Contact Number",
              },
              {
                value: "startTime",
                label: "Start Time",
              },
              {
                value: "updateTime",
                label: "Update Time",
              },
              {
                value: "closedBy",
                label: "Closed By",
              },
              {
                value: "comments",
                label: "Comments",
              },
              {
                value: "triggeredLocation",
                label: "Triggered Location",
              },
              {
                value: "status",
                label: "Status",
              },
              {
                value: "severity",
                label: "Severity",
              },
            ],
            content: vehicleStoppageReport,
          },
        ];
      }
    }

    var settings = {
      fileName: reportHeading,
      extraLength: 20,
      writeMode: "writeFile",
      writeOptions: {},
      RTL: false,
    };

    xlsx(data, settings);
  };

  useEffect(() => {
    console.log("clickToCallReport data >>>", clickToCallReport);
  }, [clickToCallReport]);

  useEffect(() => {
    if (!shiftTypes?.length) {
      fetchMasterData(MASTER_DATA_TYPES.SHIFT_TYPE);
    }
    fetchAllOffices();
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            // backgroundColor: "yellow"
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
              style={{ backgroundColor: "white" }}
              className="form-control-input"
            >
              <FormControl fullWidth>
                <InputLabel id="report-type-label">Report Type</InputLabel>
                <Select
                  style={{ width: "380px", backgroundColor: "white" }}
                  labelId="report-type-label"
                  id="report-type"
                  name="reportType"
                  value={searchValues.reportType}
                  label="Report Type"
                  onChange={handleFilterChange}
                >
                  {reports.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
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
          <h3>{reportHeading}</h3>
          <div style={{ display: "flex" }}>
            <button
              className="btn btn-primary"
              style={{
                width: "140px",
                padding: "10px",
                margin: "0 10px",
              }}
              onClick={() => downloadReport()}
            >
              Download File
            </button>
          </div>
        </div>
        {reportHeading === "Click To Call Reports" && (
          <ClickToCallTable list={clickToCallReport} isLoading={loading} />
        )}
        {reportHeading === "Safe Reach Verification Reports" && (
          <SafeReachVerificationTable
            list={safeReachReport}
            isLoading={loading}
          />
        )}
        {reportHeading === "SOS Device Reports" && (
          <SOSDeviceTable list={sosDeviceReport} isLoading={loading} />
        )}
        {reportHeading === "Vehicle Stoppage No Communication Reports" && (
          <VehicleStoppageNoCommunicationTable
            list={vehicleStoppageReport}
            isLoading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default reports(MainComponent);
