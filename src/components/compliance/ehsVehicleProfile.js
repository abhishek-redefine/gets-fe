import compliance from "@/layouts/compliance";
import React, { useEffect, useState } from "react";
import Grid from "@/components/grid";
import ComplianceService from "@/services/compliance.service";
import AddVehiclePendingApproval from "@/components/compliance/addVehiclePendingApproval";
import EhsEntryDriver from "./ehsEntryDriver";
import EhsEntryVehicle from "./ehsEntryVehicle";
import {
  Button,
  FormControl,
  Autocomplete,
  TextField,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import OfficeService from "@/services/office.service";
import { getFormattedLabel } from "@/utils/utils";
import { DEFAULT_PAGE_SIZE } from "@/constants/app.constants.";
import { useRouter } from "next/router";
import LoaderComponent from "../common/loading";

const EhsVehicleProfile = () => {
  const router = useRouter();
  const headers = [
    {
      key: "vehicleId",
      display: "Vehicle ID",
    },
    {
      key: "vehicleRegistrationNumber",
      display: "Registration No",
    },
    {
      key: "vehicleType",
      display: "Vehicle Type",
    },
    {
      key: "officeId",
      display: "Office ID",
    },
    {
      key: "vendorName",
      display: "Vendor Name",
    },
    {
      key: "complianceStatus",
      display: "Vehicle Compliance Status",
    },
    {
      key: "insuranceExpiryDate",
      display: "Insurance Expiry",
    },
    {
      key: "roadTaxExpiryDate",
      display: "Road Tax Expiry",
    },
    {
      key: "pollutionExpiryDate",
      display: "Pollution Expiry",
    },
    {
      key: "nationalPermitExpiryDate",
      display: "National Permit Expiry",
    },
    {
      key: "fitnessExpiryDate",
      display: "Fitness Expiry",
    },
    {
      key: "manufacturingDate",
      display: "Manufacturing Date",
    },
    {
      key: "inductionDate",
      display: "Induction Date",
    },
    {
      key: "inductionDate",
      display: "Induction Date",
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
          display: "View EHS Entry",
          key: "addEhsEntry",
        },
      ],
    },
  ];

  const [ehsVehicleOpen, setEhsVehicleOpen] = useState(false);
  const [ehsVehicleData, setEhsVehicleData] = useState(false);
  const [vehicleData, setVehicleData] = useState();
  const [openSearchVehicle, setOpenSearchVehicle] = useState(false);
  const [searchedVehicle, setSearchedvehicle] = useState([]);
  const [vehicleId, setVehicleId] = useState("");
  const [officeList, setOfficeList] = useState([]);
  const [officeId, setOfficeId] = useState("");
  const [ehsStatusList, setEhsStatusList] = useState([]);
  const [ehsStatus, setEhsStatus] = useState("");

  const [pagination, setPagination] = useState({
    page: 0,
    size: DEFAULT_PAGE_SIZE,
  });
  const [paginationData, setPaginationData] = useState();
  const [searchBean, setSearchBean] = useState({
    officeId: "",
    complianceStatus: "COMPLIANT",
    ehsStatus: "",
  });

  const [loading, setLoading] = useState(false);

  const handlePageChange = (page) => {
    let updatedPagination = { ...pagination };
    updatedPagination.page = page;
    setPagination(updatedPagination);
  };

  const searchByBean = () => {
    var allSearchValues = { ...searchBean };
    allSearchValues.officeId = officeId;
    allSearchValues.ehsStatus = ehsStatus;
    initializer(false, allSearchValues);
  };

  const onChangeVehicleHandler = (newValue, name, key) => {
    console.log("on change handler", newValue);
    setVehicleId(newValue?.vehicleId);
  };

  const searchForVehicle = async (e) => {
    try {
      setLoading(true);
      if (e.target.value) {
        console.log("searchForVehicle", e.target.value);
        const response = await ComplianceService.searchVehicle(e.target.value);
        console.log(response);
        const { data } = response || {};
        setSearchedvehicle(data);
      } else {
        setSearchedvehicle([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOffice = async () => {
    try {
      setLoading(true);
      const response = await OfficeService.getAllOffices();
      const { data } = response || {};
      const { clientOfficeDTO } = data || {};
      console.log(clientOfficeDTO, "Client office Dto");
      setOfficeList(clientOfficeDTO);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEhsStatus = async () => {
    try {
      setLoading(true);
      const response = await ComplianceService.getMasterData("EhsStatus");
      console.log(response.data);
      setEhsStatusList(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const onMenuItemClick = async (key, clickedItem) => {
    if (key === "addEhsEntry") {
      setEhsVehicleData(clickedItem);
      setEhsVehicleOpen(true);
    }
  };

  const initializer = async (
    resetFlag = false,
    filter = { complianceStatus: "COMPLIANT" }
  ) => {
    try {
      setLoading(true);
      console.log(filter);
      var allValuesSearch = { ...filter };
      Object.keys(allValuesSearch).forEach((objKey) => {
        if (
          allValuesSearch[objKey] === null ||
          allValuesSearch[objKey] === ""
        ) {
          delete allValuesSearch[objKey];
        }
      });
      let params;
      if (resetFlag) {
        params = new URLSearchParams({
          pageNo: 0,
          pageSize: DEFAULT_PAGE_SIZE,
        });
      }
      params = new URLSearchParams(pagination);
      const response = await ComplianceService.getAllVehicles(
        params.toString(),
        allValuesSearch
      );
      setVehicleData(response.data.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOffice();
    fetchEhsStatus();
    initializer();
  }, []);

  const searchVehicleById = async () => {
    try {
      setLoading(true);
      if (vehicleId && vehicleId != "") {
        const response = await ComplianceService.getVehicleById(vehicleId);
        console.log(response.data);
        let list = [response.data.vehicleDTO];
        setVehicleData(list);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="internalSettingContainer">
        {!ehsVehicleOpen && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {/* <div style={{ display: 'flex', justifyContent: 'start' }}>
                    <div className='form-control-input'>
                        <FormControl variant="outlined">
                            <Autocomplete
                                disablePortal
                                id="search-vehicle"
                                options={searchedVehicle}
                                autoComplete
                                open={openSearchVehicle}
                                onOpen={() => {
                                    setOpenSearchVehicle(true);
                                }}
                                onClose={() => {
                                    setOpenSearchVehicle(false);
                                }}
                                onChange={(e, val) => onChangeVehicleHandler(val, "vehicle", "vehicleId")}
                                getOptionKey={(vehicle) => vehicle.vehicleId}
                                getOptionLabel={(vehicle) => vehicle.vehicleRegistrationNumber}
                                freeSolo
                                name="vehicle"
                                renderInput={(params) => <TextField {...params} label="Search Vehicle" onChange={searchForVehicle} />}
                            />
                        </FormControl>
                    </div>
                    <div className='form-control-input' style={{minWidth: "70px"}}>
                        <button type='button' onClick={searchVehicleById} className='btn btn-primary filterApplyBtn'>Search</button>
                    </div>
                    </div> */}
              <div style={{ display: "flex" }}>
                <div
                  style={{ minWidth: "180px" }}
                  className="form-control-input"
                >
                  <FormControl fullWidth>
                    <InputLabel id="primary-office-label">
                      Primary Office
                    </InputLabel>
                    <Select
                      style={{ width: "180px" }}
                      labelId="primary-office-label"
                      id="officeId"
                      value={officeId}
                      name="officeId"
                      label="Office ID"
                      onChange={(e) => setOfficeId(e.target.value)}
                    >
                      {!!officeList?.length &&
                        officeList.map((office, idx) => (
                          <MenuItem key={idx} value={office.officeId}>
                            {getFormattedLabel(office.officeId)},{" "}
                            {office.address}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>
                <div
                  style={{ minWidth: "180px" }}
                  className="form-control-input"
                >
                  <FormControl fullWidth>
                    <InputLabel id="ehs-status-label">EHS Status</InputLabel>
                    <Select
                      style={{ width: "180px" }}
                      labelId="ehs-status-label"
                      id="ehsStatusId"
                      value={ehsStatus}
                      name="ehsStatusId"
                      label="EHS Status"
                      onChange={(e) => setEhsStatus(e.target.value)}
                    >
                      {!!ehsStatusList?.length &&
                        ehsStatusList.map((status, idx) => (
                          <MenuItem key={idx} value={status.value}>
                            {status.displayName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>
                <div
                  className="form-control-input"
                  style={{ minWidth: "70px" }}
                >
                  <button
                    type="button"
                    onClick={searchByBean}
                    className="btn btn-primary filterApplyBtn"
                  >
                    Apply
                  </button>
                </div>
                <div
                  className="form-control-input"
                  style={{ minWidth: "70px" }}
                >
                  <button
                    type="button"
                    onClick={() => initializer(true)}
                    className="btn btn-primary filterApplyBtn"
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div
                  className="form-control-input"
                  style={{ minWidth: "70px" }}
                >
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => router.push("ehsEntry")}
                    style={{ padding: 18 }}
                  >
                    Add EHS Entry
                  </button>
                </div>
              </div>
            </div>
            <div className="gridContainer">
              <Grid
                headers={headers}
                listing={vehicleData}
                onMenuItemClick={onMenuItemClick}
                enableDisableRow={true}
              />
            </div>
          </div>
        )}
        {ehsVehicleOpen && (
          <EhsEntryVehicle
            EhsVehicleData={ehsVehicleData}
            setEhsVehicleOpen={setEhsVehicleOpen}
            ehsStatusList={ehsStatusList}
          />
        )}
      </div>
      {loading ? (
        <div
          style={{
            position: "absolute",
            // backgroundColor: "pink",
            zIndex: "1",
            top: "55%",
            left: "50%",
          }}
        >
          <LoaderComponent />
        </div>
      ) : (
        " "
      )}
    </div>
  );
};

export default EhsVehicleProfile;
