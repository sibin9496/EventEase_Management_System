import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Loading...', size = 40 }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '200px',
                gap: 2,
            }}
        >
            <CircularProgress
                size={size}
                sx={{
                    color: 'primary.main',
                    '@keyframes pulse': {
                        '0%': {
                            opacity: 1,
                        },
                        '50%': {
                            opacity: 0.5,
                        },
                        '100%': {
                            opacity: 1,
                        },
                    },
                    animation: 'pulse 2s ease-in-out infinite',
                }}
            />
            <Typography variant="body2" color="text.secondary">
                {message}
            </Typography>
        </Box>
    );
};

export default LoadingSpinner;