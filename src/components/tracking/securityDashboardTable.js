import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { securityDashboardData } from "@/sampleData/securityDashboardData";

const SecurityDashboardTable = () => {
  const [data, setData] = useState(securityDashboardData);

  const columns = useMemo(
    () => [
      {
        accessorKey: "officeId",
        header: "Office ID",
        size: 100,
      },
      {
        accessorKey: "shiftType",
        header: "Shift Type",
        size: 100,
      },
      {
        accessorKey: "shiftTime",
        header: "Shift Time",
        size: 100,
      },
      {
        accessorKey: "bookingCount",
        header: "Booking Count",
        size: 100,
      },
      {
        accessorKey: "routingStatus",
        header: "Routing Status",
        size: 100,
      },
      {
        accessorKey: "dispatchStatus",
        header: "Dispatch Status",
        size: 100,
      },
      {
        accessorKey: "tripCount",
        header: "Trip Count",
        size: 150,
      },
      {
        accessorKey: "allocatedToVendors",
        header: "Allocated To Vendors",
        size: 200,
      },
      {
        accessorKey: "cabsDeployed",
        header: "Cabs Deployed",
        size: 100,
      },
      {
        accessorKey: "fleetMix",
        header: "Fleet Mix",
        size: 230,
      },
      {
        accessorKey: "escortTrip",
        header: "Escort Trip",
        size: 100,
      },
      {
        accessorKey: "backToBack",
        header: "Back to Back",
        size: 100,
      },
      {
        accessorKey: "smsStatus",
        header: "SMS Status",
        size: 150,
      },
      {
        accessorKey: "emailStatus",
        header: "Email Status",
        size: 150,
      },
    ],
    []
  );

  const tableInstance = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true, 
    enableMultiRowSelection: true,
  });

  return (
    <div>
      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: "16px 20px",
          borderRadius: "10px",
        }}
      >
        <MaterialReactTable table={tableInstance} />
      </div>
    </div>
  );
};

export default SecurityDashboardTable;
