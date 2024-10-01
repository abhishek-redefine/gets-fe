import React, { useEffect, useState } from "react";
import AdminSettings from "@/layouts/admin-settings";
import OfficeService from "@/services/office.service";
import Grid from "@/components/grid";
import {
  DATE_FORMAT,
  DATE_FORMAT_API,
  DEFAULT_PAGE_SIZE,
} from "@/constants/app.constants.";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import moment from "moment";
import { useFormik } from "formik";
import { validationSchema } from "./../../components/admin-settings-client/validationSchema";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { getFormattedLabel } from "@/utils/utils";
import { useDispatch } from "react-redux";
import { toggleToast } from "@/redux/company.slice";
import LoaderComponent from "@/components/loader";

const Client = () => {
  const headers = [
    {
      key: "officeId",
      display: "Office ID",
    },
    {
      key: "holidayDate",
      display: "Date",
    },
    {
      key: "occasion",
      display: "Occasion",
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
          display: "Remove Holiday",
          key: "remove",
        },
      ],
    },
  ];

  const [initialValues, setInitialValues] = useState({
    officeId: "",
    holidayDate: "",
    occasion: "",
  });

  const dispatch = useDispatch();
  const [holidaysListing, setHolidaysListing] = useState();
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [holidayToRemove, setHolidayToRemove] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paginationData, setPaginationData] = useState();
  const [offices, setOffice] = useState([]);
  const [pagination, setPagination] = useState({
    pageNo: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [loading, setLoading] = useState(false);

  const fetchAllHolidays = async () => {
    try {
      setLoading(true);
      //await new Promise((resolve) => setTimeout(resolve, 5000));
      const response = await OfficeService.getAllHolidays(pagination);
      const { data } = response || {};
      const { paginatedResponse } = data || {};
      paginatedResponse?.content.forEach((element) => {
        if (element.holidayDate) {
          element.holidayDate = moment(element.holidayDate).format(DATE_FORMAT);
        }
      });
      setHolidaysListing(paginatedResponse?.content || []);
      let localPaginationData = { ...paginatedResponse };
      delete localPaginationData?.content;
      setPaginationData(localPaginationData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOffices = async () => {
    try {
      const response = await OfficeService.getAllOffices();
      const { data } = response || {};
      const { clientOfficeDTO } = data || {};
      setOffice(clientOfficeDTO);
    } catch (e) {}
  };

  useEffect(() => {
    fetchAllHolidays();
  }, [pagination]);

  useEffect(() => {
    fetchAllOffices();
  }, []);

  const handlePageChange = (page) => {
    let updatedPagination = { ...pagination };
    updatedPagination.pageNo = page;
    setPagination(updatedPagination);
  };

  const onMenuItemClick = (key, values) => {
    if (key === "remove") {
      setHolidayToRemove(values);
      setIsRemoveDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDateChange = (date, name) => {
    formik.setFieldValue(name, date);
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      let allValues = { ...values };
      if (allValues.holidayDate) {
        allValues.holidayDate = moment(allValues.holidayDate).format(
          DATE_FORMAT_API
        );
      }
      try {
        setLoading(true);
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        await OfficeService.addHoliday({ holiday: allValues });
        dispatch(
          toggleToast({
            message: "Holiday added successfully!",
            type: "success",
          })
        );
        resetForm();
        setIsDialogOpen(false);
        if (pagination.pageNo === 0) {
          fetchAllHolidays();
        } else {
          handlePageChange(0);
        }
      } catch (e) {
        console.error(e);
        dispatch(
          toggleToast({
            message:
              e?.response?.data?.message ||
              "Error adding holiday, please try again later!",
            type: "error",
          })
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const handleRemoveDialogClose = () => {
    setIsRemoveDialogOpen(false);
    setHolidayToRemove({});
  };

  const handleRemoveHoliday = async () => {
    try {
      await OfficeService.removeHoliday(holidayToRemove.id);
      dispatch(
        toggleToast({
          message: "Holiday removed successfully!",
          type: "success",
        })
      );
      if (pagination.pageNo === 0) {
        fetchAllHolidays();
      } else {
        handlePageChange(0);
      }
      handleRemoveDialogClose();
    } catch (e) {
      console.error(e);
      dispatch(
        toggleToast({
          message:
            e?.response?.data?.message ||
            "Error removing holiday, please try again later!",
          type: "error",
        })
      );
    }
  };

  const { values, touched, handleChange, errors, handleSubmit } = formik;

  return (
    <div className="mainSettingsContainer">
      <h2>Client</h2>
      <div className="currentStateContainer">
        <button className={"btn btn-secondary btn-blk"}>Holiday</button>
      </div>
      <div className="internalSettingContainer">
        <div className="btnContainer">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="btn btn-primary"
          >
            Add Holiday
          </button>
        </div>
        <div className="gridContainer">
          <Grid
            onMenuItemClick={onMenuItemClick}
            handlePageChange={handlePageChange}
            pagination={paginationData}
            headers={headers}
            listing={holidaysListing}
            isLoading={loading}
          />
        </div>
      </div>
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle id="alert-dialog-title">Add Holiday</DialogTitle>
        <DialogContent>
          <div>
            <div className="form-control-input">
              <FormControl required fullWidth>
                <InputLabel id="primary-office-label">
                  Primary Office
                </InputLabel>
                <Select
                  labelId="primary-office-label"
                  id="officeId"
                  value={values.officeId}
                  error={touched.officeId && Boolean(errors.officeId)}
                  name="officeId"
                  label="Primary Office"
                  onChange={handleChange}
                >
                  {!!offices?.length &&
                    offices.map((office, idx) => (
                      <MenuItem key={idx} value={office.officeId}>
                        {getFormattedLabel(office.officeId)}, {office.address}
                      </MenuItem>
                    ))}
                </Select>
                {touched.officeId && errors.officeId && (
                  <FormHelperText className="errorHelperText">
                    {errors.officeId}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            <div className="form-control-input">
              <TextField
                error={touched.occasion && Boolean(errors.occasion)}
                helperText={touched.occasion && errors.occasion}
                onChange={handleChange}
                required
                id="occasion"
                name="occasion"
                value={values.occasion}
                label="Occasion"
                variant="outlined"
              />
            </div>
            <div className="form-control-input">
              <InputLabel htmlFor="start-date" style={{ marginBottom: "10px" }}>
                Date
              </InputLabel>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  format={DATE_FORMAT}
                  name="holidayDate"
                  value={values.holidayDate ? moment(values.holidayDate) : null}
                  onChange={(e) => handleDateChange(e, "holidayDate")}
                />
              </LocalizationProvider>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="popupBtnContainer">
            <button className="btn btn-secondary" onClick={handleDialogClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Add
            </button>
          </div>
        </DialogActions>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              // backgroundColor: "#000000",
              zIndex: 1,
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              opacity: 1,
              color: "#000000",
              // height: "100vh",
              // width: "100vw",
            }}
          >
            <LoaderComponent />
          </div>
        ) : (
          " "
        )}
      </Dialog>
      <Dialog open={isRemoveDialogOpen} onClose={handleRemoveDialogClose}>
        <DialogTitle id="alert-dialog-title">Remove Holiday</DialogTitle>
        <DialogContent>
          <div>
            <p>
              Do you really want to remove {holidayToRemove.occasion} -{" "}
              {holidayToRemove.holidayDate} holiday?
            </p>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="popupBtnContainer">
            <button
              className="btn btn-secondary"
              onClick={handleRemoveDialogClose}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleRemoveHoliday}>
              Yes
            </button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminSettings(Client);
