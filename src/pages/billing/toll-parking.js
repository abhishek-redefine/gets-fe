import React, { useState, useEffect } from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Autocomplete,
    Modal,
    Box
} from "@mui/material";
import moment from "moment";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DATE_FORMAT } from "@/constants/app.constants.";
import { useDispatch } from "react-redux";
import billing from "@/layouts/billing";
import BillingService from "@/services/billing.service";
import { getFormattedLabel } from "@/utils/utils";
import ComplianceService from "@/services/compliance.service";
import TollAndParkingTable from "@/components/billing/tollandParkingTable";
import CreateTollAndParkingModal from "@/components/billing/createTollAndParkingModal";

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 150,
            width: 270,
            overflowX: 'auto',
        },
    },
};
const style = {
    tripTransferStyle: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 650,
      bgcolor: "background.paper",
      height: 400,
      borderRadius: 5,
    },
    generateTripStyle: {
      position: "absolute",
      top: "41%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 650,
      bgcolor: "background.paper",
      height: 400,
      borderRadius: 5,
    },
  };

const TollParking = () => {
    const [searchValues, setSearchValues] = useState({
        officeId: "",
        fromDate: null,
        toDate: null,
        shiftType: "",
        shiftTimeLogin: "",
        shiftTimeLogout: "",
        transportType: "",
        isAdmin: "",
        empId: "",
    });
    const [openGenerateTaxModal, setOpenGenerateTaxModal] = useState(false);
    const handleGenerateTaxModalOpen = () => {
        console.log("Generate Trip modal open");
        setOpenGenerateTaxModal(true);
      };
    
      const handleGenerateTaxModalClose = () => {
        console.log("Generate Trip modal close");
        setOpenGenerateTaxModal(false);
        // console.log("edit trip selected row>>", selectedRow);
      };

    return (
        <div>
            <div>
                <div
                    className="filterContainer"
                    style={{
                        flexWrap: "wrap",
                        alignItems: "center",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "10px",
                        margin: "30px 0",
                        padding: "0 13px",
                    }}
                >
                    <div className='form-control-input'>
                        <InputLabel htmlFor="End-date">From Date</InputLabel>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker name="bookingDate" format={DATE_FORMAT} value={searchValues.fromDate ? moment(searchValues.bookingDate) : null} onChange={(e) => handleFilterChange({ target: { name: "bookingDate", value: e } })} />
                        </LocalizationProvider>
                    </div>
                    <div className='form-control-input'>
                        <InputLabel htmlFor="End-date">To Date</InputLabel>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker name="bookingDate" format={DATE_FORMAT} value={searchValues.toDate ? moment(searchValues.bookingDate) : null} onChange={(e) => handleFilterChange({ target: { name: "bookingDate", value: e } })} />
                        </LocalizationProvider>
                    </div>
                    <div className="form-control-input" style={{ minWidth: "170px", paddingTop: 20 }}>
                        <button
                            type="submit"
                            // onClick={() => fetchSummary()}
                            className="btn btn-primary"
                            style={{ padding: '18px' }}
                        >
                            Apply
                        </button>
                    </div>
                </div>
                <div
                    style={{
                        backgroundColor: "#f9f9f9",
                        borderRadius: "6px",
                        padding: "25px",
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
                        <div>
                            Toll and Parkings
                        </div>
                        <div>
                            <button
                                type="submit"
                                onClick={() => handleGenerateTaxModalOpen()}
                                className="btn btn-primary"
                                style={{ padding: '18px' }}
                            >
                                Create Toll and Parking
                            </button>
                        </div>
                        <Modal
                            open={openGenerateTaxModal}
                            onClose={handleGenerateTaxModalClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style.generateTripStyle}>
                                <CreateTollAndParkingModal
                                    onClose={handleGenerateTaxModalClose}
                                />
                            </Box>
                        </Modal>
                    </div>
                    <TollAndParkingTable />
                </div>
            </div>
        </div>
    );
};

export default billing(TollParking);
