import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const BARawDataTable = ({ list }) => {
  const [data, setData] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "sNo",
        header: "S. No",
        size: 100,
      },
      {
        accessorKey: "facility",
        header: "Facility",
        size: 150,
      },
      {
        accessorKey: "Office",
        header: "Office",
        size: 150,
      },
      {
        accessorKey: "date",
        header: "Date",
        size: 150,
      },
      {
        accessorKey: "empId",
        header: "Employee ID",
        size: 150,
      },
      {
        accessorKey: "name",
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "gender",
        header: "Gender",
        size: 150,
      },
      {
        accessorKey: "team",
        header: "Team",
        size: 150,
      },
      {
        accessorKey: "tripID",
        header: "Trip ID",
        size: 150,
      },
      {
        accessorKey: "source",
        header: "Source",
        size: 150,
      },
      {
        accessorKey: "vendorID",
        header: "Vendor ID",
        size: 150,
      },
      {
        accessorKey: "vehicleId",
        header: "Vehicle ID",
        size: 150,
      },
      {
        accessorKey: "registration",
        header: "Registration",
        size: 150,
      },
      {
        accessorKey: "vehicleType",
        header: "Vehicle Type",
        size: 150,
      },
      {
        accessorKey: "vehicleDeploymentTime",
        header: "Vehicle Deployment Time",
        size: 260,
      },
      {
        accessorKey: "direction",
        header: "Direction",
        size: 150,
      },
      {
        accessorKey: "shiftTypeOrTime",
        header: "Shift Type/Time",
        size: 150,
      },
      {
        accessorKey: "employeeStatus",
        header: "Employee Status",
        size: 150,
      },
      {
        accessorKey: "notBoardingReason",
        header: "Not Boarding Reason",
        size: 150,
      },
      {
        accessorKey: "noShow",
        header: "No Show",
        size: 150,
      },
      {
        accessorKey: "signInType",
        header: "SignIn Type",
        size: 150,
      },
      {
        accessorKey: "employeeCountInTrip",
        header: "Employee Count in Trip",
        size: 250,
      },
      {
        accessorKey: "plannedPickupTime",
        header: "Planned Pickup Time",
        size: 150,
      },
      {
        accessorKey: "driverReportTime",
        header: "Driver Report Time",
        size: 150,
      },
      {
        accessorKey: "actualPickupTime",
        header: "Actual Pickup Time",
        size: 150,
      },
      {
        accessorKey: "plannedDropTime",
        header: "Planned Drop Time",
        size: 150,
      },
      {
        accessorKey: "actualDropTime",
        header: "Actual Drop Time",
        size: 150,
      },
      {
        accessorKey: "otaOrOtd",
        header: "OTA/OTD",
        size: 150,
      },
      {
        accessorKey: "delayCause",
        header: "Delay Cause",
        size: 150,
      },
      {
        accessorKey: "causedByEmployee",
        header: "Caused By Employee",
        size: 150,
      },
      {
        accessorKey: "distanceTravelled",
        header: "Distance Travelled(KM)",
        size: 250,
      },
      {
        accessorKey: "proximitySMS",
        header: "Proximity SMS",
        size: 150,
      },
      {
        accessorKey: "costCenter",
        header: "Cost Center",
        size: 150,
      },
      {
        accessorKey: "selectedDestination",
        header: "Selected Destination",
        size: 250,
      },
      {
        accessorKey: "noShowMarkedBy",
        header: "No Show Marked By",
        size: 150,
      },
      {
        accessorKey: "noShowMarkedTime",
        header: "No Show Marked Time",
        size: 150,
      },
      {
        accessorKey: "billingZone",
        header: "Billing Zone",
        size: 150,
      },
      {
        accessorKey: "nodalPoint",
        header: "Nodal Point",
        size: 150,
      },
      {
        accessorKey: "tripType",
        header: "Trip Type",
        size: 150,
      },
      {
        accessorKey: "tripOffice",
        header: "Trip Office",
        size: 150,
      },
      {
        accessorKey: "driverId",
        header: "Driver ID",
        size: 150,
      },
      {
        accessorKey: "deviceId",
        header: "Device ID",
        size: 150,
      },
      {
        accessorKey: "plannedDriverId",
        header: "Planned Driver ID",
        size: 150,
      },
      {
        accessorKey: "shuttlePoint",
        header: "Shuttle Point",
        size: 150,
      },
      {
        accessorKey: "actualSignoffLocation",
        header: "Actual Signoff Location",
        size: 250,
      },
      {
        accessorKey: "actualDriverID",
        header: "Actual Driver ID",
        size: 150,
      },
      {
        accessorKey: "tripSheetComment",
        header: "Trip Sheet Comment",
        size: 150,
      },
      {
        accessorKey: "businessUnit",
        header: "Business Unit",
        size: 150,
      },
      {
        accessorKey: "plannedDriverName",
        header: "Planned Driver Name",
        size: 150,
      },
      {
        accessorKey: "plannedDriverContact No",
        header: "Planned Driver Contact No",
        size: 270,
      },
      {
        accessorKey: "actualDriverName",
        header: "Actual Driver Name",
        size: 150,
      },
      {
        accessorKey: "actualDriverContactNo",
        header: "Actual Driver Contact No",
        size: 250,
      },
      {
        accessorKey: "homeToOfficeDistance",
        header: "Home To Office Distance",
        size: 250,
      },
    ],
    []
  );

  const tableInstance = useMaterialReactTable({
    columns,
    data,
  });

  useEffect(() => {
    setData(list);
  }, [list]);

  return (
    <div>
      <MaterialReactTable table={tableInstance} />
    </div>
  );
};

export default BARawDataTable;
