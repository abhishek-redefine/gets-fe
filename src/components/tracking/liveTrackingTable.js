import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { liveTrackingData } from "@/sampleData/liveTrackingData";


const LiveTrackingTable = () => {
  const [data, setData] = useState(liveTrackingData);

  const columns = useMemo(
    () => [
      {
        accessorKey: "vehicleNo",
        header: "Office ID",
        size: 100,
      },
      {
        accessorKey: "tripId",
        header: "Trip ID",
        size: 100,
      },
      {
        accessorKey: "shiftTime",
        header: "Shift Time",
        size: 100,
      },
      {
        accessorKey: "shiftType",
        header: "shift Type",
        size: 100,
      },
      {
        accessorKey: "employee",
        header: "Employee",
        size: 100,
      },
      {
        accessorKey: "tripStartTime",
        header: "Trip Start Time",
        size: 100,
      },
      {
        accessorKey: "route",
        header: "Route",
        size: 150,
      },
      {
        accessorKey: "office",
        header: "Office",
        size: 170,
      },
      {
        accessorKey: "eta",
        header: "ETA",
        size: 170,
      },
      {
        accessorKey: "vehicleType",
        header: "Vehicle Type",
        size: 230,
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

export default LiveTrackingTable;
