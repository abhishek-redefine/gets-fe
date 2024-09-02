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
import DispatchService from "@/services/dispatch.service";
import ClickToCallTable from "@/components/reports/clickToCallTable";
import SafeReachVerificationTable from "@/components/reports/safeReachVerificationTable";
import SOSDeviceTable from "@/components/reports/sosDeviceTable";
import VehicleStoppageNoCommunicationTable from "@/components/reports/vehicleStoppageNoCommunicationTable";

const MainComponent = () => {
  const [office, setOffice] = useState([]);
  const [searchValues, setSearchValues] = useState({
    officeId: "",
    shiftType: "",
    date: moment().format("YYYY-MM-DD"),
    reportType: "Click To Call Reports",
  });
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({
    page: 0,
    size: 100,
  });

  const { ShiftType: shiftTypes } = useSelector((state) => state.master);

  const [selectedTable, setSelectedTable] = useState(
    <ClickToCallTable list={list} />
  );
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
      console.log("response data", response.data.data);
      // setList(data);
      // var requestType = data[0].requestType;
      switch (searchValues.reportType) {
        case "Click To Call Reports":
          setReportHeading("Click To Call Reports");
          setSelectedTable(<ClickToCallTable list={list} />);
          break;
        case "Safe Reach Verification Reports":
          setReportHeading("Safe Reach Verification Reports");
          setSelectedTable(<SafeReachVerificationTable list={list} />);
          break;
        case "SOS Device Reports":
          setReportHeading("SOS Device Reports");
          setSelectedTable(<SOSDeviceTable list={list} />);
          break;
        case "Vehicle Stoppage No Communication Reports":
          setReportHeading("Vehicle Stoppage No Communication Reports");
          setSelectedTable(<VehicleStoppageNoCommunicationTable list={list} />);
          break;
        default:
          setReportHeading("Click To Call Reports");
          setSelectedTable(<ClickToCallTable list={list} />);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log("list>>>", list);
  }, [list]);

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
          <div className="filterContainer" style={{}}>
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
            >
              Download File
            </button>
          </div>
        </div>
        {selectedTable}
      </div>
    </div>
  );
};

export default reports(MainComponent);
