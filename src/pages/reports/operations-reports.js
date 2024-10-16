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
import OnTimeArrivalSummaryTable from "@/components/reports/otaSummaryTable";
import OnTimeDepartureSummaryTable from "@/components/reports/otdSummaryTable";
import OverSpeedingTable from "@/components/reports/overSpeedingTable";
import ReportService from "@/services/report.service";
import xlsx from "json-as-xlsx";

const MainComponent = () => {
  const [office, setOffice] = useState([]);
  const [searchValues, setSearchValues] = useState({
    officeId: "",
    shiftType: "",
    date: moment().format("YYYY-MM-DD"),
    reportType: "On Time Arrival Summary Reports",
  });
  const [onTimeArrivalReport, setOnTimeArrivalReport] = useState([]);
  const [onTimeDepartureReport, setOnTimeDepartureReport] = useState([]);
  const [overSpeedingReport, setOverSpeedingReport] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { ShiftType: shiftTypes } = useSelector((state) => state.master);
  const [reportHeading, setReportHeading] = useState(
    "On Time Arrival Summary Reports"
  );

  const reports = [
    "On Time Arrival Summary Reports",
    "On Time Departure Reports",
    "Over Speeding Reports",
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
      if (searchValues.reportType === "On Time Arrival Summary Reports") {
        setReportHeading("On Time Arrival Summary Reports");
        // const response = await ReportService(allSearchValues);
        // console.log("data >>>>", response.data);
        // setOnTimeArrivalReport(response.data);
      } else if (searchValues.reportType === "On Time Departure Reports") {
        setReportHeading("On Time Departure Reports");
        // const response = await ReportService(allSearchValues);
        // console.log("data >>>>", response.data);
        // setOnTimeDepartureReport(response.data);
      } else if (searchValues.reportType === "Over Speeding Reports") {
        setReportHeading("Over Speeding Reports");
        // const response = await ReportService(allSearchValues);
        // console.log("data >>>>", response.data);
        // setOverSpeedingReport(response.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (reportHeading) {
      if (
        reportHeading &&
        reportHeading === "On Time Arrival Summary Reports"
      ) {
        var data = [
          {
            sheet: "OTA Summary Reports",
            columns: [
              {
                value: "tripDate",
                label: "Trip Date",
              },
              {
                value: "shift",
                label: "Shift",
              },
              {
                value: "totalLoginTrips",
                label: "Total Login Trips",
              },
              {
                value: "completedLoginTrips",
                label: "Completed Login Trips",
              },
              {
                value: "incompleteTrips",
                label: "Incomplete Trips",
              },
              {
                value: "delayedTrips",
                label: "Delayed Trips",
              },
              {
                value: "otaTrips",
                label: "OTA Trips",
              },
              {
                value: "otaPercentage",
                label: "% On Time Arrival",
              },
              {
                value: "employeeDelay",
                label: "Employee Delay",
              },
              {
                value: "driverDelay",
                label: "Driver Delay",
              },
              {
                value: "trafficDelay",
                label: "Traffic Delay",
              },
            ],
            content: onTimeArrivalReport,
          },
        ];
      } else if (
        reportHeading &&
        reportHeading === "On Time Departure Reports"
      ) {
        var data = [
          {
            sheet: reportHeading,
            columns: [
              {
                value: "tripDate",
                label: "Trip Date",
              },
              {
                value: "shift",
                label: "Shift",
              },
              {
                value: "totalLogoutTrips",
                label: "Total Logout Trips",
              },
              {
                value: "completedLogoutTrips",
                label: "Completed Logout Trips",
              },
              {
                value: "incompleteTrips",
                label: "Incomplete Trips",
              },
              {
                value: "delayedTrips",
                label: "Delayed Trips",
              },
              {
                value: "otdTrips",
                label: "OTD Trips",
              },
              {
                value: "otdPercentage",
                label: "% On Time Departure",
              },
              {
                value: "employeeDelay",
                label: "Employee Delay",
              },
              {
                value: "driverDelay",
                label: "Driver Delay",
              },
              {
                value: "trafficDelay",
                label: "Traffic Delay",
              },
            ],
            content: onTimeDepartureReport,
          },
        ];
      } else if (reportHeading && reportHeading === "Over Speeding Reports") {
        var data = [
          {
            sheet: reportHeading,
            columns: [
              {
                value: "sNo",
                label: "S.No",
              },
              {
                value: "facility",
                label: "Facility",
              },
              {
                value: "office",
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
                value: "vehicleRegNo",
                label: "Vehicle Reg No",
              },
              {
                value: "direction",
                label: "Direction",
              },
              {
                value: "shift",
                label: "Shift",
              },
              {
                value: "tripId",
                label: "Trip ID",
              },
              {
                value: "speedAtWhichAlertRaised",
                label: "Speed At Which Alert Raised",
              },
              {
                value: "maxSpeed",
                label: "Max Speed",
              },
              {
                value: "duration",
                label: "Duration",
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
                value: "state",
                label: "State",
              },
              {
                value: "severity",
                label: "Severity",
              },
              {
                value: "count",
                label: "Count",
              },
            ],
            content: overSpeedingReport,
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
    console.log("onTimeArrivalReport data>>>", onTimeArrivalReport);
  }, [onTimeArrivalReport]);

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
        {reportHeading === "On Time Arrival Summary Reports" && (
          <OnTimeArrivalSummaryTable
            list={onTimeArrivalReport}
            isLoading={loading}
          />
        )}
        {reportHeading === "On Time Departure Reports" && (
          <OnTimeDepartureSummaryTable
            list={onTimeDepartureReport}
            isLoading={loading}
          />
        )}
        {reportHeading === "Over Speeding Reports" && (
          <OverSpeedingTable list={overSpeedingReport} isLoading={loading} />
        )}
      </div>
    </div>
  );
};

export default reports(MainComponent);
