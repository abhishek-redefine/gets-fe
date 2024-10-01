import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const LoaderComponent = () => {
  return (
    <Box
      sx={{
        // zIndex: 10,
        display: "flex",
        color: "#000000",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress color="inherit" />
    </Box>
  );
};

export default LoaderComponent;
