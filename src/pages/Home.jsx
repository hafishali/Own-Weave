import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Header from '../components/Header';
import SideBar from '../components/SideBar';
import AddProduct from './Products/AddProduct';
import AddCategory from './category/AddCategory';
import ViewProduct from './Products/ViewProducts';
import ViewCategory from './category/ViewCategory';
import ViewCustomers from './customers/ViewCustomers';
import ViewPayments from './Payments/ViewPayments';
import Dashboard from './Dashboard/Dashboard';
import ViewOrders from './Orders/ViewOrders';
import Notifications from './Notifications/Notifications';
import AddImagePage from './AddImage';
import AddSubcategory from './category/AddSubCategory';
import ViewSubcategory from './category/ViewSubCategory';
import AddSubAdmin from './Sub admin/AddSubadmin';
import ViewSubAdmin from './Sub admin/ViewSubadmin';
import SendNotification from './Notifications/SendNotifications';
import Stocks from './Products/Stocks';
import AnalyticalReport from './Analytical report/AnalyticalReport';
import AddPoster from './AddPoster';
import AddHomeImage from './AddHomeImage';
import DeliveryBoyManagement from './DeliveryBoy';
import ViewReturn from './Orders/ViewReturn';

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
            case 'ViewReturns':
                return <ViewReturn/>
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
