import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { incidentManagementData } from "@/sampleData/incidentManagementData";


const IncidentManagementTable = () => {
  const [data, setData] = useState(incidentManagementData);

  const columns = useMemo(
    () => [
      {
        accessorKey: "officeId",
        header: "Office ID",
        size: 120,
      },
      {
        accessorKey: "tripId",
        header: "Trip ID",
        size: 120,
      },
      {
        accessorKey: "dateOfIncident",
        header: "Date of Incident",
        size: 100,
      },
      {
        accessorKey: "timeOfIncident",
        header: "Time of Incident",
        size: 100,
      },
      {
        accessorKey: "incidentLocation",
        header: "Incident Location",
        size: 150,
      },
      {
        accessorKey: "vendorName",
        header: "Vendor Name",
        size: 150,
      },
      {
        accessorKey: "vehicleNo",
        header: "Vehicle No.",
        size: 150,
      },
      {
        accessorKey: "driverName",
        header: "Driver Name",
        size: 170,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 200,
      },
      {
        accessorKey: "major",
        header: "Major",
        size: 100,
      },
      {
        accessorKey: "minor",
        header: "Minor",
        size: 100,
      },
      {
        accessorKey: "noInjury",
        header: "No Injury",
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

export default IncidentManagementTable;
