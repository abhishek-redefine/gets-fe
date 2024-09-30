import {
  Checkbox,
  FormControlLabel,
  Menu,
  MenuItem,
  Pagination,
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import LoaderComponent from "../loader";

const Grid = ({
  headers,
  pagination,
  listing = [],
  handlePageChange,
  onMenuItemClick,
  onRadioClick,
  onCheckboxClick,
  pageNoText = "pageNo",
  enableDisableRow = false,
  bookingGrid = false,
  isLoading
}) => {
  const [isMenu, setIsMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [navigationItems, setNavigationItems] = useState([]);
  const [clickedItem, setClickedItem] = useState();
  const [radioCheckedValue, setRadioCheckedValue] = useState();
  const [selectedCheckedValues, setSelectedCheckedValues] = useState([]);

  const handleChange = (event, page) => {
    handlePageChange(page - 1);
  };

  const selectAllHandler = () => {
    console.log("select all>>", listing);
    const idx = listing?.length;
  };

  const htmlClick = (header, e, listItem, idx) => {
    console.log("htmlClick", listItem, header.menuItems);
    if (header.navigation) {
      if (bookingGrid && listItem.isCancelled) {
        console.log("Hello");
      } else {
        setClickedItem(listItem);
        setIsMenu(true);
        setNavigationItems(header.menuItems);
        handleClick(e);
        if (listItem.enabled) {
          setNavigationItems(
            header.menuItems.filter((item) => item.key !== "activate")
          );
        }
        if (!listItem.enabled) {
          setNavigationItems(
            header.menuItems.filter((item) => item.key !== "deactivate")
          );
        }
      }
    } else if (header.radio) {
      setRadioCheckedValue(Number(idx));
      onRadioClick(listItem);
    } else if (header.checkbox) {
      const currentCheckboxValues = [...selectedCheckedValues];
      const newValueIdx = currentCheckboxValues.findIndex(
        (obj) => obj.id === listItem.id
      );
      if (newValueIdx > -1) {
        currentCheckboxValues.splice(newValueIdx, 1);
      } else {
        currentCheckboxValues.push(listItem);
      }
      setSelectedCheckedValues(currentCheckboxValues);
      onCheckboxClick(currentCheckboxValues);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setNavigationItems([]);
    setIsMenu(false);
    setAnchorEl(null);
    setClickedItem(null);
  };

  const menuItemClick = (key) => {
    onMenuItemClick(key, clickedItem);
    handleClose();
  };

  const getText = (header, listItem) => {
    if (header.type === "arr") {
      return listItem[header.key].join(", ");
    } else if (header.key === "bookingDate") {
      return moment(listItem.bookingDate).format("DD-MM-YYYY");
    }
    return listItem[header.key];
  };

  useEffect(() => {
    console.log(pagination);
    console.log("pagination>>>", pagination);
  }, [pagination]);

  return (
    <div>
      <table className="commonTable">
        <thead>
          <tr>
            {headers.map((header, idx) => {
              let tdHeader;
              let additionalProps = {};
              additionalProps.checked = false === idx;
              if (header.key === "radioBox" && header?.checkbox === true) {
                tdHeader = (
                  <td
                    key={`${idx}td`}
                    style={{ cursor: "pointer" }}
                    onClick={selectAllHandler}
                  >
                    {React.cloneElement(
                      header.html,
                      additionalProps.checked.valueOf(true)
                    )}
                  </td>
                );
              } else {
                tdHeader = <td key={`${idx}tdfirst`}>{header.display}</td>;
              }
              return tdHeader;
            })}
          </tr>
        </thead>
        {/* <tbody>
          {listing.map((listItem, idx) => (
            <tr key={`${idx}tr`}>
              {headers.map((header, ix) => {
                let tdContent;
                if (!listItem[header.key] && header.html) {
                  let additionalProps = {};
                  if (header.radio) {
                    additionalProps.checked = radioCheckedValue === idx;
                  }
                  tdContent = (
                    <td
                      key={`${ix}td`}
                      style={{ cursor: "pointer" }}
                      onClick={(e) => htmlClick(header, e, listItem, idx)}
                    >
                      {React.cloneElement(header.html, additionalProps)}
                    </td>
                  );
                } else {
                  tdContent = bookingGrid ? (
                    <td
                      key={`${ix}td`}
                      style={{
                        color: !listItem.isCancelled
                          ? "#000"
                          : listItem.isCancelled
                          ? "#ccc"
                          : "#000",
                      }}
                    >
                      {getText(header, listItem)}
                    </td>
                  ) : (
                    <td
                      key={`${ix}td`}
                      style={{
                        color:
                          enableDisableRow && listItem.enabled
                            ? "#000"
                            : enableDisableRow && !listItem.enabled
                            ? "#ccc"
                            : "#000",
                      }}
                    >
                      {getText(header, listItem)}
                    </td>
                  );
                }
                return tdContent;
              })}
            </tr>
          ))}
          {pagination && pagination?.totalPages > 1 && (
            <tr>
              <td colSpan={headers.length}>
                <Pagination
                  variant="outlined"
                  showFirstButton={true}
                  showLastButton={true}
                  className="paginationContainer"
                  count={pagination.totalPages}
                  page={pagination[pageNoText] + 1}
                  onChange={handleChange}
                />
              </td>
            </tr>
          )}
        </tbody> */}
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={headers.length}>
                <LoaderComponent />
              </td>
            </tr>
          ) : (
            listing.map((listItem, idx) => (
              <tr key={`${idx}tr`}>
                {headers.map((header, ix) => {
                  let tdContent;
                  if (!listItem[header.key] && header.html) {
                    let additionalProps = {};
                    if (header.radio) {
                      additionalProps.checked = radioCheckedValue === idx;
                    }
                    tdContent = (
                      <td
                        key={`${ix}td`}
                        style={{ cursor: "pointer" }}
                        onClick={(e) => htmlClick(header, e, listItem, idx)}
                      >
                        {React.cloneElement(header.html, additionalProps)}
                      </td>
                    );
                  } else {
                    tdContent = bookingGrid ? (
                      <td
                        key={`${ix}td`}
                        style={{
                          color: !listItem.isCancelled
                            ? "#000"
                            : listItem.isCancelled
                            ? "#ccc"
                            : "#000",
                        }}
                      >
                        {getText(header, listItem)}
                      </td>
                    ) : (
                      <td
                        key={`${ix}td`}
                        style={{
                          color:
                            enableDisableRow && listItem.enabled
                              ? "#000"
                              : enableDisableRow && !listItem.enabled
                              ? "#ccc"
                              : "#000",
                        }}
                      >
                        {getText(header, listItem)}
                      </td>
                    );
                  }
                  return tdContent;
                })}
              </tr>
            ))
          )}
          {pagination && pagination?.totalPages > 1 && (
            <tr>
              <td colSpan={headers.length}>
                <Pagination
                  variant="outlined"
                  showFirstButton={true}
                  showLastButton={true}
                  className="paginationContainer"
                  count={pagination.totalPages}
                  page={pagination[pageNoText] + 1}
                  onChange={handleChange}
                />
              </td>
            </tr>
          )}
        </tbody>
        <Menu
          id="menu"
          anchorEl={anchorEl}
          open={isMenu}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {!!navigationItems?.length &&
            navigationItems.map((item, idx) => (
              <MenuItem key={idx} onClick={() => menuItemClick(item.key)}>
                {item.display}
              </MenuItem>
            ))}
        </Menu>
      </table>
    </div>
  );
};

export default Grid;
