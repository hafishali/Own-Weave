import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Header from '../components/Header';
import SideBar from '../components/SideBar';
import AddProduct from './AddProduct';
import AddCategory from './AddCategory';
import ViewProduct from './ViewProducts';
import ViewCategory from './ViewCategory';
import ViewCustomers from './ViewCustomers';
import ViewPayments from './ViewPayments';
import Dashboard from './Dashboard';
import ViewOrders from './ViewOrders';
import Notifications from './Notifications';
import AddImagePage from './AddImage';
import AddSubcategory from './AddSubCategory';
import ViewSubcategory from './ViewSubCategory';
import AddSubAdmin from './AddSubadmin';
import ViewSubAdmin from './ViewSubadmin';
import SendNotification from './SendNotifications';
import Stocks from './Stocks';
import AnalyticalReport from './AnalyticalReport';
import AddPoster from './AddPoster';
import AddHomeImage from './AddHomeImage';
import DeliveryBoyManagement from './DeliveryBoy';

function Home() {
    const [selectedOption, setSelectedOption] = useState('dashboard'); // Default to dashboard
    const [userPermissions, setUserPermissions] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleDrawerToggle = () => {
      setIsSidebarOpen((prevOpen) => !prevOpen);
    };

  

    const handleMenuClick = (option) => {
        setSelectedOption(option);
    };

    const renderContent = () => {
        switch (selectedOption) {
            case 'addProduct':
                return <AddProduct />;
            case 'addCategory':
                return <AddCategory />;
            case 'viewProduct':
                return <ViewProduct />;
            case 'viewCategory':
                return <ViewCategory />;
            case 'viewCustomers':
                return <ViewCustomers />;
            case 'viewPayments':
                return <ViewPayments />;
            case 'dashboard':
                return <Dashboard />;
            case 'viewOrders':
                return <ViewOrders />;
            case 'viewDelivery':
                    return <DeliveryBoyManagement />;
            case 'notifications':
                return <Notifications />;
            case 'addCarosal':
                return <AddImagePage />;
                case 'addPoster':
                    return <AddPoster />;
                    case 'addHomeImage':
                        return <AddHomeImage />;
            case 'addSubcategory':
                return <AddSubcategory />;
            case 'viewSubcategory':
                return <ViewSubcategory />;
            case 'addSubAdmin':
                return <AddSubAdmin />;
            case 'viewSubAdmin':
                return <ViewSubAdmin />;
            case 'sendNotifications':
                return <SendNotification />;
            case 'viewStocks':
                return <Stocks />;
            case 'reports':
                return <AnalyticalReport />;
            default:
                return <Dashboard />; // Fallback to Dashboard
        }
    };
console.log(selectedOption)
    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
                 <Header handleDrawerToggle={handleDrawerToggle} />
      <SideBar isSidebarOpen={isSidebarOpen} handleDrawerToggle={handleDrawerToggle} setSelectedOption={setSelectedOption}  />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    ml: { xs: 0, sm: '240px' }, // Adjust the margin-left to match the sidebar width
                    overflowY: 'auto', // Allow vertical scrolling
                    height: 'calc(100vh - 64px)', // Subtract header height
                    position: 'relative', // Ensure it doesn't overlap the sidebar
                }}
            >
                <Toolbar />
                {renderContent()}
            </Box>
        </Box>
    );
}

export default Home;
