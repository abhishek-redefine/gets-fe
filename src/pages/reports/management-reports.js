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
import BARawDataTable from "@/components/reports/BARawDataTable";
import NoShowDetailedTable from "@/components/reports/noShowDetailedTable";
import NoShowSummaryTable from "@/components/reports/noShowSummaryTable";
import ReportService from "@/services/report.service";
import xlsx from "json-as-xlsx";

const MainComponent = () => {
  const [office, setOffice] = useState([]);
  const [searchValues, setSearchValues] = useState({
    officeId: "",
    shiftType: "",
    date: moment().format("YYYY-MM-DD"),
    reportType: "BA Raw Data Reports",
  });
  const [baRawReport, setBaRawReport] = useState([]);
  const [noShowDetailReport, setNoShowDetailReport] = useState([]);
  const [noShowSummaryReport, setNoShowSummaryReport] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { ShiftType: shiftTypes } = useSelector((state) => state.master);

  const [reportHeading, setReportHeading] = useState("BA Raw Data Reports");

  const reports = [
    "BA Raw Data Reports",
    "No Show Detailed Reports",
    "No show Summary Reports",
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
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      let allSearchValues = { ...searchValues };
      Object.keys(allSearchValues).forEach((objKey) => {
        if (
          allSearchValues[objKey] === null ||
          allSearchValues[objKey] === ""
        ) {
          delete allSearchValues[objKey];
        }
      });
      if (searchValues.reportType === "BA Raw Data Reports") {
        setReportHeading("BA Raw Data Reports");
      } else if (searchValues.reportType === "No Show Detailed Reports") {
        setReportHeading("No Show Detailed Reports");
      } else if (searchValues.reportType === "No show Summary Reports") {
        setReportHeading("No show Summary Reports");
        const response = await ReportService.NoShowSummaryReport(
          allSearchValues
        );
        console.log("NoShowSummaryReport data >>>>", response.data);
        setNoShowSummaryReport(response.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (reportHeading) {
      if (reportHeading && reportHeading === "BA Raw Data Reports") {
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
                value: "Office",
                label: "Office",
              },
              {
                value: "date",
                label: "Date",
              },
              {
                value: "empId",
                label: "Employee ID",
              },
              {
                value: "name",
                label: "Name",
              },
              {
                value: "gender",
                label: "Gender",
              },
              {
                value: "team",
                label: "Team",
              },
              {
                value: "tripID",
                label: "Trip ID",
              },
              {
                value: "source",
                label: "Source",
              },
              {
                value: "vendorID",
                label: "Vendor ID",
              },
              {
                value: "vehicleId",
                label: "Vehicle ID",
              },
              {
                value: "registration",
                label: "Registration",
              },
              {
                value: "vehicleType",
                label: "Vehicle Type",
              },
              {
                value: "vehicleDeploymentTime",
                label: "Vehicle Deployment Time",
              },
              {
                value: "direction",
                label: "Direction",
              },
              {
                value: "shiftTypeOrTime",
                label: "Shift Type/Time",
              },
              {
                value: "employeeStatus",
                label: "Employee Status",
              },
              {
                value: "notBoardingReason",
                label: "Not Boarding Reason",
              },
              {
                value: "noShow",
                label: "No Show",
              },
              {
                value: "signInType",
                label: "SignIn Type",
              },
              {
                value: "employeeCountInTrip",
                label: "Employee Count in Trip",
              },
              {
                value: "plannedPickupTime",
                label: "Planned Pickup Time",
              },
              {
                value: "driverReportTime",
                label: "Driver Report Time",
              },
              {
                value: "actualPickupTime",
                label: "Actual Pickup Time",
              },
              {
                value: "plannedDropTime",
                label: "Planned Drop Time",
              },
              {
                value: "actualDropTime",
                label: "Actual Drop Time",
              },
              {
                value: "otaOrOtd",
                label: "OTA/OTD",
              },
              {
                value: "delayCause",
                label: "Delay Cause",
              },
              {
                value: "causedByEmployee",
                label: "Caused By Employee",
              },
              {
                value: "distanceTravelled",
                label: "Distance Travelled(KM)",
              },
              {
                value: "proximitySMS",
                label: "Proximity SMS",
              },
              {
                value: "costCenter",
                label: "Cost Center",
              },
              {
                value: "selectedDestination",
                label: "Selected Destination",
              },
              {
                value: "noShowMarkedBy",
                label: "No Show Marked By",
              },
              {
                value: "noShowMarkedTime",
                label: "No Show Marked Time",
              },
              {
                value: "billingZone",
                label: "Billing Zone",
              },
              {
                value: "nodalPoint",
                label: "Nodal Point",
              },
              {
                value: "tripType",
                label: "Trip Type",
              },
              {
                value: "tripOffice",
                label: "Trip Office",
              },
              {
                value: "driverId",
                label: "Driver ID",
              },
              {
                value: "deviceId",
                label: "Device ID",
              },
              {
                value: "plannedDriverId",
                label: "Planned Driver ID",
              },
              {
                value: "shuttlePoint",
                label: "Shuttle Point",
              },
              {
                value: "actualSignoffLocation",
                label: "Actual Signoff Location",
              },
              {
                value: "actualDriverID",
                label: "Actual Driver ID",
              },
              {
                value: "tripSheetComment",
                label: "Trip Sheet Comment",
              },
              {
                value: "businessUnit",
                label: "Business Unit",
              },
              {
                value: "plannedDriverName",
                label: "Planned Driver Name",
              },
              {
                value: "plannedDriverContact No",
                label: "Planned Driver Contact No",
              },
              {
                value: "actualDriverName",
                label: "Actual Driver Name",
              },
              {
                value: "actualDriverContactNo",
                label: "Actual Driver Contact No",
              },
              {
                value: "homeToOfficeDistance",
                label: "Home To Office Distance",
              },
            ],
            content: baRawReport,
          },
        ];
      } else if (
        reportHeading &&
        reportHeading === "No Show Detailed Reports"
      ) {
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
                value: "Office",
                label: "Office",
              },
              {
                value: "date",
                label: "Date",
              },
              {
                value: "empId",
                label: "Employee ID",
              },
              {
                value: "employeeName",
                label: "Employee Name",
              },
              {
                value: "project",
                label: "Project",
              },
              {
                value: "tripID",
                label: "Trip ID",
              },
              {
                value: "direction",
                label: "Direction",
              },
              {
                value: "time",
                label: "Time",
              },
              {
                value: "cabID",
                label: "Cab ID",
              },
              {
                value: "cabNo",
                label: "Cab no.",
              },
              {
                value: "plannedPickupTime",
                label: "Planned Pickup Time",
              },
              {
                value: "markedBy",
                label: "Marked By",
              },
              {
                value: "noShowMarkingTime",
                label: "No Show Marking Time",
              },
              {
                value: "alternateTripId",
                label: "Alternate Trip ID",
              },
            ],
            content: noShowDetailReport,
          },
        ];
      } else if (reportHeading && reportHeading === "No show Summary Reports") {
        var data = [
          {
            sheet: reportHeading,
            columns: [
              {
                value: "tripDate",
                label: "Trip Date",
              },
              {
                value: "rosteredEmployees",
                label: "Rostered Employees",
              },
              {
                value: "noShow",
                label: "No Show",
              },
              {
                value: "reRosteredCount",
                label: "Rerostered Count",
              },
              {
                value: "reRosteredPercentage",
                label: "Rerostered (%)",
              },
              {
                value: "noShowPercentage",
                label: "No Show (%)",
              },
            ],
            content: noShowSummaryReport,
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
    console.log("NoShowSummaryReport data>>>", noShowSummaryReport);
  }, [noShowSummaryReport]);

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
                  style={{ width: "300px", backgroundColor: "white" }}
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
        {reportHeading === "" && (
          <BARawDataTable list={baRawReport} isLoading={loading} />
        )}
        {reportHeading === "BA Raw Data Reports" && (
          <BARawDataTable list={baRawReport} isLoading={loading} />
        )}
        {reportHeading === "No Show Detailed Reports" && (
          <NoShowDetailedTable list={noShowDetailReport} isLoading={loading} />
        )}
        {reportHeading === "No show Summary Reports" && (
          <NoShowSummaryTable list={noShowSummaryReport} isLoading={loading} />
        )}
      </div>
    </div>
  );
};

export default reports(MainComponent);
