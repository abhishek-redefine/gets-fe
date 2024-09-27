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
        accessorKey: "id",
        header: "Feedback ID",
        size: 150,
      },
      {
        accessorKey: "tripId",
        header: "Trip ID",
        size: 150,
        Cell: ({ cell }) => {
          const tripId = cell.getValue();
          return <p>TRIP - {tripId}</p>;
        },
      },
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
        accessorKey: "feedbackGivenBy",
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
      // {
      //   accessorKey: "teamName",
      //   header: "Team",
      //   size: 150,
      // },
      {
        accessorKey: "rating",
        header: "Rating",
        size: 150,
      },
      {
        accessorKey: "remarks",
        header: "Remarks",
        size: 150,
      },
      {
        accessorKey: "feedbackStatus",
        header: "Status",
        size: 150,
      },
    ],
    []
  );

  const tableInstance = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    getRowId: (originalRow) => originalRow?.id,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
  });

  useEffect(() => {
    tableInstance.getSelectedRowModel().flatRows[0]?.original ?
      onRowsSelected(tableInstance.getSelectedRowModel().flatRows[0]?.original)
      :
      onRowsSelected(null);
  }, [rowSelection]);

  useEffect(() => {
    setData(list);
  }, [list]);

  return (
    <div>
      <MaterialReactTable
        table={tableInstance}
        getRowId={(row) => row.id}
      />
    </div>
  );
};

export default TripFeedbackTable;
