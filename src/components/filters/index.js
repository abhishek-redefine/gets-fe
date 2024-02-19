import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';

const Filters = () => {
  

  const handleChange = () => {

  };

  return (
    <div className='filtersContainer'>
        <div className='filtersInnerContainer'>
            <div className='filterTypeContainer'>
                <span class="material-symbols-outlined">tune</span>
                <span>Filters</span>
            </div>
            <div>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={""}
                    label="Age"
                    onChange={handleChange}
                >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
                </FormControl>                
            </div>
        </div>
        <div>
            {/* Search */}
        </div>
    </div>
  )
}

export default Filters;;