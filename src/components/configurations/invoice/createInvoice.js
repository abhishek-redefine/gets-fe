import React, { useEffect, useState } from "react";
import Configurations from "@/layouts/configurations";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { DATE_FORMAT } from "@/constants/app.constants.";
import BillingService from "@/services/billing.service";

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 150,
            width: 250,
        },
    },
};

const AddInvoice = ({ SetIsAddConfig }) => {
    const [values, setValues] = useState({
        invoiceFields: [{ month: "", fromDate: "", toDate: "" }],
    });

    const monthList = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const [errors, setErrors] = useState([
        { month: false, fromDate: false, toDate: false },
    ]);

    const handleInvoiceFieldsChange = (index, name, value) => {
        const updatedInvoiceFields = [...values.invoiceFields];
        if (name === "fromDate" || name === "toDate")
            updatedInvoiceFields[index][name] = value
                ? value.format("YYYY-MM-DD")
                : "";
        else updatedInvoiceFields[index][name] = value;
        setValues((prevValues) => ({
            ...prevValues,
            invoiceFields: updatedInvoiceFields,
        }));
    };

    const addInvoiceField = () => {
        setValues((prevValues) => ({
            ...prevValues,
            invoiceFields: [
                ...prevValues.invoiceFields,
                { month: "", fromDate: "", toDate: "" },
            ],
        }));
    };

    const removeInvoiceField = (index) => {
        const updatedInvoiceFields = values.invoiceFields.filter(
            (_, i) => i !== index
        );
        setValues((prevValues) => ({
            ...prevValues,
            invoiceFields: updatedInvoiceFields,
        }));
    };

    const validateFields = () => {
        let validationErrors = [...errors];
        let valid = true;

        values.invoiceFields.forEach((field, index) => {
            let fieldErrors = { month: false, fromDate: false, toDate: false };

            if (!field.month) {
                fieldErrors.month = true;
                valid = false;
            }
            if (!field.fromDate) {
                fieldErrors.fromDate = true;
                valid = false;
            }
            if (!field.toDate) {
                fieldErrors.toDate = true;
                valid = false;
            }

            validationErrors[index] = fieldErrors;
        });

        setErrors(validationErrors);
        return valid;
    };

    const handleSave = async () => {
        if (validateFields()) {
            console.log("Values>>>", values.invoiceFields);
            // Map over invoiceFields to create an array of promises, then wait for all to resolve
            const createConfigPromises = values.invoiceFields.map((val) => {
                let allInvoiceFields = {...val};
                allInvoiceFields.month = `${val.month.substring(0,3)} (${moment(val.fromDate).format('DD/MMM/YYYY')} - ${moment(val.toDate).format('DD/MMM/YYYY')})`;
                createConfig(allInvoiceFields);
            });
            try {
                await Promise.all(createConfigPromises); // Waits for all createConfig calls to complete
                setTimeout(()=>{
                    SetIsAddConfig(false); // Called after all API calls are done
                },[500]);
            } catch (error) {
                console.error("Error in one of the createConfig calls:", error);
            }
        } else {
            console.log("Please fill all required fields.");
        }
    };

    const createConfig = async (body) => {
        try {
            const response = await BillingService.createConfig(body);
            console.log(response.data);
        } catch (er) {
            console.log(er);
        }
    }

    const handleResetButton = () => {
        let allValues = {
            invoiceFields: [{ month: "", fromDate: "", toDate: "" }],
        };
        setValues(allValues);
        setErrors([{ month: false, fromDate: false, toDate: false }]);
    };

    //   useEffect(() => {}, []);

    return (
        <div className="mainSettingsContainer">
            <h2>Invoice</h2>
            <div
                style={{
                    backgroundColor: "#FFFFFF",
                    padding: "20px 30px",
                    borderRadius: 5,
                    marginTop: 20,
                }}
            >
                {values.invoiceFields.map((invoice, index) => (
                    <div key={index}>
                        <div className="form-control-input">
                            <FormControl fullWidth>
                                <InputLabel id="month-label">Month</InputLabel>
                                <Select
                                    labelId="month-label"
                                    id="month"
                                    value={invoice.month}
                                    name="month"
                                    label="Month"
                                    onChange={(e) =>
                                        handleInvoiceFieldsChange(
                                            index,
                                            e.target.name,
                                            e.target.value
                                        )
                                    }
                                    required
                                    MenuProps={MenuProps}
                                    style={{ backgroundColor: "#ffffff" }}
                                >
                                    {monthList.map((month) => (
                                        <MenuItem key={month} value={month}>
                                            {month}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors[index]?.month && (
                                    <FormHelperText style={{ color: "#d32f2f" }}>
                                        Month is required
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </div>

                        <div
                            className="form-control-input"
                            style={{ backgroundColor: "white" }}
                        >
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                    name="fromDate"
                                    format={DATE_FORMAT}
                                    value={invoice.fromDate ? moment(invoice.fromDate) : null}
                                    onChange={(date) =>
                                        handleInvoiceFieldsChange(index, "fromDate", date)
                                    }
                                    required
                                    label="Start Date"
                                    error={errors[index]?.fromDate}
                                    slotProps={{
                                        textField: {
                                            helperText:
                                                errors[index]?.fromDate && "Start Date is required",
                                            FormHelperTextProps: {
                                                sx: {
                                                    color: "#d32f2f",
                                                },
                                            },
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </div>

                        <div
                            className="form-control-input"
                            style={{ backgroundColor: "white" }}
                        >
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                    name="toDate"
                                    format={DATE_FORMAT}
                                    value={invoice.toDate ? moment(invoice.toDate) : null}
                                    onChange={(date) =>
                                        handleInvoiceFieldsChange(index, "toDate", date)
                                    }
                                    required
                                    label="End Date"
                                    error={errors[index]?.endDateDate}
                                    slotProps={{
                                        textField: {
                                            helperText:
                                                errors[index]?.toDate && "End Date is required",
                                            FormHelperTextProps: {
                                                sx: {
                                                    color: "#d32f2f",
                                                },
                                            },
                                        },
                                    }}
                                    minDate={invoice.fromDate ? moment(invoice.fromDate) : null}
                                />
                            </LocalizationProvider>
                        </div>

                        {values.invoiceFields.length > 1 && (
                            <IconButton
                                onClick={() => removeInvoiceField(index)}
                                aria-label="remove row"
                            >
                                <RemoveIcon />
                            </IconButton>
                        )}
                        <IconButton onClick={addInvoiceField} aria-label="add row">
                            <AddIcon />
                        </IconButton>
                    </div>
                ))}

                <div className="addBtnContainer" style={{ marginTop: 250 }}>
                    <div>
                        <button className="btn btn-secondary" onClick={handleResetButton}>
                            Reset
                        </button>
                    </div>
                    <div style={{ display: "flex" }}>
                        <button className="btn btn-secondary" onClick={()=>SetIsAddConfig(false)}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={handleSave}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddInvoice;
