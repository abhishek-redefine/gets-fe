// import React, { useState, useEffect } from "react";
// import StickyHeadTable from "../../components/dispatch/B2BTable";
// import { logoutB2B, loginB2B } from "./data";
// import {
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Autocomplete,
//   TextField,
// } from "@mui/material";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
// import moment from "moment";
// import { getFormattedLabel } from "@/utils/utils";
// import {
//   DATE_FORMAT,
//   DEFAULT_PAGE_SIZE,
//   MASTER_DATA_TYPES,
//   SHIFT_TYPE,
// } from "@/constants/app.constants.";
// import OfficeService from "@/services/office.service";
// import { useDispatch, useSelector } from "react-redux";
// import dispatch from "@/layouts/dispatch";
// import { setMasterData } from "@/redux/master.slice";
// import DispatchService from "@/services/dispatch.service";
// import MasterDataService from "@/services/masterdata.service";
// import { toggleToast } from '@/redux/company.slice';

// const MainComponent = () => {
//   const [selectedLogoutTrips, setSelectedLogoutTrips] = useState([]);
//   const [selectedLoginTrips, setSelectedLoginTrips] = useState([]);
//   const [selectedLogoutTripsUI, setSelectedLogoutTripsUI] = useState([]);
//   const [selectedLoginTripsUI, setSelectedLoginTripsUI] = useState([]);
//   const [pairedTrips, setPairedTrips] = useState([]);
//   const [pairedTripIds, setPairedTripIds] = useState([]);
//   const [pairedTripIdsUI, setPairedTripIdsUI] = useState([]);
//   const [office, setOffice] = useState([]);
//   const [loginTripList, setLoginTripList] = useState([]);
//   const [logoutTripList, setLogoutTripList] = useState([]);
//   const [pagination, setPagination] = useState({
//     page: 0,
//     size: 10
//   })
//   // const [shiftTypes, setShiftTypes] = useState([]);
//   const [searchValuesForLogout, setSearchValuesForLogout] = useState({
//     officeIdForLogout: "",
//     shiftTypeForLogout: "LOGOUT",
//     dateForLogout: moment().format("YYYY-MM-DD"),
//   });
//   const [searchValuesForLogin, setSearchValuesForLogin] = useState({
//     officeIdForLogin: "",
//     shiftTypeForLogin: "LOGIN",
//     dateForLogin: moment().format("YYYY-MM-DD"),
//   })
//   const { ShiftType: shiftTypes } = useSelector((state) => state.master);
//   const dispatch = useDispatch();

//   const resetFilter = () => {
//     let allSearchValue = {
//       officeId: office[0].officeId,
//       date: moment().format("YYYY-MM-DD"),
//       shiftType: "",
//     };
//     setSearchValuesForLogin(allSearchValue);
//   };

//   const fetchMasterData = async (type) => {
//     try {
//       const response = await MasterDataService.getMasterData(type);
//       const { data } = response || {};
//       if (data?.length) {
//         console.log(data);
//         dispatch(setMasterData({ data, type }));
//       }
//     } catch (e) { }
//   };

//   const getTrips = async () => {
//     try {
//       let params = new URLSearchParams(pagination);
//       let searchValues = {
//         "officeId": searchValuesForLogin.officeIdForLogin,
//         "shiftType": searchValuesForLogin.shiftTypeForLogin,
//         "tripDateStr": searchValuesForLogin.dateForLogin
//       }
//       const loginResponse = await DispatchService.getTripSearchByBean(params, searchValues);
//       searchValues = {
//         "officeId": searchValuesForLogout.officeIdForLogout,
//         "shiftType": searchValuesForLogout.shiftTypeForLogout,
//         "tripDateStr": searchValuesForLogout.dateForLogout
//       }
//       const logoutResponse = await DispatchService.getTripSearchByBean(params, searchValues);
//       setLoginTripList(loginResponse.data.data);
//       setLogoutTripList(logoutResponse.data.data);
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   const handleFilterChange = (e) => {
//     const { target } = e;
//     const { value, name } = target;
//     let newSearchValues = name.includes("ForLogin") ? { ...searchValuesForLogin } : { ...searchValuesForLogout };
//     if (name === "dateForLogin" || name === "dateForLogout") newSearchValues[name] = value.format("YYYY-MM-DD");
//     else newSearchValues[name] = value;
//     name.includes("ForLogin") ? setSearchValuesForLogin(newSearchValues) : setSearchValuesForLogout(newSearchValues);
//   };

//   const handlePairTrips = () => {
//     if (selectedLogoutTrips.length === 1 && selectedLoginTrips.length === 1) {
//       console.log(selectedLogoutTrips, selectedLoginTrips);
//       const newPairedTrip = `${selectedLogoutTrips[0]}-${selectedLoginTrips[0]}`;
//       const newPairedTripUI = `${selectedLogoutTripsUI[0]}-${selectedLoginTripsUI[0]}`;
//       console.log(newPairedTripUI)
//       setPairedTrips([
//         ...pairedTrips,
//         selectedLogoutTrips[0],
//         selectedLoginTrips[0],
//       ]);
//       setPairedTripIds([...pairedTripIds, newPairedTrip]);
//       setPairedTripIdsUI([...pairedTripIdsUI, newPairedTripUI]);
//       setSelectedLogoutTrips([]);
//       setSelectedLoginTrips([]);
//     }
//   };

//   const generateB2B = async () => {
//     try {
//       console.log(pairedTripIds)
//       const b2BTripDTO = {
//         "b2BTripDTO": []
//       }
//       pairedTripIds.map((val,index)=>{
//         const tripId = val.split("-");
//         b2BTripDTO.b2BTripDTO.push({
//           "id": 0,
//           "combinedTripId": val,
//           "loginTripId": tripId[1],
//           "logoutTripId": tripId[0]
//         })
//       })
//       const response = await DispatchService.generateB2bTrip(b2BTripDTO);
//       console.log(response);
//       if(response.status === 201){
//         dispatch(toggleToast({ message: 'B2B created successfully!', type: 'success' }));
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   const handleUnpairTrips = () => {
//     setPairedTrips([]);
//     setPairedTripIds([]);
//     setSelectedLogoutTrips([]);
//     setSelectedLoginTrips([]);
//     setPairedTripIdsUI([]);
//   };
  
//   const fetchAllOffices = async () => {
//     try {
//       const response = await OfficeService.getAllOffices();
//       const { data } = response || {};
//       const { clientOfficeDTO } = data || {};
//       console.log(clientOfficeDTO);
//       setSearchValuesForLogin(
//         { ...searchValuesForLogin },
//         (searchValuesForLogin["officeIdForLogin"] = clientOfficeDTO[0]?.officeId)
//       );
//       setSearchValuesForLogout(
//         { ...searchValuesForLogout },
//         (searchValuesForLogout["officeIdForLogout"] = clientOfficeDTO[0]?.officeId)
//       )
//       setOffice(clientOfficeDTO);
//     } catch (e) { }
//   };

//   useEffect(() => {
//     setLoginTripList([]);
//     setLogoutTripList([])
//     if (!shiftTypes?.length) {
//       fetchMasterData(MASTER_DATA_TYPES.SHIFT_TYPE);
//     }
//     fetchAllOffices();
//   }, []);

//   return (
//     <div>
//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div
//           className="gridContainer"
//           style={{
//             margin: "20px 0",
//             padding: "0",
//             backgroundColor: "#f9f9f9",
//             borderRadius: "20px 0 0 20px",
//           }}
//         >
//           <div
//             className="filterContainer"
//             style={{
//               display: "flex",
//               alignItems: "center",
//               margin: "0 15px",
//               padding: "0 0 0 40px",
//             }}
//           >
//             <h4 style={{ fontSize: "14px" }}>Logout B2B Trips</h4>
//             {office.length > 0 && (
//               <div style={{ minWidth: "0px" }} className="form-control-input">
//                 <FormControl style={{ padding: "4px 0" }}>
//                   <InputLabel
//                     id="logout-primary-office-label"
//                     style={{ fontSize: "14px" }}
//                   >
//                     Office ID
//                   </InputLabel>
//                   <Select
//                     style={{ width: "160px", height: "40px", fontSize: "14px" }}
//                     labelId="logout-primary-office-label"
//                     id="logoutOfficeId"
//                     value={searchValuesForLogout.officeIdForLogout}
//                     name="officeIdForLogout"
//                     label="Office ID"
//                     onChange={handleFilterChange}
//                   >
//                     {!!office?.length &&
//                       office.map((office, idx) => (
//                         <MenuItem key={idx} value={office.officeId}>
//                           {getFormattedLabel(office.officeId)}, {office.address}
//                         </MenuItem>
//                       ))}
//                   </Select>
//                 </FormControl>
//               </div>
//             )}

//             <div style={{ margin: "0 8px 18px" }}>
//               <InputLabel htmlFor="logout-date" style={{ fontSize: "14px" }}>
//                 Date
//               </InputLabel>
//               <LocalizationProvider dateAdapter={AdapterMoment}>
//                 <DatePicker
//                   name="dateForLogout"
//                   format={DATE_FORMAT}
//                   value={
//                     searchValuesForLogout.dateForLogout
//                       ? moment(searchValuesForLogout.dateForLogout)
//                       : null
//                   }
//                   onChange={(e) =>
//                     handleFilterChange({ target: { name: "dateForLogout", value: e } })
//                   }
//                   slotProps={{
//                     textField: {
//                       size: "small",
//                       sx: {
//                         width: "140px",
//                         "& .MuiInputBase-input": { fontSize: "14px" },
//                       },
//                     },
//                   }}
//                 />
//               </LocalizationProvider>
//             </div>

//             <FormControl style={{ margin: "0 8px", padding: "4px 0" }}>
//               <InputLabel
//                 id="logout-shiftType-label"
//                 style={{ fontSize: "14px" }}
//               >
//                 Shift Type
//               </InputLabel>
//               <Select
//                 disabled={true}
//                 style={{ width: "120px", height: "40px" }}
//                 labelId="logout-shiftType-label"
//                 id="logoutShiftType"
//                 name="shiftTypeForLogout"
//                 value={searchValuesForLogout.shiftTypeForLogout}
//                 label="Shift Type"
//                 onChange={handleFilterChange}
//               >
//                 {shiftTypes.map((sT, idx) => (
//                   <MenuItem key={idx} value={sT.value}>
//                     {getFormattedLabel(sT.value)}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </div>
//         </div>

//         <div
//           className="gridContainer"
//           style={{ margin: "20px 0", padding: "0", backgroundColor: "#f9f9f9" }}
//         >
//           <div
//             className="filterContainer"
//             style={{
//               display: "flex",
//               alignItems: "center",
//               margin: "0 20px",
//             }}
//           >
//             <h4 style={{ fontSize: "14px" }}>Login B2B Trips</h4>
//             {office.length > 0 && (
//               <div style={{ minWidth: "0px" }} className="form-control-input">
//                 <FormControl style={{ padding: "4px 0" }}>
//                   <InputLabel
//                     id="login-primary-office-label"
//                     style={{ fontSize: "14px" }}
//                   >
//                     Office ID
//                   </InputLabel>
//                   <Select
//                     style={{ width: "150px", height: "40px", fontSize: "14px" }}
//                     labelId="login-primary-office-label"
//                     id="loginOfficeId"
//                     value={searchValuesForLogin.officeIdForLogin}
//                     name="officeIdForLogin"
//                     label="Office ID"
//                     onChange={handleFilterChange}
//                   >
//                     {!!office?.length &&
//                       office.map((office, idx) => (
//                         <MenuItem key={idx} value={office.officeId}>
//                           {getFormattedLabel(office.officeId)}, {office.address}
//                         </MenuItem>
//                       ))}
//                   </Select>
//                 </FormControl>
//               </div>
//             )}

//             <div style={{ margin: "0 8px 18px" }}>
//               <InputLabel htmlFor="logout-date" style={{ fontSize: "14px" }}>
//                 Date
//               </InputLabel>
//               <LocalizationProvider dateAdapter={AdapterMoment}>
//                 <DatePicker
//                   name="date"
//                   format={DATE_FORMAT}
//                   value={
//                     searchValuesForLogin.dateForLogin
//                       ? moment(searchValuesForLogin.dateForLogin)
//                       : null
//                   }
//                   onChange={(e) =>
//                     handleFilterChange({ target: { name: "dateForLogin", value: e } })
//                   }
//                   slotProps={{
//                     textField: {
//                       size: "small",
//                       sx: {
//                         width: "140px",
//                         "& .MuiInputBase-input": { fontSize: "14px" },
//                       },
//                     },
//                   }}
//                 />
//               </LocalizationProvider>
//             </div>

//             <FormControl style={{ margin: "0 8px", padding: "4px 0" }}>
//               <InputLabel
//                 id="login-shiftType-label"
//                 style={{ fontSize: "14px" }}
//               >
//                 Shift Type
//               </InputLabel>
//               <Select
//                 disabled={true}
//                 style={{ width: "120px", height: "40px" }}
//                 labelId="login-shiftType-label"
//                 id="loginShiftType"
//                 name="shiftTypeForLogin"
//                 value={searchValuesForLogin.shiftTypeForLogin}
//                 label="Shift Type"
//                 onChange={handleFilterChange}
//               >
//                 {shiftTypes.map((sT, idx) => (
//                   <MenuItem key={idx} value={sT.value}>
//                     {getFormattedLabel(sT.value)}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </div>
//         </div>

//         <div
//           style={{
//             display: "flex",
//             padding: "24px 0",
//             margin: "20px 0",
//             backgroundColor: "#f9f9f9",
//             borderRadius: "0 20px 20px 0",
//           }}
//         >
//           <button
//             type="submit"
//             onClick={() => getTrips()}
//             className="btn btn-primary filterApplyBtn"
//             style={{
//               width: "80px",
//               height: "40px",
//               fontSize: "14px",
//               fontWeight: "bold",
//               padding: "0",
//               margin: "0 8px",
//             }}
//           >
//             Apply
//           </button>
//           <button
//             type="submit"
//             onClick={resetFilter}
//             className="btn btn-primary filterApplyBtn"
//             style={{
//               width: "80px",
//               height: "40px",
//               fontSize: "14px",
//               fontWeight: "bold",
//               padding: "0",
//               margin: "0 20px 0 8px",
//             }}
//           >
//             Reset
//           </button>
//         </div>
//       </div>

//       <div
//         style={{
//           padding: "40px",
//           backgroundColor: "#f9f9f9",
//           fontFamily: "DM Sans, sans-serif",
//         }}
//       >
//         <div
//           style={{
//             marginBottom: "20px",
//             display: "flex",
//             justifyContent: "space-between",
//           }}
//         >
//           <div>
//             <button
//               onClick={handlePairTrips}
//               style={{
//                 backgroundColor: "#f9f9f9",
//                 color: "black",
//                 border: "2px solid #f6ce47",
//                 borderRadius: "6px",
//                 padding: "6px 10px",
//                 marginLeft: '11px',
//                 marginRight: "20px",
//                 fontWeight: "bold",
//                 cursor: "pointer",
//               }}
//             >
//               Pair Trip IDs
//             </button>
//             <button
//               onClick={handleUnpairTrips}
//               style={{
//                 backgroundColor: "#f9f9f9",
//                 color: "black",
//                 border: "2px solid #f6ce47",
//                 borderRadius: "6px",
//                 fontWeight: "bold",
//                 padding: "6px 10px",
//                 cursor: "pointer",
//                 marginLeft: "30px",
//               }}
//             >
//               Unpair Trip IDs
//             </button>
//           </div>

//           <div>
//             <button
//               onClick={()=>generateB2B()}
//               style={{
//                 backgroundColor: "#f6ce47",
//                 color: "black",
//                 border: "2px solid #f6ce47",
//                 borderRadius: "6px",
//                 fontWeight: "bold",
//                 padding: "6px 10px",
//                 cursor: "pointer",
//               }}
//             >
//               Generate B2B IDs
//             </button>
//           </div>
//         </div>
//         <div style={{ display: "flex", gap: "20px" }}>
//           <div style={{ flex: 1, minWidth: "600px" }}>
//             <div
//               style={{
//                 backgroundColor: "white",
//                 border: "1px solid white",
//                 borderRadius: "10px 10px 0 0",
//                 margin: "0 10px",
//                 width: "100%",
//               }}
//             >
//               <h4
//                 style={{
//                   fontSize: "15px",
//                   fontFamily: "DM Sans, sans-serif",
//                   margin: "12px 30px",
//                 }}
//               >
//                 Logout B2B Trips
//               </h4>
//             </div>
//             <StickyHeadTable
//               rows={logoutTripList}
//               selectedTrips={selectedLogoutTrips}
//               setSelectedTrips={setSelectedLogoutTrips}
//               setSelectedTripsUI={setSelectedLogoutTripsUI}
//               pairedTrips={pairedTrips}
//             />
//           </div>
//           <div style={{ flex: 1, minWidth: "600px" }}>
//             <div
//               style={{
//                 backgroundColor: "white",
//                 border: "1px solid white",
//                 borderRadius: "10px 10px 0 0",
//                 margin: "0 10px",
//                 width: "100%",
//               }}
//             >
//               <h4
//                 style={{
//                   fontSize: "15px",
//                   fontFamily: "DM Sans, sans-serif",
//                   margin: "12px 30px",
//                 }}
//               >
//                 Login B2B Trips
//               </h4>
//             </div>
//             <StickyHeadTable
//               rows={loginTripList}
//               selectedTrips={selectedLoginTrips}
//               setSelectedTrips={setSelectedLoginTrips}
//               setSelectedTripsUI={setSelectedLoginTripsUI}
//               pairedTrips={pairedTrips}
//             />
//           </div>
//         </div>
//         <div>
//           <p
//             style={{
//               fontSize: "15px",
//               fontWeight: "bold",
//               backgroundColor: "white",
//               padding: "15px",
//               margin: "8px",
//               width: "100%",
//               border: "1px solid white",
//               borderradius: "8px",
//             }}
//           >
//             Paired Trip IDs:{" "}
//             <span style={{ fontWeight: "normal" }}>
//               {pairedTripIdsUI.join(", ")}
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default dispatch(MainComponent);




import React, { useState, useEffect } from "react";
import StickyHeadTable from "../../components/dispatch/B2BTable";
import { logoutB2B, loginB2B } from "./data";
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
import { toggleToast } from '@/redux/company.slice';

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
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10
  })
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
  })
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
    } catch (e) { }
  };

  const getTrips = async () => {
    try {
      let params = new URLSearchParams(pagination);
      let searchValues = {
        "officeId": searchValuesForLogin.officeIdForLogin,
        "shiftType": searchValuesForLogin.shiftTypeForLogin,
        "tripDateStr": searchValuesForLogin.dateForLogin
      }
      const loginResponse = await DispatchService.getTripSearchByBean(params, searchValues);
      searchValues = {
        "officeId": searchValuesForLogout.officeIdForLogout,
        "shiftType": searchValuesForLogout.shiftTypeForLogout,
        "tripDateStr": searchValuesForLogout.dateForLogout
      }
      const logoutResponse = await DispatchService.getTripSearchByBean(params, searchValues);
      setLoginTripList(loginResponse.data.data);
      setLogoutTripList(logoutResponse.data.data);
    } catch (err) {
      console.log(err);
    }
  }

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    let newSearchValues = name.includes("ForLogin") ? { ...searchValuesForLogin } : { ...searchValuesForLogout };
    if (name === "dateForLogin" || name === "dateForLogout") newSearchValues[name] = value.format("YYYY-MM-DD");
    else newSearchValues[name] = value;
    name.includes("ForLogin") ? setSearchValuesForLogin(newSearchValues) : setSearchValuesForLogout(newSearchValues);
  };



  const handlePairTrips = () => {
    if (selectedLogoutTrips.length === 1 && selectedLoginTrips.length === 1) {
    console.log(selectedLogoutTrips, selectedLoginTrips);
    const newPairedTrip = `${selectedLogoutTrips[0]}-${selectedLoginTrips[0]}`;
    const newPairedTripUI = `${selectedLogoutTripsUI[0]}-${selectedLoginTripsUI[0]}`;
    console.log("newPairedTripUI: " +newPairedTripUI)

      if (!pairedTripIds.includes(newPairedTrip)) {
        setPairedTrips([...pairedTrips, selectedLogoutTrips[0], selectedLoginTrips[0]]);
        setPairedTripIds([...pairedTripIds, newPairedTrip]);
        setPairedTripIdsUI([...pairedTripIdsUI, newPairedTripUI]);

        setSelectedLogoutTrips([]);
        setSelectedLoginTrips([]);
      }

      // Automatic Selection functionality
      if (pairedTripIds.includes(newPairedTrip) > 0) {
        if (selectedLogoutTrips.length === 1) {
          setSelectedLoginTrips(selectedLoginTrips);
        } else if (selectedLoginTrips.length === 1) {
          setSelectedLogoutTrips(selectedLogoutTrips);
        }
      }
    }
  };



  const handleUnpairTrips = () => {
    setPairedTrips([]);
    setPairedTripIds([]);
    setSelectedLogoutTrips([]);
    setSelectedLoginTrips([]);
    setPairedTripIdsUI([]);
  };
  
  const generateB2B = async () => {
    try {
      console.log(pairedTripIds)
      const b2BTripDTO = {
        "b2BTripDTO": []
      }
      pairedTripIds.map((val,index)=>{
        const tripId = val.split("-");
        b2BTripDTO.b2BTripDTO.push({
          "id": 0,
          "combinedTripId": val,
          "loginTripId": tripId[1],
          "logoutTripId": tripId[0]
        })
      })
      const response = await DispatchService.generateB2bTrip(b2BTripDTO);
      console.log(response);
      if(response.status === 201){
        dispatch(toggleToast({ message: 'B2B created successfully!', type: 'success' }));
      }
    } catch (err) {
      console.log(err);
    }
  }

  const fetchAllOffices = async () => {
    try {
      const response = await OfficeService.getAllOffices();
      const { data } = response || {};
      const { clientOfficeDTO } = data || {};
      console.log(clientOfficeDTO);
      setSearchValuesForLogin(
        { ...searchValuesForLogin },
        (searchValuesForLogin["officeIdForLogin"] = clientOfficeDTO[0]?.officeId)
      );
      setSearchValuesForLogout(
        { ...searchValuesForLogout },
        (searchValuesForLogout["officeIdForLogout"] = clientOfficeDTO[0]?.officeId)
      )
      setOffice(clientOfficeDTO);
    } catch (e) { }
  };

  useEffect(() => {
    setLoginTripList([]);
    setLogoutTripList([])
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
                    handleFilterChange({ target: { name: "dateForLogout", value: e } })
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
                    handleFilterChange({ target: { name: "dateForLogin", value: e } })
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
            onClick={() => getTrips()}
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
                marginLeft: '11px',
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
              onClick={()=>generateB2B()}
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
              {pairedTripIdsUI.join(", ")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default dispatch(MainComponent);




