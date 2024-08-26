import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
// import { issueTypeData } from "@/sampleData/travelledEmployeesInfoData";

const BillingIssuesDetailsTable = ({ issueTypeData, setIssueTypeData, onRowsSelected }) => {
  const [data, setData] = useState(issueTypeData);
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
        header: "Employee Name",
        size: 150,
      },
      {
        accessorKey: "gender",
        header: "Gender",
        size: 150,
      },
      {
        accessorKey: "pickup/dropPoint",
        header: "Pickup/Drop Point",
        size: 150,
      },
      {
        accessorKey: "landmark",
        header: "Landmark",
        size: 150,
      },
      {
        accessorKey: "vehicleReportTime",
        header: "Vehicle Report Time",
        size: 200,
      },
      {
        accessorKey: "signIn",
        header: "Sign In",
        size: 100,
      },
      {
        accessorKey: "signOut",
        header: "sign Out",
        size: 100,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 150,
      },
      {
        accessorKey: "phoneNo",
        header: "Phone No.",
        size: 150,
      },
      {
        accessorKey: "action",
        header: "Action",
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
    enableTopToolbar: false,
    initialState: { density: "compact" },
    muiTableBodyCellProps: {
      sx: {
        fontFamily: "DM Sans",
        fontSize: "14px",
      },
    },
    autoResetPageIndex: false,
    enableRowOrdering: true,
    enableSorting: false,
    muiRowDragHandleProps: ({ table }) => ({
      onDragEnd: () => {
        const { draggingRow, hoveredRow } = table.getState();
        if (hoveredRow && draggingRow) {
          data.splice(
            hoveredRow.index,
            0,
            data.splice(draggingRow.index, 1)[0]
          );
          setData([...data]);
          setIssueTypeData([...data]);
        }
      },
    }),
    getRowId: (originalRow) => originalRow?.empId,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
  });

  useEffect(() => {
    tableInstance.getSelectedRowModel().flatRows[0]?.original &&
      onRowsSelected(tableInstance.getSelectedRowModel().flatRows[0]?.original);
  }, [rowSelection]);

  useEffect(() => {
    console.log("IssuetypeData");
    setData(issueTypeData);
  }, [issueTypeData]);

  return (
    <div>
      <div>
        <MaterialReactTable table={tableInstance} getRowId={(row) => row.empId}/>
      </div>
    </div>
  );
};

export default BillingIssuesDetailsTable;
