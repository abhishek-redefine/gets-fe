import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const LoaderComponent = () => {
  return (
    <Box sx={{ display: 'flex', color: "#000000" }}>
      <CircularProgress color="inherit"/>
    </Box>
  );
}

export default LoaderComponent;