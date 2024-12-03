import React, { useState, useEffect } from 'react';
import { useLocation,useNavigate  } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Hidden from '@mui/material/Hidden';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useTheme, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import { 
  Category, AddBox, ViewList, People, Payment, Notifications, 
  Dashboard, ShoppingCart, Assessment,
} from '@mui/icons-material';
import ReviewsIcon from '@mui/icons-material/Reviews';
import ImageIcon from '@mui/icons-material/Image';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import Divider from '@mui/material/Divider';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import AddTestimonial from '../pages/Testimonials/AddTestimonial';

function Sidebar({ isSidebarOpen, handleDrawerToggle ,setSelectedOption}) {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState({
    category: false,
    product: false,
    addCarousal: false,
  });

  const [selectedMenu, setSelectedMenu] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(isLargeScreen);


  const userRole = localStorage.getItem('role');

  useEffect(() => {
    // Update drawer state when screen size changes
    setIsDrawerOpen(isLargeScreen);
  }, [isLargeScreen]);

  const toggleSection = (section) => {
    setOpen((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleMenuClick = (action) => {
    // setSelectedOption(action);
    setSelectedMenu(action);
    // const params = new URLSearchParams(location.search);
    // params.set('action', action); 
    // window.history.pushState(null, '', `?${params.toString()}`);
    navigate(`?action=${action}`)
    // window.location.reload()
  };

  const handleDrawerToggleInternal = () => {
    setIsDrawerOpen((prevOpen) => !prevOpen);
    if (handleDrawerToggle) {
      handleDrawerToggle();
    }
  };

  const drawerStyles = {
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      width: 240,
      backgroundColor: '#043e6b',
      color: 'white',
    },
  };

  const selectedItemStyles = {
    backgroundColor: '#065d94',
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, action: 'dashboard',roles: ['Admin'] },
    { text: 'Analytical Report', icon: <Assessment />, action: 'reports',roles: ['Admin'] },
    {
      text: 'Offers',
      icon: <LocalOfferOutlinedIcon />,
      action: null,
      roles: ['Admin','Staff'],
      
      children: [
       
        { text: 'View Offer', icon: <LocalOfferOutlinedIcon />, action: 'viewOffers',roles: ['Admin','Staff'] },
      ],
    },
    {
      text: 'Category',
      icon: <Category />,
      roles: ['Admin','Staff'],
      children: [
        { text: 'View Category', icon: <ViewList />, action: 'viewCategory',roles: ['Admin','Staff'] },
        { text: 'Add Category', icon: <AddBox />, action: 'addCategory',roles: ['Admin','Staff'] },
        // { text: 'View Subcategory', icon: <ViewList />, action: 'viewSubcategory' },
        // { text: 'Add Subcategory', icon: <AddBox />, action: 'addSubcategory' },
      ],
    },
    {
      text: 'Product',
      icon: <Category />,
      roles: ['Admin','Staff'],
      children: [
        { text: 'Add Product', icon: <AddBox />, action: 'addProduct',roles: ['Admin','Staff'] },
        { text: 'View Product', icon: <ViewList />, action: 'viewProduct',roles: ['Admin','Staff'] },
        // { text: 'View Stocks', icon: <ProductionQuantityLimitsIcon />, action: 'viewStocks' },
      ],
    },
    { text: 'Orders', icon: <ShoppingCart />, action: null,
      roles: ['Admin','Staff'],
      children: [
        { text: 'View Orders', icon: <ShoppingCart />, action: 'viewOrders' ,roles: ['Admin','Staff']},
        { text: 'Rejected Orders', icon: <ShoppingCart />, action: 'RejectedOrders' ,roles: ['Admin','Staff']},
        { text: 'View Returns', icon: <ShoppingCart />, action: 'ViewReturns',roles: ['Admin','Staff'] },
        { text: 'Completed Orders', icon: <ShoppingCart />, action: 'CompletedOrders' ,roles: ['Admin','Staff']},
        { text: 'Custom Orders', icon: <ShoppingCart />, action: 'CustomOrders',roles: ['Admin','Staff'] },
        
      ],
     },
    { text: 'Customers', icon: <People />, action: 'viewCustomers',roles: ['Admin','Staff'] },
    { text: 'Payments', icon: <Payment />, action: 'viewPayments',roles: ['Admin'] },
    // {
    //   text: 'Add Carousal',
    //   icon: <ImageIcon />,
    //   action: null,
      
    //   children: [
    //     { text: 'Add Carousal', icon: <AddBox />, action: 'addCarosal' },
    //     { text: 'Add Poster', icon: <AddBox />, action: 'addPoster' },
    //     { text: 'Add Home Image', icon: <AddBox />, action: 'addHomeImage' },
    //   ],
    // },
    {
      text: 'Sub Admin',
      icon: <People />,
      action: null,
      roles: ['Admin'],
     
      children: [
        { text: 'Add Sub Admin', icon: <AddBox />, action: 'addSubAdmin' ,roles: ['Admin']},
        { text: 'View Sub Admin', icon: <ViewList />, action: 'viewSubAdmin',roles: ['Admin'] },
      ],
    },
    { text: 'Testimonials', icon: <ReviewsIcon />, action: 'testimonials',roles: ['Admin','Staff'] },
    /* { text: 'Notification', icon: <Notifications />, action: 'notifications',roles: ['Admin','Staff'] },
    { text: 'Send Notifications', icon: <Notifications />, action: 'sendNotifications',roles: ['Admin','Staff'] }, */
  ];

  return (
    <>
      {/* Sidebar for smaller screens */}
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          open={isSidebarOpen}
          onClose={handleDrawerToggleInternal}
          ModalProps={{ keepMounted: true }}
          sx={drawerStyles}
        >
          <Toolbar />
          <List component="nav">
          {menuItems.map((item) => (
              item.roles.includes(userRole) && (
              <React.Fragment key={item.text}>
                <ListItem
                  button
                  onClick={() => item.action ? handleMenuClick(item.action) : toggleSection(item.text.toLowerCase())}
                  sx={selectedMenu === item.action ? selectedItemStyles : null}
                >
                  <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                  {item.children && (open[item.text.toLowerCase()] ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />)}
                </ListItem>
                {item.children && (
                  <Collapse in={open[item.text.toLowerCase()]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children.map((child) => (
                        <ListItem
                          button
                          sx={{ pl: 4, ...(selectedMenu === child.action ? selectedItemStyles : {}) }}
                          key={child.text}
                          onClick={() => handleMenuClick(child.action)}
                        >
                          <ListItemIcon sx={{ color: 'white' }}>{child.icon}</ListItemIcon>
                          <ListItemText primary={child.text} />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
                <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
              </React.Fragment>
            )
          ))}
          </List>
        </Drawer>
      </Hidden>

      {/* Sidebar for larger screens */}
      <Hidden xsDown implementation="css">
        <Drawer variant="persistent" open={isDrawerOpen} sx={drawerStyles}>
          <Toolbar />
          <List component="nav">
          {menuItems.map((item) => (
              item.roles.includes(userRole) && (
              <React.Fragment key={item.text}>
                <ListItem
                  button
                  onClick={() => item.action ? handleMenuClick(item.action) : toggleSection(item.text.toLowerCase())}
                  sx={selectedMenu === item.action ? selectedItemStyles : null}
                >
                  <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={<Typography>{item.text}</Typography>} />
                  {item.children && (open[item.text.toLowerCase()] ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />)}
                </ListItem>
                {item.children && (
                  <Collapse in={open[item.text.toLowerCase()]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children.map((child) => (
                        <ListItem
                          button
                          sx={{ pl: 4, ...(selectedMenu === child.action ? selectedItemStyles : {}) }}
                          key={child.text}
                          onClick={() => handleMenuClick(child.action)}
                        >
                          <ListItemIcon sx={{ color: 'white' }}>{child.icon}</ListItemIcon>
                          <ListItemText primary={<Typography>{child.text}</Typography>} />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
                <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
              </React.Fragment>
             )
            ))}
          </List>
        </Drawer>
      </Hidden>
    </>
  );
}

export default Sidebar;
