import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const SafeReachVerificationTable = ({ list }) => {
  const [data, setData] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "facility",
        header: "Facility",
        size: 150,
      },
      {
        accessorKey: "office",
        header: "Office",
        size: 150,
      },
      {
        accessorKey: "empId",
        header: "Employee ID",
        size: 150,
      },
      {
        accessorKey: "empName",
        header: "Employee Name",
        size: 150,
      },
      {
        accessorKey: "gender",
        header: "Gender",
        size: 150,
      },
      {
        accessorKey: "projectName",
        header: "Project Name",
        size: 150,
      },
      {
        accessorKey: "empEmail",
        header: "Employee Email",
        size: 150,
      },
      {
        accessorKey: "tripId",
        header: "Trip ID",
        size: 150,
      },
      {
        accessorKey: "tripType",
        header: "Trip Type",
        size: 150,
      },
      {
        accessorKey: "tripDate",
        header: "Trip Date",
        size: 150,
      },
      {
        accessorKey: "vehicleId",
        header: "Vehicle ID",
        size: 150,
      },
      {
        accessorKey: "vehicleRegistrationNo",
        header: "Vehicle Registration No",
        size: 250,
      },
      {
        accessorKey: "driverName",
        header: "Driver Name",
        size: 150,
      },
      {
        accessorKey: "driverContact",
        header: "Driver Contact",
        size: 150,
      },
      {
        accessorKey: "verificationStatus",
        header: "Verification Status",
        size: 150,
      },
      {
        accessorKey: "verificationType",
        header: "Verification Type",
        size: 150,
      },
      {
        accessorKey: "verificationTime",
        header: "Verification Time",
        size: 150,
      },
      {
        accessorKey: "logoutShift",
        header: "Logout Shift",
        size: 150,
      },
      {
        accessorKey: "teamManager",
        header: "Team Manager",
        size: 150,
      },
      {
        accessorKey: "Planned SignIn Time",
        header: "Planned SignIn Time",
        size: 150,
      },
      {
        accessorKey: "Actual SignIn Time",
        header: "Actual SignIn Time",
        size: 150,
      },
      {
        accessorKey: "plannedSignoffTime",
        header: "Planned Signoff Time",
        size: 230,
      },
      {
        accessorKey: "actualSignoffTime",
        header: "Actual Signoff Time",
        size: 150,
      },
      {
        accessorKey: "pickupAddress",
        header: "Pickup Address",
        size: 150,
      },
      {
        accessorKey: "dropAddress",
        header: "Drop Address",
        size: 150,
      },
      {
        accessorKey: "distanceFromPlannedPickup",
        header: "Distance From Planned Pickup(Km)",
        size: 350,
      },
      {
        accessorKey: "distanceFromPlannedDrop",
        header: "Distance From Planned Drop(Km)",
        size: 350,
      },
      {
        accessorKey: "escortName",
        header: "Escort Name",
        size: 150,
      },
      {
        accessorKey: "escortContact",
        header: "Escort Contact",
        size: 150,
      },
      {
        accessorKey: "escortSignInTime",
        header: "Escort SignIn Time",
        size: 150,
      },
      {
        accessorKey: "verifiedBy",
        header: "Verified By",
        size: 150,
      },
      {
        accessorKey: "verifiedTime",
        header: "VerifiedTime",
        size: 150,
      },
      {
        accessorKey: "comment",
        header: "Comment",
        size: 150,
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

export default SafeReachVerificationTable;
