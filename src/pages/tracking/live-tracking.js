import React, { useState, useEffect, useRef } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { getFormattedLabel } from "@/utils/utils";
import { DATE_FORMAT, MASTER_DATA_TYPES } from "@/constants/app.constants.";
import OfficeService from "@/services/office.service";
import { useDispatch, useSelector } from "react-redux";
import tracking from "@/layouts/tracking";
import { setMasterData } from "@/redux/master.slice";
import MasterDataService from "@/services/masterdata.service";
import LiveTrackingTable from "@/components/tracking/liveTrackingTable";
import dynamic from "next/dynamic";
import DispatchService from "@/services/dispatch.service";
const LiveTrackingMap = dynamic(
  () => import("@/components/tracking/liveTrackingMap"),
  {
    ssr: false,
  }
);

const MainComponent = () => {
  const [mapShow, setMapShow] = useState(false);
  const [fullMapShow, setFullMapShow] = useState(false);
  const [office, setOffice] = useState([]);
  const [searchValues, setSearchValues] = useState({
    officeId: "",
    shiftType: "",
    tripDateStr: moment().format("YYYY-MM-DD"),
    tripState: "",
    tripStatus2: "",
    onTimeStatus: "",
  });
  const [tripData, setTripData] = useState([]);
  const { ShiftType: shiftTypes } = useSelector((state) => state.master);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const tripStatus = [
    { key: "All", value: "All" },
    { key: "Not Ended", value: "In progress" },
    { key: "Completed", value: "Completed" },
  ];

  const onTimeStatus = ["On Time", "Delayed"];

  const tripStatus2 = ["Unassigned", "Not Started", "Inprogress", "Complete"];

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    let newSearchValues = { ...searchValues };
    if (name === "tripDateStr")
      newSearchValues[name] = value.format("YYYY-MM-DD");
    else newSearchValues[name] = value;
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

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
  });

  const fetchSummary = async () => {
    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      const queryParams = new URLSearchParams(pagination);
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
        queryParams,
        allSearchValues
      );
      console.log(response.data.data);
      const data = response.data.data;
      if (data.length > 0) {
        let temp = [];
        data.map((val) => {
          // if (val.tripState === "END" && searchValues.tripState === "Completed") {
          //   temp.push(val);
          // }
          // if (searchValues.tripState !== "Completed" && val.tripState !== "END" && val.isCabAllocated) {
          //   // console.log("trip>>>>",val);
          //   temp.push(val);
          // }
          temp.push(val);
        });
        console.log(temp);
        setTripData(response.data.data);
      } else {
        setTripData([]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilter = () => {
    let allSearchValue = {
      officeId: office[0].officeId,
      date: moment().format("YYYY-MM-DD"),
      shiftType: "",
    };
    setSearchValues(allSearchValue);
  };

  useEffect(() => {
    if (!shiftTypes?.length) {
      fetchMasterData(MASTER_DATA_TYPES.SHIFT_TYPE);
    }
    fetchAllOffices();
  }, []);

  return (
    <div>
      {!mapShow ? (
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
            <div
              style={{ minWidth: "160px", backgroundColor: "white" }}
              className="form-control-input"
            >
              <FormControl fullWidth>
                <InputLabel id="trip-status-label">Trip Status</InputLabel>
                <Select
                  style={{ width: "180px", backgroundColor: "white" }}
                  labelId="trip-status-label"
                  id="tripState"
                  name="tripState"
                  value={searchValues.tripState}
                  label="Trip Status"
                  onChange={handleFilterChange}
                >
                  {tripStatus.map((item, idx) => (
                    <MenuItem key={idx} value={item.key}>
                      {item.value}
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
          <div
            style={{
              padding: "20px 10px",
              backgroundColor: "#f9f9f9",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  backgroundColor: "white",
                  margin: "10px 20px 3px",
                  padding: "20px 15px",
                  borderRadius: "20px 20px 0 0",
                }}
              >
                <button
                  className="btn btn-primary"
                  style={{
                    width: "auto",
                    padding: "8px 20px",
                    margin: "0 15px",
                  }}
                  onClick={() => setMapShow(true)}
                >
                  View Map
                </button>
                {/* <button
                    className="btn btn-primary"
                    style={{
                      width: "auto",
                      padding: "4px 20px",
                      margin: "0 15px",
                    }}
                  >
                    Single Female Trips
                  </button> */}
                {/* <FormControl
                    style={{
                      margin: "0 15px",
                      padding: "0px 0",
                      fontFamily: "DM Sans",
                    }}
                  >
                    <InputLabel
                      id="on-time-status-label"
                      style={{
                        fontSize: "15px",
                      }}
                    >
                      On Time Status
                    </InputLabel>
                    <Select
                      style={{
                        width: "180px",
                        backgroundColor: "white",
                        height: "50px",
                      }}
                      labelId="on-time-status-label"
                      id="onTimeStatus"
                      name="onTimeStatus"
                      value={searchValues.onTimeStatus}
                      label="On Time Status"
                      onChange={handleFilterChange}
                    >
                      {onTimeStatus.map((item) => (
                        <MenuItem key={item} value={item}>{item}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    style={{
                      margin: "0 15px",
                      padding: "0 0",
                      fontFamily: "DM Sans",
                    }}
                  >
                    <InputLabel
                      id="trip-status-label"
                      style={{
                        fontSize: "15px",
                      }}
                    >
                      Trip Status
                    </InputLabel>
                    <Select
                      style={{
                        width: "180px",
                        backgroundColor: "white",
                        height: "50px",
                      }}
                      labelId="trip-status-label"
                      id="tripStatus2"
                      name="tripStatus2"
                      value={searchValues.tripStatus2}
                      label="Trip Status"
                      onChange={handleFilterChange}
                    >
                      {tripStatus2.map((item) => (
                        <MenuItem key={item} value={item}>{item}</MenuItem>
                      ))}
                    </Select>
                  </FormControl> */}
              </div>
            </div>
            <LiveTrackingTable tripData={tripData} isLoading={loading}/>
          </div>
        </div>
      ) : (
        <div style={{ margin: "40px" }}>
          <div className="d-flex" style={{ width: "100%" }}>
            <div
              className="d-flex"
              style={{
                width: "100%",
                justifyContent: "flex-end",
                marginBottom: 20,
              }}
            >
              <button
                className="btn btn-primary"
                style={{
                  width: "auto",
                  padding: "10px 20px",
                  margin: "0 10px",
                }}
                onClick={() => setFullMapShow(!fullMapShow)}
              >
                {fullMapShow ? "Exit Full Screen" : "Full Screen"}
              </button>
              <button
                className="btn btn-primary"
                style={{
                  width: "auto",
                  padding: "10px 20px",
                  margin: "0 10px",
                }}
                onClick={() => setMapShow(false)}
              >
                Close Map
              </button>
            </div>
          </div>
          <LiveTrackingMap
            officeId={searchValues.officeId}
            fullMapShow={fullMapShow}
          />
        </div>
      )}
    </div>
  );
};

export default tracking(MainComponent);
