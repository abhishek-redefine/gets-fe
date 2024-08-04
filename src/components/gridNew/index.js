import { AgGridReact } from "ag-grid-react";
import { useRef, useMemo, useCallback, useEffect, useState } from "react";

const GridNew = ({ headers, setShowAction,data }) => {
  const gridRef = useRef();
  const [selectedRow, setSelectedRow] = useState(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: 500 }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 250,
    }),
    []
  );

  const [rowData, setRowData] = useState([
    {
      officeId: "HCL0001",
      shiftType: "LOGIN",
      shiftTime: "09:30",
      bookingCount: 10,
      routingStatus: "-",
      dispatchStatus: "-",
    },
    {
      officeId: "HCL0001",
      shiftType: "LOGOUT",
      shiftTime: "19:30",
      bookingCount: 10,
      routingStatus: "-",
      dispatchStatus: "-",
    },
    {
      officeId: "HCL0003",
      shiftType: "LOGIN",
      shiftTime: "09:30",
      bookingCount: 10,
      routingStatus: "-",
      dispatchStatus: "-",
    },
  ]);

  const onSelectionChanged = useCallback(() => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    if (selectedNodes.length > 0) {
      const selectedData = selectedNodes[0].data;
      // console.log("Row selected:", selectedData);
      setSelectedRow(selectedData);
      setShowAction(true, selectedData);
    } else {
      // console.log("No rows selected");
      setShowAction(false, []);
      setSelectedRow(null);
    }
  }, [setShowAction]);

  // Log grid updates to debug re-renders
  useEffect(() => {
    console.log("Grid updated");
  },[]);

  return (
    <div style={containerStyle}>
      <div className="ag-theme-quartz" style={gridStyle}>
        <AgGridReact
          ref={gridRef}
          columnDefs={headers}
          rowData={data}
          defaultColDef={defaultColDef}
          rowSelection="single"
          suppressRowClickSelection={true}
          suppressAggFuncInHeader={true}
          onSelectionChanged={onSelectionChanged}
          pagination={true}
          
        />
      </div>
    </div>
  );
};

export default GridNew;
