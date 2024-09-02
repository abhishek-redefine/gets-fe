import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const TripFeedbackTable = ({ list, onRowsSelected }) => {
  const [data, setData] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo(
    () => [
      {
        accessorKey: "officeId",
        header: "Office ID",
        size: 150,
      },
      {
        accessorKey: "empId",
        header: "Employee ID",
        size: 150,
      },
      {
        accessorKey: "empName",
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "shiftType",
        header: "Shift Type",
        size: 150,
      },
      {
        accessorKey: "shiftTime",
        header: "Shift Time",
        size: 150,
      },
      {
        accessorKey: "teamName",
        header: "Team",
        size: 150,
      },
      {
        accessorKey: "tripId",
        header: "Trip ID",
        size: 150,
      },
      {
        accessorKey: "rating",
        header: "Rating",
        size: 150,
      },
      {
        accessorKey: "status",
        header: "Status",
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
    getRowId: (originalRow) => originalRow?.empId,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
  });

  useEffect(() => {
    tableInstance.getSelectedRowModel().flatRows[0]?.original &&
      onRowsSelected(tableInstance.getSelectedRowModel().flatRows[0]?.original);
  }, [rowSelection]);

  useEffect(() => {
    setData(list);
  }, [list]);

  return (
    <div>
      <MaterialReactTable table={tableInstance} getRowId={(row) => row.empId} />
    </div>
  );
};

export default TripFeedbackTable;
