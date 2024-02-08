import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Box, Card, CardContent, Typography } from "@mui/material";

const AddHoliday = () => {
  const [selectedOfficeId, setSelectedOfficeId] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const handleOfficeIdChange = (event) => {
    setSelectedOfficeId(event.target.value);
  };

  const handleOccasionChange = (event) => {
    setSelectedOccasion(event.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = () => {
    // Handle submit logic here
    console.log("Office ID:", selectedOfficeId);
    console.log("Occasion:", selectedOccasion);
    console.log("Date:", selectedDate);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
      }}
    >
      <Card style={{ width: "450px", textAlign: "center" }}>
        <CardContent>
          <Typography style={{marginLeft:"1px"}} variant="h5" component="h5" gutterBottom>
            Add Holiday
          </Typography>
          <FormControl fullWidth style={{ marginBottom: "20px" }}>
            <InputLabel id="office-id-label">Office ID</InputLabel>
            <Select
              labelId="office-id-label"
              value={selectedOfficeId}
              onChange={handleOfficeIdChange}
              label="Office ID"
            >
              <MenuItem value="">Select Office ID</MenuItem>
              <MenuItem value={1}>Office 1</MenuItem>
              <MenuItem value={2}>Office 2</MenuItem>
              {/* Add more options as needed */}
            </Select>
          </FormControl>
          <Box display="flex" marginBottom="20px">
            <FormControl fullWidth style={{ marginRight: "10px" }}>
              <InputLabel id="occasion-label">Occasion</InputLabel>
              <Select
                labelId="occasion-label"
                value={selectedOccasion}
                onChange={handleOccasionChange}
                label="Occasion"
              >
                <MenuItem value="">Select Occasion</MenuItem>
                <MenuItem value="New Year">New Year</MenuItem>
                <MenuItem value="Christmas">Christmas</MenuItem>
                {/* Add more options as needed */}
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="DD - MM -YY"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
              />
            </LocalizationProvider>
          </Box>
          <Button variant="contained" color="primary" style={{backgroundColor:"#F6CE47", color:"#000"}} onClick={handleSubmit}>
            Submit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddHoliday;
