import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { safeReachConfirmationData } from "@/sampleData/safeReachConfirmationData";


const SafeReachConfirmationTable = () => {
  const [data, setData] = useState(safeReachConfirmationData);

  const columns = useMemo(
    () => [
      {
        accessorKey: "officeId",
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
        accessorKey: "empId",
        header: "Employee ID",
        size: 100,
      },
      {
        accessorKey: "empName",
        header: "Employee Name",
        size: 100,
      },
      {
        accessorKey: "safeReachStatus",
        header: "Safe Reach Status",
        size: 100,
      },
      {
        accessorKey: "remarks",
        header: "Remarks",
        size: 150,
      },
      {
        accessorKey: "plannedSignOffTime",
        header: "Planned Sign Off Time",
        size: 170,
      },
      {
        accessorKey: "actualSignOffTime",
        header: "Actual Sign Off Time",
        size: 170,
      },
      {
        accessorKey: "updatedBy",
        header: "Updated By",
        size: 230,
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        size: 100,
      },
      {
        accessorKey: "Action",
        header: "Action",
        size: 100,
      },
    ],
    []
  );

  const tableInstance = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true, 
    enableMultiRowSelection: false,
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

export default SafeReachConfirmationTable;
