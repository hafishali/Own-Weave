import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Typography, List, ListItem, ListItemText, IconButton, Divider, Typography as MuiTypography } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done'; // Icon for marking as read
import DeleteIcon from '@mui/icons-material/Delete'; // Icon for deleting read notifications


function NotificationsView() {
  const [tabValue, setTabValue] = useState('unread');
  const [notifications, setNotifications] = useState({ unread: [], read: [] });

 

  
    
  
  

 

  const renderNotifications = (type) => {
    const notificationsList = notifications[type];
    if (notificationsList.length === 0) {
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <MuiTypography variant="body1">No Unread notifications</MuiTypography>
        </Box>
      );
    }

    return ( <Box  sx={{ mb: 2, p: 2, borderRadius: 1, boxShadow: 1, backgroundColor: '#f5f5f5' }}>
      <ListItem sx={{ display: 'flex', alignItems: 'center' }}>
        <ListItemText
          primary=''
          secondary=''
          sx={{ flexGrow: 1 }}
        />
        {type === 'unread' ? (
          <IconButton color="primary">
            <DoneIcon />
          </IconButton>
        ) : (
          <IconButton  color="error">
            <DeleteIcon />
          </IconButton>
        )}
      </ListItem>
      
      <Divider />
    </Box>)
     
    
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" component="div" gutterBottom>
        Notifications
      </Typography>
      <Tabs
        value={tabValue}
        onChange={(event, newValue) => setTabValue(newValue)}
        aria-label="notification tabs"
        sx={{ mb: 2 }}
      >
        <Tab label="Unread" value="unread" />
        <Tab label="Read" value="read" />
      </Tabs>
      <Box sx={{ width: '100%' }}>
        <List sx={{ padding: 0 }}>
          {renderNotifications(tabValue)}
        </List>
      </Box>
      
    </Box>
  );
}

export default NotificationsView;
