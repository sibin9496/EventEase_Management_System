import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { 
  EventNote, 
  EventBusy, 
  SearchOff 
} from '@mui/icons-material';

const EmptyState = ({ 
  icon = 'default', 
  title, 
  description, 
  actionLabel, 
  onAction,
  size = 'medium' 
}) => {
  const getIcon = () => {
    const iconProps = {
      sx: { 
        fontSize: size === 'large' ? 64 : 48,
        color: 'text.secondary',
        mb: 2
      }
    };

    switch (icon) {
      case 'events':
        return <EventNote {...iconProps} />;
      case 'no-events':
        return <EventBusy {...iconProps} />;
      case 'search':
        return <SearchOff {...iconProps} />;
      default:
        return <EventNote {...iconProps} />;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 8,
        px: 2,
      }}
    >
      {getIcon()}
      <Typography 
        variant={size === 'large' ? 'h5' : 'h6'} 
        gutterBottom 
        color="text.primary"
      >
        {title}
      </Typography>
      <Typography 
        variant="body1" 
        color="text.secondary" 
        paragraph 
        sx={{ maxWidth: 400, mb: 3 }}
      >
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button 
          variant="contained" 
          onClick={onAction}
          className="btn-scale"
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;