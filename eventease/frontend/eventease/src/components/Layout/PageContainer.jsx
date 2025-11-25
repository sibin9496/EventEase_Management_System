import React from 'react';
import { Box } from '@mui/material';

const PageContainer = ({ children, sx = {}, ...props }) => {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default PageContainer;