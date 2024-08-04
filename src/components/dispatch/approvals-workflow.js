import React, { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const ApprovalsWorkflowTable = ({ onRowSelect, list }) => {
  const [data, setData] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Trip ID",
        size: 150,
        Cell: ({ cell }) => {
          return <div>TRIP-{cell.getValue()}</div>;
        },
      },
      {
        accessorKey: "tripState",
        header: "Trip Status",
        size: 150,
      },
      {
        accessorKey: "shiftTime",
        header: "Shift Time",
        size: 150,
      },
      {
        accessorKey: "shiftType",
        header: "Shift Type",
        size: 150,
      },
      {
        accessorKey: "vehicleNumber",
        header: "Cab Details",
        size: 150,
        Cell: ({ cell }) => {
          return <div>{cell?.getValue() || "N/A"}</div>;
        },
      },
      {
        accessorKey : "remarks",
        header: "Ops Remarks",
        size : 200,
        Cell: ({ cell }) => {
          return <div>{cell?.getValue() || "N/A"}</div>;
        },
      },
      // {
      //   accessorKey: "signIn",
      //   header: "Sign In",
      //   size: 150,
      // },
      // {
      //   accessorKey: "signOut",
      //   header: "Sign Out",
      //   size: 150,
      // },
      // {
      //   accessorKey: "smsStatus",
      //   header: "SMS Status",
      //   size: 150,
      // },
    ],
    []
  );

  const tableInstance = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    getRowId: (originalRow) => originalRow?.tripId,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
  });

  useEffect(() => {
    tableInstance.getSelectedRowModel().flatRows[0]?.original &&
      onRowSelect(tableInstance.getSelectedRowModel().flatRows[0]?.original);
  }, [rowSelection]);

  useEffect(() => {
    setData(list);
  }, [list]);

  return (
    <div>
      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: "16px 20px",
          borderRadius: "10px",
        }}
      >
        <MaterialReactTable
          table={tableInstance}
          getRowId={(row) => row.tripId}
        />
      </div>
    </div>
  );
};

export default ApprovalsWorkflowTable;
