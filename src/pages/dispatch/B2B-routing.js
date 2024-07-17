import React, { useState, useEffect } from "react";
import StickyHeadTable from "../../components/dispatch/B2BTable";
import { logoutB2B, loginB2B } from "../../sampleData/data";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { getFormattedLabel } from "@/utils/utils";
import {
  DATE_FORMAT,
  DEFAULT_PAGE_SIZE,
  MASTER_DATA_TYPES,
  SHIFT_TYPE,
} from "@/constants/app.constants.";
import OfficeService from "@/services/office.service";
import { useDispatch, useSelector } from "react-redux";
import dispatch from "@/layouts/dispatch";
import { setMasterData } from "@/redux/master.slice";
import DispatchService from "@/services/dispatch.service";
import MasterDataService from "@/services/masterdata.service";
import { toggleToast } from "@/redux/company.slice";

const MainComponent = () => {
  const [selectedLogoutTrips, setSelectedLogoutTrips] = useState([]);
  const [selectedLoginTrips, setSelectedLoginTrips] = useState([]);
  const [selectedLogoutTripsUI, setSelectedLogoutTripsUI] = useState([]);
  const [selectedLoginTripsUI, setSelectedLoginTripsUI] = useState([]);
  const [pairedTrips, setPairedTrips] = useState([]);
  const [pairedTripIds, setPairedTripIds] = useState([]);
  const [pairedTripIdsUI, setPairedTripIdsUI] = useState([]);
  const [office, setOffice] = useState([]);
  const [loginTripList, setLoginTripList] = useState([]);
  const [logoutTripList, setLogoutTripList] = useState([]);
  const [b2bLoginList, setB2bLoginList] = useState([]);
  const [b2bLogoutList, setB2bLogoutList] = useState([]);
  const [b2bPair, setB2bPair] = useState([]);
  const [b2bPairList, setB2bPairList] = useState([]);
  const [allIdsPairedAndB2bList, setAllIdsPairedAndB2bList] = useState([]);
  const [autoSelectLogin, setAutoSelectLogin] = useState(null);
  const [autoSelectLogout, setAutoSelectLogout] = useState(null);

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
  });
  // const [shiftTypes, setShiftTypes] = useState([]);
  const [searchValuesForLogout, setSearchValuesForLogout] = useState({
    officeIdForLogout: "",
    shiftTypeForLogout: "LOGOUT",
    dateForLogout: moment().format("YYYY-MM-DD"),
  });
  const [searchValuesForLogin, setSearchValuesForLogin] = useState({
    officeIdForLogin: "",
    shiftTypeForLogin: "LOGIN",
    dateForLogin: moment().format("YYYY-MM-DD"),
  });
  const { ShiftType: shiftTypes } = useSelector((state) => state.master);
  const dispatch = useDispatch();

  const resetFilter = () => {
    let allSearchValue = {
      officeId: office[0].officeId,
      date: moment().format("YYYY-MM-DD"),
      shiftType: "",
    };
    setSearchValuesForLogin(allSearchValue);
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

  const fetchAllOffices = async () => {
    try {
      const response = await OfficeService.getAllOffices();
      const { data } = response || {};
      const { clientOfficeDTO } = data || {};
      console.log(clientOfficeDTO);
      setSearchValuesForLogin(
        { ...searchValuesForLogin },
        (searchValuesForLogin["officeIdForLogin"] =
          clientOfficeDTO[0]?.officeId)
      );
      setSearchValuesForLogout(
        { ...searchValuesForLogout },
        (searchValuesForLogout["officeIdForLogout"] =
          clientOfficeDTO[0]?.officeId)
      );
      setOffice(clientOfficeDTO);
    } catch (e) {}
  };

  const getTrips = async () => {
    try {
      let params = new URLSearchParams(pagination);
      let searchValues = {
        officeId: searchValuesForLogin.officeIdForLogin,
        shiftType: searchValuesForLogin.shiftTypeForLogin,
        tripDateStr: searchValuesForLogin.dateForLogin,
      };
      const loginResponse = await DispatchService.getTripSearchByBean(
        params,
        searchValues
      );
      searchValues = {
        officeId: searchValuesForLogout.officeIdForLogout,
        shiftType: searchValuesForLogout.shiftTypeForLogout,
        tripDateStr: searchValuesForLogout.dateForLogout,
      };
      const logoutResponse = await DispatchService.getTripSearchByBean(
        params,
        searchValues
      );
      setLoginTripList(loginResponse.data.data);
      setLogoutTripList(logoutResponse.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteB2b = async (b2bId) => {
    try {
      const response = await DispatchService.deleteB2B(b2bId);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getB2BTrips = async () => {
    try {
      const response = await DispatchService.getAllB2B();
      var data = response.data.data;
      var tempLogin = [];
      var tempLogout = [];
      var tempPair = [];
      var ids = [];
      console.log(data);
      data.map((val) => {
        tempLogin.push({
          b2bId: val.id,
          id: val.loginTripId,
        });
        tempLogout.push({ b2bId: val.id, id: val.logoutTripId });
        tempPair.push({ loginId: val.loginTripId, logoutId: val.logoutTripId });
        ids.push(val.logoutTripId);
        ids.push(val.loginTripId);
      });
      setAllIdsPairedAndB2bList(tempPair);
      setB2bPairList(data);
      setB2bLoginList(tempLogin);
      setB2bLogoutList(tempLogout);
      setB2bPair(tempPair);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    let newSearchValues = name.includes("ForLogin")
      ? { ...searchValuesForLogin }
      : { ...searchValuesForLogout };
    if (name === "dateForLogin" || name === "dateForLogout")
      newSearchValues[name] = value.format("YYYY-MM-DD");
    else newSearchValues[name] = value;
    name.includes("ForLogin")
      ? setSearchValuesForLogin(newSearchValues)
      : setSearchValuesForLogout(newSearchValues);
  };

  const handlePairTrips = () => {
    if (selectedLogoutTrips.length === 1 && selectedLoginTrips.length === 1) {
      console.log(selectedLogoutTrips, selectedLoginTrips);
      const newPairedTrip = `TRIP-${selectedLogoutTrips[0]}-TRIP-${selectedLoginTrips[0]}`;
      const newPairedTripUI = `${selectedLogoutTripsUI[0]}-${selectedLoginTripsUI[0]}`;

      if (!pairedTripIds.includes(newPairedTrip)) {
        setPairedTrips([
          ...pairedTrips,
          selectedLogoutTrips[0],
          selectedLoginTrips[0],
        ]);
        setPairedTripIds([...pairedTripIds, newPairedTrip]);
        setPairedTripIdsUI([...pairedTripIdsUI, newPairedTripUI]);
        setAllIdsPairedAndB2bList([
          ...allIdsPairedAndB2bList,
          { logoutId: selectedLogoutTrips[0], loginId: selectedLoginTrips[0] },
        ]);
        setSelectedLogoutTrips([]);
        setSelectedLoginTrips([]);
      }
    }
  };

  // const handleUnpairTrips = () => {
  //   let temp = [...allIdsPairedAndB2bList];
  //   const found = allIdsPairedAndB2bList.findIndex((pair) => pair.loginId === selectedLoginTrips[0] || pair.logoutId === selectedLogoutTrips[0]);
  //   temp.splice(found,1);
  //   setAllIdsPairedAndB2bList(temp);
  //   setPairedTrips([]);
  //   setPairedTripIds([]);
  //   setSelectedLogoutTrips([]);
  //   setSelectedLoginTrips([]);
  //   setPairedTripIdsUI([]);
  //   setAutoSelectLogout(null);
  //   setAutoSelectLogin(null);
  // };

  const handleUnpairTrips = () => {
    console.log("entered",pairedTrips,pairedTripIds,autoSelectLogin,autoSelectLogout);

    let tempPairedTrips = [...pairedTrips];
    let tempPairedTripIds = [...pairedTripIds];
    let tempAllIdsPairedAndB2bList = [...allIdsPairedAndB2bList];

    // selectedLogoutTrips.forEach((logoutTrip) => {
    //   const foundIndex = tempAllIdsPairedAndB2bList.findIndex(
    //     (pair) => pair.logoutId === logoutTrip
    //   );
    //   if (foundIndex !== -1) {
    //     const { logoutId, loginId } = tempAllIdsPairedAndB2bList[foundIndex];
    //     tempPairedTrips = tempPairedTrips.filter(
    //       (trip) => trip !== logoutId && trip !== loginId
    //     );
    //     tempPairedTripIds = tempPairedTripIds.filter(
    //       (id) => id !== `TRIP-${logoutId}-TRIP-${loginId}`
    //     );
    //     tempPairedTripIdsUI = tempPairedTripIdsUI.filter(
    //       (id) => id !== `${logoutId}-${loginId}`
    //     );
    //     tempAllIdsPairedAndB2bList.splice(foundIndex, 1);
    //   }
    // });

    // selectedLoginTrips.forEach((loginTrip) => {
    //   const foundIndex = tempAllIdsPairedAndB2bList.findIndex(
    //     (pair) => pair.loginId === loginTrip
    //   );
    //   if (foundIndex !== -1) {
    //     const { logoutId, loginId } = tempAllIdsPairedAndB2bList[foundIndex];
    //     tempPairedTrips = tempPairedTrips.filter(
    //       (trip) => trip !== logoutId && trip !== loginId
    //     );
    //     tempPairedTripIds = tempPairedTripIds.filter(
    //       (id) => id !== `TRIP-${logoutId}-TRIP-${loginId}`
    //     );
    //     tempPairedTripIdsUI = tempPairedTripIdsUI.filter(
    //       (id) => id !== `${logoutId}-${loginId}`
    //     );
    //     tempAllIdsPairedAndB2bList.splice(foundIndex, 1);
    //   }
    // });

    const findIndex = pairedTrips.findIndex((pair) => pair.loginId === selectedLoginTrips[0] && pair.logoutId === selectedLogoutTrips[0]);
    tempPairedTrips.splice(findIndex, 2);
    // console.log("tempPairedTrips" +tempPairedTrips);
    setPairedTrips(tempPairedTrips);

    const findTripIdsIndex = pairedTripIds.findIndex((id) => id === `TRIP-${selectedLogoutTrips[0]}-TRIP-${selectedLoginTrips[0]}`);
    tempPairedTripIds.splice(findTripIdsIndex, 1);
    // console.log("tempPairedTripIds" +tempPairedTripIds);
    setPairedTripIds(tempPairedTripIds);

    const findAllIdsIndex = allIdsPairedAndB2bList.findIndex((pair) => pair.loginId === selectedLoginTrips[0]);
    tempAllIdsPairedAndB2bList.splice(findAllIdsIndex, 1);
    // console.log("tempAllIdsPairedAndB2bList" +tempAllIdsPairedAndB2bList);
    setAllIdsPairedAndB2bList(tempAllIdsPairedAndB2bList);
    setAutoSelectLogout(null);
    setAutoSelectLogin(null);
  };

  const generateB2B = async () => {
    try {
      console.log(pairedTripIds);
      const b2BTripDTO = {
        b2BTripDTO: [],
      };
      pairedTripIds.map((val, index) => {
        const tripId = val.split("-");
        b2BTripDTO.b2BTripDTO.push({
          id: 0,
          combinedTripId: val,
          loginTripId: tripId[3],
          logoutTripId: tripId[1],
        });
      });
      const response = await DispatchService.generateB2bTrip(b2BTripDTO);
      console.log(response);
      if (response.status === 201) {
        dispatch(
          toggleToast({ message: "B2B created successfully!", type: "success" })
        );
        getB2BTrips();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelectRow = (type,tripId) => {
    console.log("hello world>>>>>>", type,tripId);
    if (type === "login") {
      setSelectedLoginTrips([tripId]);
      setAutoSelectLogout(null);
      setAutoSelectLogin(null);
    } else {
      setSelectedLogoutTrips([tripId]);
      setAutoSelectLogin(null);
      setAutoSelectLogout(null);
    }
  };

  const autoSelectHandler = (type, tripId, event) => {
    if (type === "login") {
      const found = allIdsPairedAndB2bList.findIndex(
        (pair) => pair.loginId === tripId
      );
      console.log(allIdsPairedAndB2bList, event);
      setSelectedLoginTrips([]);
      setSelectedLogoutTrips([]);
      // if (found === -1 && allIdsPairedAndB2bList.length > 0 && selectedLoginTrips.length > 0) {
      //   setAutoSelectLogin(null);
      //   setAutoSelectLogout(null);
      //   setSelectedLoginTrips([]);
      //   setSelectedLogoutTrips([]);
      // }
      // else{
      if (event === "selectedTrips") {
        setAutoSelectLogout(allIdsPairedAndB2bList[found]?.logoutId);
        setAutoSelectLogin(allIdsPairedAndB2bList[found]?.loginId);
      } else {
        setAutoSelectLogin(null);
        setAutoSelectLogout(null);
      }
      // }
    } else {
      const found = allIdsPairedAndB2bList.findIndex(
        (pair) => pair.logoutId === tripId
      );
      setSelectedLoginTrips([]);
      setSelectedLogoutTrips([]);
      console.log(allIdsPairedAndB2bList, event);
      // if (found === -1 && allIdsPairedAndB2bList.length > 0 && selectedLogoutTrips.length > 0) {
      //   setAutoSelectLogin(null);
      //   setAutoSelectLogout(null);
      //   setSelectedLoginTrips([]);
      //   setSelectedLogoutTrips([]);
      // } else {
      if (event === "selectedTrips") {
        setAutoSelectLogout(allIdsPairedAndB2bList[found]?.logoutId);
        setAutoSelectLogin(allIdsPairedAndB2bList[found]?.loginId);
      } else {
        setAutoSelectLogin(null);
        setAutoSelectLogout(null);
      }
      // }
    }
  };

  useEffect(() => {
    setLoginTripList([]);
    setLogoutTripList([]);
    if (!shiftTypes?.length) {
      fetchMasterData(MASTER_DATA_TYPES.SHIFT_TYPE);
    }
    fetchAllOffices();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          className="gridContainer"
          style={{
            margin: "20px 0",
            padding: "0",
            backgroundColor: "#f9f9f9",
            borderRadius: "20px 0 0 20px",
          }}
        >
          <div
            className="filterContainer"
            style={{
              display: "flex",
              alignItems: "center",
              margin: "0 15px",
              padding: "0 0 0 40px",
            }}
          >
            <h4 style={{ fontSize: "14px" }}>Logout B2B Trips</h4>
            {office.length > 0 && (
              <div style={{ minWidth: "0px" }} className="form-control-input">
                <FormControl style={{ padding: "4px 0" }}>
                  <InputLabel
                    id="logout-primary-office-label"
                    style={{ fontSize: "14px" }}
                  >
                    Office ID
                  </InputLabel>
                  <Select
                    style={{ width: "160px", height: "40px", fontSize: "14px" }}
                    labelId="logout-primary-office-label"
                    id="logoutOfficeId"
                    value={searchValuesForLogout.officeIdForLogout}
                    name="officeIdForLogout"
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

            <div style={{ margin: "0 8px 18px" }}>
              <InputLabel htmlFor="logout-date" style={{ fontSize: "14px" }}>
                Date
              </InputLabel>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  name="dateForLogout"
                  format={DATE_FORMAT}
                  value={
                    searchValuesForLogout.dateForLogout
                      ? moment(searchValuesForLogout.dateForLogout)
                      : null
                  }
                  onChange={(e) =>
                    handleFilterChange({
                      target: { name: "dateForLogout", value: e },
                    })
                  }
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        width: "140px",
                        "& .MuiInputBase-input": { fontSize: "14px" },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </div>

            <FormControl style={{ margin: "0 8px", padding: "4px 0" }}>
              <InputLabel
                id="logout-shiftType-label"
                style={{ fontSize: "14px" }}
              >
                Shift Type
              </InputLabel>
              <Select
                disabled={true}
                style={{ width: "120px", height: "40px" }}
                labelId="logout-shiftType-label"
                id="logoutShiftType"
                name="shiftTypeForLogout"
                value={searchValuesForLogout.shiftTypeForLogout}
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
        </div>

        <div
          className="gridContainer"
          style={{ margin: "20px 0", padding: "0", backgroundColor: "#f9f9f9" }}
        >
          <div
            className="filterContainer"
            style={{
              display: "flex",
              alignItems: "center",
              margin: "0 20px",
            }}
          >
            <h4 style={{ fontSize: "14px" }}>Login B2B Trips</h4>
            {office.length > 0 && (
              <div style={{ minWidth: "0px" }} className="form-control-input">
                <FormControl style={{ padding: "4px 0" }}>
                  <InputLabel
                    id="login-primary-office-label"
                    style={{ fontSize: "14px" }}
                  >
                    Office ID
                  </InputLabel>
                  <Select
                    style={{ width: "150px", height: "40px", fontSize: "14px" }}
                    labelId="login-primary-office-label"
                    id="loginOfficeId"
                    value={searchValuesForLogin.officeIdForLogin}
                    name="officeIdForLogin"
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

            <div style={{ margin: "0 8px 18px" }}>
              <InputLabel htmlFor="logout-date" style={{ fontSize: "14px" }}>
                Date
              </InputLabel>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  name="date"
                  format={DATE_FORMAT}
                  value={
                    searchValuesForLogin.dateForLogin
                      ? moment(searchValuesForLogin.dateForLogin)
                      : null
                  }
                  onChange={(e) =>
                    handleFilterChange({
                      target: { name: "dateForLogin", value: e },
                    })
                  }
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        width: "140px",
                        "& .MuiInputBase-input": { fontSize: "14px" },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </div>

            <FormControl style={{ margin: "0 8px", padding: "4px 0" }}>
              <InputLabel
                id="login-shiftType-label"
                style={{ fontSize: "14px" }}
              >
                Shift Type
              </InputLabel>
              <Select
                disabled={true}
                style={{ width: "120px", height: "40px" }}
                labelId="login-shiftType-label"
                id="loginShiftType"
                name="shiftTypeForLogin"
                value={searchValuesForLogin.shiftTypeForLogin}
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
        </div>

        <div
          style={{
            display: "flex",
            padding: "24px 0",
            margin: "20px 0",
            backgroundColor: "#f9f9f9",
            borderRadius: "0 20px 20px 0",
          }}
        >
          <button
            type="submit"
            onClick={() => {
              getTrips();
              getB2BTrips();
            }}
            className="btn btn-primary filterApplyBtn"
            style={{
              width: "80px",
              height: "40px",
              fontSize: "14px",
              fontWeight: "bold",
              padding: "0",
              margin: "0 8px",
            }}
          >
            Apply
          </button>
          <button
            type="submit"
            onClick={resetFilter}
            className="btn btn-primary filterApplyBtn"
            style={{
              width: "80px",
              height: "40px",
              fontSize: "14px",
              fontWeight: "bold",
              padding: "0",
              margin: "0 20px 0 8px",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div
        style={{
          padding: "40px",
          backgroundColor: "#f9f9f9",
          fontFamily: "DM Sans, sans-serif",
        }}
      >
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <button
              onClick={handlePairTrips}
              style={{
                backgroundColor: "#f9f9f9",
                color: "black",
                border: "2px solid #f6ce47",
                borderRadius: "6px",
                padding: "6px 10px",
                marginLeft: "11px",
                marginRight: "20px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Pair Trip IDs
            </button>
            <button
              onClick={handleUnpairTrips}
              style={{
                backgroundColor: "#f9f9f9",
                color: "black",
                border: "2px solid #f6ce47",
                borderRadius: "6px",
                fontWeight: "bold",
                padding: "6px 10px",
                cursor: "pointer",
                marginLeft: "30px",
              }}
            >
              Unpair Trip IDs
            </button>
          </div>

          <div>
            <button
              onClick={() => deleteB2b()}
              style={{
                backgroundColor: "#f6ce47",
                color: "black",
                border: "2px solid #f6ce47",
                borderRadius: "6px",
                fontWeight: "bold",
                padding: "6px 10px",
                cursor: "pointer",
                marginRight: 10,
              }}
            >
              Delete B2B Trips
            </button>
            <button
              onClick={() => generateB2B()}
              style={{
                backgroundColor: "#f6ce47",
                color: "black",
                border: "2px solid #f6ce47",
                borderRadius: "6px",
                fontWeight: "bold",
                padding: "6px 10px",
                cursor: "pointer",
              }}
            >
              Generate B2B IDs
            </button>
          </div>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: 1, minWidth: "600px" }}>
            <div
              style={{
                backgroundColor: "white",
                border: "1px solid white",
                borderRadius: "10px 10px 0 0",
                margin: "0 10px",
                width: "100%",
              }}
            >
              <h4
                style={{
                  fontSize: "15px",
                  fontFamily: "DM Sans, sans-serif",
                  margin: "12px 30px",
                }}
              >
                Logout B2B Trips
              </h4>
            </div>
            <StickyHeadTable
              rows={logoutTripList}
              selectedTrips={selectedLogoutTrips}
              setSelectedTrips={setSelectedLogoutTrips}
              setSelectedTripsUI={setSelectedLogoutTripsUI}
              pairedTrips={pairedTrips}
              b2bList={b2bLogoutList}
              type={"logout"}
              b2bPair={b2bPair}
              autoSelect={(type, id, event) =>
                autoSelectHandler(type, id, event)
              }
              autoSelectTrip={autoSelectLogout}
              handleSelectRow={(type,tripId) => handleSelectRow(type,tripId)}
            />
          </div>
          <div style={{ flex: 1, minWidth: "600px" }}>
            <div
              style={{
                backgroundColor: "white",
                border: "1px solid white",
                borderRadius: "10px 10px 0 0",
                margin: "0 10px",
                width: "100%",
              }}
            >
              <h4
                style={{
                  fontSize: "15px",
                  fontFamily: "DM Sans, sans-serif",
                  margin: "12px 30px",
                }}
              >
                Login B2B Trips
              </h4>
            </div>
            <StickyHeadTable
              rows={loginTripList}
              selectedTrips={selectedLoginTrips}
              setSelectedTrips={setSelectedLoginTrips}
              setSelectedTripsUI={setSelectedLoginTripsUI}
              pairedTrips={pairedTrips}
              b2bList={b2bLoginList}
              type={"login"}
              b2bPair={b2bPair}
              autoSelect={(type, id, event) =>
                autoSelectHandler(type, id, event)
              }
              autoSelectTrip={autoSelectLogin}
              handleSelectRow={(type,tripId) => handleSelectRow(type,tripId)}
            />
          </div>
        </div>
        <div>
          <p
            style={{
              fontSize: "15px",
              fontWeight: "bold",
              backgroundColor: "white",
              padding: "15px",
              margin: "8px",
              width: "100%",
              border: "1px solid white",
              borderradius: "8px",
            }}
          >
            Paired Trip IDs:{" "}
            <span style={{ fontWeight: "normal" }}>
              {pairedTripIds.join(", ")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default dispatch(MainComponent);
