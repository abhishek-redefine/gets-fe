import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const ChangeRequestTable = ({ list, selectedRow, onRowsSelected }) => {
  const [data, setData] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo(
    () => [
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
      // {
      //   accessorKey: 'teamName',
      //   header: 'Team',
      //   size: 150,
      // },
      {
        accessorKey: "mob",
        header: "Phone No",
        size: 150,
      },
      {
        accessorKey: "requestType",
        header: "Request Type",
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

  useEffect(() => {
    if (selectedRow) {
      const newRowSelection = { [selectedRow.tripId]: true };
      setRowSelection(newRowSelection);
    } else {
      setRowSelection({});
    }
  }, [selectedRow]);

  return (
    <div>
      <MaterialReactTable table={tableInstance} getRowId={(row) => row.empId} />
    </div>
  );
};

export default ChangeRequestTable;
