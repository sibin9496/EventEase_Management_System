import React from 'react';
import { Box, Container } from '@mui/material';

const Section = ({ 
  children, 
  bg = 'transparent', 
  py = 8,
  sx = {},
  container = true,
  ...props 
}) => {
  const content = container ? (
    <Container>
      {children}
    </Container>
  ) : (
    children
  );

  return (
    <Box
      component="section"
      sx={{
        width: '100%',
        py: py,
        backgroundColor: bg,
        ...sx,
      }}
      {...props}
    >
      {content}
    </Box>
  );
};

export default Section;