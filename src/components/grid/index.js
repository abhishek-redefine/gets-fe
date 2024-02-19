import { Checkbox, FormControlLabel, Menu, MenuItem, Pagination } from '@mui/material';
import React, { useState } from 'react';

const Grid = ({ headers, pagination, listing = [], handlePageChange, onMenuItemClick }) => {

  const [isMenu, setIsMenu]= useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [navigationItems, setNavigationItems] = useState([]);
  const [clickedItem, setClickedItem] = useState();

  const handleChange = (event, page) => {
    handlePageChange(page - 1);
  };

  const htmlClick = (header, e, listItem) => {
    if (header.navigation) {
      setClickedItem(listItem);
      setIsMenu(true);
      setNavigationItems(header.menuItems);
      handleClick(e);
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

  return (
    <div>
      <table className='commonTable'>
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <td key={`${idx}tdfirst`}>{header.display}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {listing.map((listItem, idx) => (
            <tr key={`${idx}tr`}>
                {headers.map((header, ix) => (
                listItem[header.key] ? <td key={`${ix}td`}>{listItem[header.key]}</td> :
                <td key={`${ix}td`} style={{cursor: "pointer"}} onClick={(e) => htmlClick(header, e, listItem)}>{header.html}</td>
              ))}
            </tr>
          ))}
          {pagination && pagination?.totalPages > 1 && <tr>
            <td colSpan={headers.length}>
              <Pagination className="paginationContainer" count={pagination.totalPages} page={pagination.pageNo + 1} onChange={handleChange} />
            </td>
          </tr>}
        </tbody>
        <Menu
          id="menu"
          anchorEl={anchorEl}
          open={isMenu}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {!!navigationItems?.length && navigationItems.map((item, idx) => (<MenuItem key={idx} onClick={() => menuItemClick(item.key)}>{item.display}</MenuItem>))}
        </Menu>
      </table>
    </div>
  );
}

export default Grid;