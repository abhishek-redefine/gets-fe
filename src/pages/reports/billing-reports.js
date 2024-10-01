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
import AdjustmentPenaltyTable from "@/components/reports/adjustmentPenaltyTable";
import RawBillingDataTable from "@/components/reports/rawBillingDataTable";
import TripCompletionVendorWiseTable from "@/components/reports/tripCompletionVendorWiseTable";
import ReportService from "@/services/report.service";
import xlsx from "json-as-xlsx";

const MainComponent = () => {
  const [office, setOffice] = useState([]);
  const [searchValues, setSearchValues] = useState({
    officeId: "",
    shiftType: "",
    date: moment().format("YYYY-MM-DD"),
    reportType: "Adjustment Penalty Reports",
  });
  const [adjustmentPenaltyReport, setAdjustmentPenaltyReport] = useState([]);
  const [rawBillingReport, setRawBillingReport] = useState([]);
  const [tripCompletionReport, setTripCompletionReport] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { ShiftType: shiftTypes } = useSelector((state) => state.master);
  const [reportHeading, setReportHeading] = useState(
    "Adjustment Penalty Reports"
  );

  const reports = [
    "Adjustment Penalty Reports",
    "Raw Billing Data Reports",
    "Trip Completion Vendor-wise Reports",
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

  // const fetchSummary = async () => {
  //   try {
  //     setLoading(true);
  //     await new Promise((resolve) => setTimeout(resolve, 5000));
  //     let allSearchValues = { ...searchValues };
  //     Object.keys(allSearchValues).forEach((objKey) => {
  //       if (
  //         allSearchValues[objKey] === null ||
  //         allSearchValues[objKey] === ""
  //       ) {
  //         delete allSearchValues[objKey];
  //       }
  //     });
  //     switch (searchValues.reportType) {
  //       case "Adjustment Penalty Reports":
  //         setReportHeading("Adjustment Penalty Reports");
  //         setSelectedTable(<AdjustmentPenaltyTable list={list} isLoading={loading} />);
  //         break;
  //       case "Raw Billing Data Reports":
  //         setReportHeading("Raw Billing Data Reports");
  //         setSelectedTable(<RawBillingDataTable list={rawBillingReport} isLoading={loading} />);
  //         const response = await ReportService.RawBillingReport(
  //           allSearchValues
  //         );
  //         console.log("RawBillingReport data >>>>", response.data);
  //         setRawBillingReport(response.data);
  //         break;
  //       case "Trip Completion Vendor-wise Reports":
  //         setReportHeading("Trip Completion Vendor-wise Reports");
  //         setSelectedTable(<TripCompletionVendorWiseTable list={list} isLoading={loading} />);
  //         break;
  //       default:
  //         setReportHeading("Adjustment Penalty Reports");
  //         setSelectedTable(<AdjustmentPenaltyTable list={list} isLoading={loading} />);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
      if (searchValues.reportType === "Adjustment Penalty Reports") {
        setReportHeading("Adjustment Penalty Reports");
      } else if (searchValues.reportType === "Raw Billing Data Reports") {
        setReportHeading("Raw Billing Data Reports");
        const response = await ReportService.RawBillingReport(allSearchValues);
        console.log("RawBillingReport data >>>>", response.data);
        setRawBillingReport(response.data);
      } else if (
        searchValues.reportType === "Trip Completion Vendor-wise Reports"
      ) {
        setReportHeading("Trip Completion Vendor-wise Reports");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (reportHeading) {
      if (reportHeading && reportHeading === "Adjustment Penalty Reports") {
        var data = [
          {
            sheet: reportHeading,
            columns: [
              {
                value: "date",
                label: "Date",
              },
              {
                value: "tripId",
                label: "Trip ID",
              },
              {
                value: "vendorName",
                label: "Vendor Name",
              },
              {
                value: "cabID",
                label: "Cab ID",
              },
              {
                value: "registrationNo",
                label: "Registration no.",
              },
              {
                value: "seatingCapacity",
                label: "Seating Capacity",
              },
              {
                value: "penaltyType",
                label: "Penalty Type",
              },
              {
                value: "amount",
                label: "Amount",
              },
              {
                value: "comment",
                label: "Comment",
              },
            ],
            content: adjustmentPenaltyReport,
          },
        ];
      } else if (
        reportHeading &&
        reportHeading === "Raw Billing Data Reports"
      ) {
        var data = [
          {
            sheet: reportHeading,
            columns: [
              {
                label: "Facility",
                value: "facility",
              },
              {
                label: "Offices",
                value: "offices",
              },
              {
                label: "Trip Office",
                value: "tripOffice",
              },
              {
                label: "Vendor",
                value: "vendor",
              },
              {
                label: "Billing Contract",
                value: "billingContract",
              },
              {
                label: "Cab ID",
                value: "cabId",
              },
              {
                label: "Registration",
                value: "registration",
              },
              {
                label: "Seating Capacity",
                value: "seatingCapacity",
              },
              {
                label: "Duty Start",
                value: "dutyStart",
              },
              {
                label: "Duty End",
                value: "dutyEnd",
              },
              {
                label: "Trip Source",
                value: "tripSource",
              },
              {
                label: "Trip Type",
                value: "tripType",
              },
              {
                label: "Shift",
                value: "shift",
              },
              {
                label: "Direction",
                value: "direction",
              },
              {
                label: "Trip ID",
                value: "tripId",
              },
              {
                label: "Trip Date",
                value: "tripDate",
              },
              {
                label: "Trip Start Time",
                value: "tripStartTime",
              },
              {
                label: "Trip End Time",
                value: "tripEndTime",
              },
              {
                label: "Traveled Employee Count",
                value: "traveledEmployeeCount",
              },
              {
                label: "Planned Trip Employees",
                value: "plannedTripEmployees",
              },
              {
                label: "Garage KM",
                value: "garageKM",
              },
              {
                label: "Audit Results",
                value: "auditResults",
              },
              {
                label: "Billing Comment",
                value: "billingComment",
              },
              {
                label: "Issue Resolved By",
                value: "issueResolvedBy",
              },
              {
                label: "Audit Done By",
                value: "auditDoneBy",
              },
              {
                label: "Location",
                value: "location",
              },
              {
                label: "Start Location Address",
                value: "startLocationAddress",
              },
              {
                label: "Start Location Landmark",
                value: "startLocationLandmark",
              },
              {
                label: "End Location Address",
                value: "endLocationAddress",
              },
              {
                label: "End Location Landmark",
                value: "endLocationLandmark",
              },
              {
                label: "Traveled Escort Count",
                value: "traveledEscortCount",
              },
              {
                label: "Planned Escort Count",
                value: "plannedEscortCount",
              },
              {
                label: "Escort Traveled",
                value: "escortTraveled",
              },
              {
                label: "Physical ID",
                value: "physicalId",
              },
              {
                label: "Trip Reference KM",
                value: "tripReferenceKMs",
              },
              {
                label: "Empty Leg Reference KM",
                value: "emptyLegReferenceKM",
              },
              {
                label: "Trip Distance Approved KMs",
                value: "tripDistanceApprovedKMs",
              },
              {
                label: "Empty Leg Approved KM",
                value: "emptyLegApprovedKM",
              },
              {
                label: "Duty KM",
                value: "dutyKM",
              },
              {
                label: "Trip Audited",
                value: "tripAudited",
              },
              {
                label: "Trip Status",
                value: "tripStatus",
              },
              {
                label: "Tripsheet Comment",
                value: "tripSheetComment",
              },
            ],
            content: rawBillingReport,
          },
        ];
      } else if (
        reportHeading &&
        reportHeading === "Trip Completion Vendor-wise Reports"
      ) {
        var data = [
          {
            sheet: "Trip Completion Report",
            columns: [
              {
                value: "bunitId",
                label: "Bunit Id",
              },
              {
                value: "office",
                label: "Office",
              },
              {
                value: "vendorId",
                label: "Vendor Id",
              },
              {
                value: "tripDate",
                label: "Trip Date",
              },
              {
                value: "tripId",
                label: "Trip Id",
              },
              {
                value: "tripDirection",
                label: "Trip Direction",
              },
              {
                value: "shift",
                label: "Shift",
              },
              {
                value: "source",
                label: "Source",
              },
              {
                value: "tripStatus",
                label: "Trip Status",
              },
              {
                value: "delayReason",
                label: "Delay Reason",
              },
              {
                value: "cabType",
                label: "Cab Type",
              },
              {
                value: "actualVendorCabId",
                label: "Actual Vendor Cab Id",
              },
              {
                value: "actualCabRegistration",
                label: "Actual Cab Registration",
              },
              {
                value: "traveledKm",
                label: "Traveled Km",
              },
              {
                value: "tripStatusReason",
                label: "Trip Status Reason",
              },
              {
                value: "billingZone",
                label: "Billing Zone",
              },
              {
                value: "actualEscort",
                label: "Actual Escort",
              },
              {
                value: "landmark",
                label: "Landmark",
              },
              {
                value: "plannedcabRegistration",
                label: "Planned cab Registration",
              },
              {
                value: "plannedkm",
                label: "Planned km",
              },
              {
                value: "plannedEmpCount",
                label: "Planned Emp Count",
              },
              {
                value: "travelledEmpCount",
                label: "Travelled Emp Count",
              },
              {
                value: "nodalPoint",
                label: "Nodal Point",
              },
            ],
            content: tripCompletionReport,
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
    console.log("rawBillingReport data>>>", rawBillingReport);
  }, [rawBillingReport]);

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
          <AdjustmentPenaltyTable
            list={adjustmentPenaltyReport}
            isLoading={loading}
          />
        )}
        {reportHeading === "Adjustment Penalty Reports" && (
          <AdjustmentPenaltyTable
            list={adjustmentPenaltyReport}
            isLoading={loading}
          />
        )}
        {reportHeading === "Raw Billing Data Reports" && (
          <RawBillingDataTable list={rawBillingReport} isLoading={loading} />
        )}
        {reportHeading === "Trip Completion Vendor-wise Reports" && (
          <TripCompletionVendorWiseTable
            list={tripCompletionReport}
            isLoading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default reports(MainComponent);
