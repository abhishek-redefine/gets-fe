import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import LoaderComponent from "../loader";

const ChangeRequestTable = ({ list, onRowsSelected, isLoading }) => {
  const [data, setData] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  // const [isLoading, setIsLoading] = useState(false);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Request ID",
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
    getRowId: (originalRow) => originalRow?.id,
    // state: { rowSelection },
    state: {
      rowSelection,
      isLoading,
    },
    onRowSelectionChange: setRowSelection,
    muiCircularProgressProps: {
      Component: <LoaderComponent />,
    },
  });

  useEffect(() => {
    tableInstance.getSelectedRowModel().flatRows[0]?.original
      ? onRowsSelected(
          tableInstance.getSelectedRowModel().flatRows[0]?.original
        )
      : onRowsSelected(null);
  }, [rowSelection]);

  useEffect(() => {
    setData(list);
  }, [list]);

  return (
    <div>
      <MaterialReactTable table={tableInstance} getRowId={(row) => row.id} />
    </div>
  );
};

export default ChangeRequestTable;
