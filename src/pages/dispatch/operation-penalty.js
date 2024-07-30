import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { getFormattedLabel } from "@/utils/utils";
import { DATE_FORMAT, MASTER_DATA_TYPES } from "@/constants/app.constants.";
import OfficeService from "@/services/office.service";
import { useDispatch, useSelector } from "react-redux";
import dispatch from "@/layouts/dispatch";
import { setMasterData } from "@/redux/master.slice";
import MasterDataService from "@/services/masterdata.service";
import OperationPenaltyTable from "@/components/dispatch/operation-penalty";
import Modal from "@mui/material/Modal";
import AddPenaltyModal from "@/components/dispatch/addPenaltyModal";
import DispatchService from "@/services/dispatch.service";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  height: 550,
  borderRadius: 5,
};


const MainComponent = () => {
  const [office, setOffice] = useState([]);
  const[openModal, setOpenModal] = useState(false);
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);
  const [showAction, setShowAction] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [list,setList] = useState([]);
  const [searchValues, setSearchValues] = useState({
    officeId: "",
    shiftType: "",
    date: moment().format("YYYY-MM-DD"),
  });
  const { ShiftType: shiftTypes } = useSelector((state) => state.master);
  const dispatch = useDispatch();

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    let newSearchValues = { ...searchValues };
    if (name === "date") newSearchValues[name] = value.format("YYYY-MM-DD");
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

  const fetchSummary = async () => {
    try {
      console.log("search values>>>>>", searchValues);
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
        // params,
        allSearchValues
      );
      console.log("response: ", response.data.data);
      // setData(response.data);
      setList(response.data.data);
    } catch (error) {
      console.log(error);
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

  const onRowSelect = (row) => {
    setSelectedRow(row);
    console.log("slected",row)
  };

  useEffect(() => {
    if (!shiftTypes?.length) {
      fetchMasterData(MASTER_DATA_TYPES.SHIFT_TYPE);
    }
    fetchAllOffices();
  }, []);

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
        <div 
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#FFF",
            margin: "0 20px",
            borderRadius: ' 15px 15px 0 0',
            padding: '15px 25px'
          }}
        >
          <h3 style={{ }}>Operation Penalty</h3>
          <div style={{ minWidth: "90px", }}>
            <button
              type="add-penalty"
              style={{
                backgroundColor: "#f6ce47",
                color: "black",
                border: "none",
                borderRadius: "6px",
                fontSize: "15px",
                padding: "13px 17px",
                cursor: "pointer",
              }}
              onClick={handleModalOpen}
            >
              Add Penalty
            </button>
          </div>
        </div>
        <OperationPenaltyTable list={list} onRowSelect={onRowSelect} />
      </div>

      <Modal
            open={openModal}
            onClose={handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <AddPenaltyModal
                data={selectedRow}
                onClose={handleModalClose}
              />
            </Box>
          </Modal>



    </div>
  );
};

export default dispatch(MainComponent);
