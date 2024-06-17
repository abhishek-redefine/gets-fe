import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenOutlinedIcon from "@mui/icons-material/CloseFullscreenOutlined";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import ContentPasteOutlinedIcon from "@mui/icons-material/ContentPasteOutlined";
import MergeOutlinedIcon from "@mui/icons-material/MergeOutlined";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import Diversity2OutlinedIcon from "@mui/icons-material/Diversity2Outlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AutoModeOutlinedIcon from "@mui/icons-material/AutoModeOutlined";
import { Checkbox, FormGroup, FormControlLabel } from "@mui/material";
import { useEffect, useState } from "react";
import DispatchService from "@/services/dispatch.service";
import { ITableProps, kaReducer, Table, useTable } from "ka-table";
import { DataType, EditingMode, SortingMode } from "ka-table/enums";
import { updateData } from "ka-table/actionCreators";

const RouteEditor = (props) => {
  const { edit, selectedDate, shiftId } = props;
  const [selectAll, setSelectAll] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [tripCount, setTripCount] = useState(0);
  const [tripsMemberCount, setTripsMemberCount] = useState(0);
  const [initialData, setInitialData] = useState([]);
  const table = useTable();
  const [tableProps, setTableProps] = useState({
    columns: [
      { key: "id", title: "", isEditable: false, width: 80 },
      {
        key: "tripId",
        title: "Trip Id",
        dataType: DataType.String,
        isEditable: false,
      },
      {
        key: "noOfSeats",
        title: "Number of Seats",
        dataType: DataType.String,
        isEditable: false,
      },
      {
        key: "memberCount",
        title: "Employee Count",
        dataType: DataType.String,
        isEditable: false,
      },
      {
        key: "shiftTime",
        title: "Shift Time",
        dataType: DataType.String,
        isEditable: false,
      },
      {
        key: "employeeName",
        title: "Name",
        dataType: DataType.String,
      },
      { key: "gender", title: "Gender", dataType: DataType.String },
      { key: "pickupPoint", title: "Pickup Point", dataType: DataType.String },
      { key: "dropPoint", title: "Drop Point", dataType: DataType.String },
      { key: "specail", title: "Special Status", dataType: DataType.String },
      { key: "pickupTime", title: "Pickup Time", dataType: DataType.String },
    ],
    data: [],
    editingMode: EditingMode.Cell,
    rowKeyField: "id",
    sortingMode: SortingMode.Single,
    treeGroupKeyField: "tripId",
    // rowReordering: true,
    columnReordering: true,
  });

  const dispatch = (action) => {
    const newState = kaReducer(tableProps, action);
    setTableProps(newState);
  };

  const getTrips = async () => {
    try {
      const queryParams = {
        shiftId: shiftId,
        tripDate: selectedDate,
      };
      const params = new URLSearchParams(queryParams);
      const response = await DispatchService.getTripByShiftIdAndTripDate(
        params
      );
      console.log(response.data);
      setTripCount(response.data.length);
      setRowCount(response.data.length);
      await getTripsMember(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getTripsMember = async (trips) => {
    try {
      let data = [];
      let members = [];
      let count = 0;
      const memberPromises = trips.map(async (val, index) => {
        const response = await DispatchService.tripMembers(val.id);
        const row = {
          id: val.id,
          tripId: null,
          noOfSeats: `${val.noOfSeats}S`,
          memberCount: response.data.length,
          pickupPoint: response.data[0]?.areaName || "",
          dropPoint: response.data[-1]?.areaName || "",
          shiftTime: val.shiftTime,
        };
        data.push(row);
        console.log(response.data);
        count += response.data.length;
        response.data.map((item, idx) => {
          const row = {
            tripId: val.id,
            employeeName: item.name,
            gender: item.gender,
            pickupPoint:
              val.shiftType === "LOGIN" ? item?.areaName || "" : val.officeId,
            dropPoint:
              val.shiftType === "LOGIN" ? val.officeId : item?.areaName || "",
            pickupTime: val.shiftTime,
          };
          data.push(row);
        });
        return response.data;
      });
      members = await Promise.all(memberPromises);
      console.log(data);
      setInitialData(data);
      setTripsMemberCount(count);
      setTableProps((prevProps) => ({
        ...prevProps,
        data: data,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTrips();
  }, []);

  return (
    <div style={{ marginTop: 20 }}>
      <div
        style={{
          borderRadius: 10,
          padding: "20px 30px",
          backgroundColor: "#E0E0E0",
        }}
      >
        <div style={{ backgroundColor: "#FFF", display: "flex", padding: 20 }}>
          <div
            style={{ margin: "0 7px", display: "flex", alignItems: "center" }}
          >
            <p className="tripEditorText">Users</p>
            <div
              style={{
                border: "2px solid #E0E0E0",
                padding: "2px 10px",
                margin: "0 7px",
                borderRadius: 5,
                width: "50px",
              }}
            >
              <p>{tripsMemberCount}</p>
            </div>
          </div>
          <div
            style={{ margin: "0 7px", display: "flex", alignItems: "center" }}
          >
            <p className="tripEditorText">Special</p>
            <div
              style={{
                border: "2px solid #E0E0E0",
                padding: "2px 10px",
                margin: "0 7px",
                borderRadius: 5,
                width: "50px",
              }}
            >
              <p>0</p>
            </div>
          </div>
          <div
            style={{ margin: "0 7px", display: "flex", alignItems: "center" }}
          >
            <p className="tripEditorText">Female</p>
            <div
              style={{
                border: "2px solid #E0E0E0",
                padding: "2px 10px",
                margin: "0 7px",
                borderRadius: 5,
                width: "50px",
              }}
            >
              <p>0</p>
            </div>
          </div>
          <div
            style={{ margin: "0 7px", display: "flex", alignItems: "center" }}
          >
            <p className="tripEditorText">Trips</p>
            <div
              style={{
                border: "2px solid #E0E0E0",
                padding: "2px 10px",
                margin: "0 7px",
                borderRadius: 5,
                width: "50px",
              }}
            >
              <p>{tripCount}</p>
            </div>
          </div>
          <div
            style={{ margin: "0 7px", display: "flex", alignItems: "center" }}
          >
            <p className="tripEditorText">Escort Trip</p>
            <div
              style={{
                border: "2px solid #E0E0E0",
                padding: "2px 10px",
                margin: "0 7px",
                borderRadius: 5,
                width: "50px",
              }}
            >
              <p>0</p>
            </div>
          </div>
          <div
            style={{ margin: "0 7px", display: "flex", alignItems: "center" }}
          >
            <p className="tripEditorText">Fleet Mix</p>
            <div
              style={{
                border: "2px solid #E0E0E0",
                padding: "2px 10px",
                margin: "0 7px",
                borderRadius: 5,
                width: "auto",
              }}
            >
              <p>4S : -</p>
            </div>
            <div
              style={{
                border: "2px solid #E0E0E0",
                padding: "2px 10px",
                margin: "0 7px",
                borderRadius: 5,
                width: "auto",
              }}
            >
              <p>6S : -</p>
            </div>
            <div
              style={{
                border: "2px solid #E0E0E0",
                padding: "2px 10px",
                margin: "0 7px",
                borderRadius: 5,
                width: "auto",
              }}
            >
              <p>7S : -</p>
            </div>
            <div
              style={{
                border: "2px solid #E0E0E0",
                padding: "2px 10px",
                margin: "0 7px",
                borderRadius: 5,
                width: "auto",
              }}
            >
              <p>12S : -</p>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: 10,
          backgroundColor: "#E0E0E0",
          borderRadius: 5,
          padding: 10,
        }}
      >
        <div className="d-flex">
          <div
            className="d-flex"
            style={{
              marign: "0 10px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 7px",
              cursor: "pointer",
            }}
          >
            <OpenInFullIcon
              fontSize="12"
              htmlColor="#0054B6"
              style={{ margin: "0 5px" }}
            />
            <p className="tripEditorText">Expand</p>
          </div>
          <div
            className="d-flex"
            style={{
              marign: "0 10px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 7px",
              cursor: "pointer",
            }}
          >
            <CloseFullscreenOutlinedIcon
              fontSize="12"
              htmlColor="#0054B6"
              style={{ margin: "0 5px" }}
            />
            <p className="tripEditorText">Collapse</p>
          </div>
          <div
            className="d-flex"
            style={{
              marign: "0 10px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 7px",
              cursor: "pointer",
            }}
          >
            <ContentCutOutlinedIcon
              fontSize="12"
              htmlColor="#0054B6"
              style={{ margin: "0 5px" }}
            />
            <p className="tripEditorText">Cut</p>
          </div>
          <div
            className="d-flex"
            style={{
              marign: "0 10px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 7px",
              cursor: "pointer",
            }}
          >
            <ContentPasteOutlinedIcon
              fontSize="12"
              htmlColor="#0054B6"
              style={{ margin: "0 5px" }}
            />
            <p className="tripEditorText">Paste</p>
          </div>
          <div
            className="d-flex"
            style={{
              marign: "0 10px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 7px",
              cursor: "pointer",
            }}
          >
            <MergeOutlinedIcon
              fontSize="12"
              htmlColor="#0054B6"
              style={{ margin: "0 5px" }}
            />
            <p className="tripEditorText">Merge</p>
          </div>
          <div
            className="d-flex"
            style={{
              marign: "0 10px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 7px",
              cursor: "pointer",
            }}
          >
            <SwapVertOutlinedIcon
              fontSize="12"
              htmlColor="#0054B6"
              style={{ margin: "0 5px" }}
            />
            <p className="tripEditorText">Sort By</p>
          </div>
          <div
            className="d-flex"
            style={{
              marign: "0 10px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 7px",
              cursor: "pointer",
            }}
          >
            <AddBoxOutlinedIcon
              fontSize="12"
              htmlColor="#0054B6"
              style={{ margin: "0 5px" }}
            />
            <p className="tripEditorText">Create New Trip</p>
          </div>
          <div
            className="d-flex"
            style={{
              marign: "0 10px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 7px",
              cursor: "pointer",
            }}
          >
            <Diversity2OutlinedIcon
              fontSize="12"
              htmlColor="#0054B6"
              style={{ margin: "0 5px" }}
            />
            <p className="tripEditorText">Recalculate</p>
          </div>
          <div
            className="d-flex"
            style={{
              marign: "0 10px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 7px",
              cursor: "pointer",
            }}
          >
            <AccessTimeOutlinedIcon
              fontSize="12"
              htmlColor="#0054B6"
              style={{ margin: "0 5px" }}
            />
            <p className="tripEditorText">Edit Pickup Time</p>
          </div>
          <div
            className="d-flex"
            style={{
              marign: "0 10px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 7px",
              cursor: "pointer",
            }}
          >
            <EditOutlinedIcon
              fontSize="12"
              htmlColor="#0054B6"
              style={{ margin: "0 5px" }}
            />
            <p className="tripEditorText">Auto Update pickup/drop timing</p>
          </div>
          <div
            className="d-flex"
            style={{
              marign: "0 10px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 7px",
              cursor: "pointer",
            }}
          >
            <AutoModeOutlinedIcon
              fontSize="12"
              htmlColor="#0054B6"
              style={{ margin: "0 5px" }}
            />
            <p className="tripEditorText">Customize Columns</p>
          </div>
        </div>
        {/* <div style={{ marginTop: 15, display: "flex", margin: "0 10px" }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  value={selectAll}
                  onChange={() => setSelectAll(!selectAll)}
                />
              }
              label={`Selected (${rowCount})`}
            />
          </FormGroup>
        </div> */}
        {initialData.length > 0 && (
          <div style={{ marginTop: 10, backgroundColor: "#FFF" }}>
            <div>
              <Table
                table={table}
                {...tableProps}
                dispatch={dispatch}
                childComponents={{
                  dataRow: {
                    elementAttributes: ({ rowData }) => ({
                      style: {
                        backgroundColor: !rowData.tripId ? "#f6ce47" : "",
                        fontWeight: !rowData.tripId ? "bold" : "normal",
                      },
                      title: `${rowData.name}: ${rowData.score}`,
                    }),
                  },
                  cell: {
                    elementAttributes: ({
                      column,
                      rowKeyValue,
                      isEditableCell,
                    }) => {
                      if (isEditableCell) return undefined;

                      const cell = { columnKey: column.key, rowKeyValue };
                      const isFocused =
                        cell.columnKey ===
                          table.props.focused?.cell?.columnKey &&
                        cell.rowKeyValue ===
                          table.props.focused?.cell?.rowKeyValue;
                      return {
                        tabIndex: 0,
                        ref: (ref) => isFocused && ref?.focus(),
                        onKeyUp: (e) => {
                          switch (e.key) {
                            case "ArrowRight":
                              table.moveFocusedRight({ end: e.ctrlKey });
                              break;
                            case "ArrowLeft":
                              table.moveFocusedLeft({ end: e.ctrlKey });
                              break;
                            case "ArrowUp":
                              table.moveFocusedUp({ end: e.ctrlKey });
                              break;
                            case "ArrowDown":
                              table.moveFocusedDown({ end: e.ctrlKey });
                              break;
                            case "Enter":
                              table.openEditor(
                                cell.rowKeyValue,
                                cell.columnKey
                              );
                              table.setFocused({ cellEditorInput: cell });
                              e.stopPropagation();
                              break;
                          }
                        },
                        onFocus: () =>
                          !isFocused &&
                          table.setFocused({
                            cell: { columnKey: column.key, rowKeyValue },
                          }),
                        onKeyDown: (e) => e.keyCode !== 9 && e.preventDefault(),
                        onBlur: () => isFocused && table.clearFocused(),
                      };
                    },
                  },
                  cellEditorInput: {
                    elementAttributes: ({ column, rowKeyValue }) => {
                      const isFocused =
                        column.key ===
                          table.props.focused?.cellEditorInput?.columnKey &&
                        rowKeyValue ===
                          table.props.focused?.cellEditorInput?.rowKeyValue;
                      const cell = { columnKey: column.key, rowKeyValue };
                      return {
                        ref: (ref) => isFocused && ref?.focus(),
                        onKeyUp: (e) =>
                          e.keyCode === 13 && table.setFocused({ cell }),
                        onBlur: (e, { baseFunc }) => {
                          baseFunc();
                          table.clearFocused();
                        },
                        onFocus: () =>
                          !isFocused &&
                          table.setFocused({
                            cell: { columnKey: column.key, rowKeyValue },
                          }),
                      };
                    },
                  },
                  headCell: {
                    elementAttributes: (props) => ({
                      tabIndex: 0,
                      onKeyUp: (e) =>
                        e.keyCode === 13 &&
                        table.updateSortDirection(props.column.key),
                    }),
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteEditor;
