import React, { useState, useEffect } from "react";
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
import SafeReachConfirmationTable from "@/components/tracking/safeReachConfirmationTable";
import DispatchService from "@/services/dispatch.service";

const MainComponent = () => {
  const [tripList, setTripList] = useState([]);
  const [office, setOffice] = useState([]);
  const [searchValues, setSearchValues] = useState({
    officeId: "",
    shiftType: "",
    tripDateStr: moment().format("YYYY-MM-DD"),
  });
  const { ShiftType: shiftTypes } = useSelector((state) => state.master);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

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
        const temp = await Promise.all(
          data.map(async (val) => {
            const tripMemberResponse = await DispatchService.tripMembers(
              val.id
            );
            return {
              ...tripMemberResponse.data[0],
              tripId: val.id,
              shiftTime: val.shiftTime,
            };
          })
        );
        console.log(temp);
        setTripList(temp);
      } else {
        setTripList([]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
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
        {/* <div style={{ minWidth: "160px", backgroundColor: 'white', }} className="form-control-input">
              <FormControl fullWidth>
                <InputLabel id="shiftType-label">Shift Time</InputLabel>
                <Select
                  style={{ width: "160px" }}
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
            </div> */}
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
                padding: "10px 20px",
                margin: "0 15px",
              }}
            >
              Update Status
            </button>
            {/* <button
              className="btn btn-primary"
              style={{
                width: "auto",
                padding: "10px 20px",
                margin: "0 15px",
              }}
            >
              View Audit Logs
            </button> */}
          </div>
        </div>
        <SafeReachConfirmationTable tripList={tripList} isLoading={loading}/>
      </div>
    </div>
  );
};

export default tracking(MainComponent);
