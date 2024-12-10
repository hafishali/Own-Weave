import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import AddProduct from './pages/Products/AddProduct';
import AddCategory from './pages/category/AddCategory';
import ViewProduct from './pages/Products/ViewProducts';
import ViewCategory from './pages/category/ViewCategory';
import ViewPayments from './pages/Payments/ViewPayments';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import ViewOrders from './pages/Orders/ViewOrders';
import Notifications from './pages/Notifications/Notifications';
import AddImagePage from './pages/AddImage';
import AddSubcategory from './pages/category/AddSubCategory';
import ViewSubcategory from './pages/category/ViewSubCategory';
import AddSubAdmin from './pages/Sub admin/AddSubadmin';
import ViewSubAdmin from './pages/Sub admin/ViewSubadmin';
import SendNotification from './pages/Notifications/SendNotifications';
import BillComponent from './components/BillComponent';
import BillComponentOrders from './components/BillComponentOrders';
import CustomInvoice from './components/CustomInvoice';
import InvoicePrint from './components/InvoicePrint';
import OnlineInvoice from './components/OnlineInvoice';

function App() {
  // const isAdminLoggedIn = () => {
  //   const adminToken = localStorage.getItem("groceryadmin");
  //   return adminToken;
  // };
  // const AdminRoute = ({ element }) => {
  //   return isAdminLoggedIn() ? element : <Navigate to="/login" />;
  // };
  return (
    <div className="App">
      <Routes>
        <Route path='/home' element={<Home></Home> }></Route>
        {/* <Route path='/addproduct' element={<AdminRoute element={<AddProduct></AddProduct>}/> }></Route>
        <Route path='/addcategory' element={<AdminRoute element={<AddCategory></AddCategory>}/> }></Route>
        <Route path='/viewproducts' element={<AdminRoute element={<ViewProduct></ViewProduct>}/> }></Route>
        <Route path='/viewcategory' element={<AdminRoute element={<ViewCategory></ViewCategory>}/> }></Route>
        <Route path='/viewpayments' element={<AdminRoute element={<ViewPayments></ViewPayments>}/> }></Route> */}
        <Route path='/' element={<LoginPage></LoginPage>}></Route>
        <Route path='/bill' element={<BillComponent></BillComponent>}></Route>
        <Route path='/bill/orders' element={<BillComponentOrders></BillComponentOrders>}></Route>
        <Route path='/invoice' element={<InvoicePrint></InvoicePrint>}></Route>
        <Route path='/online/bill' element={<OnlineInvoice></OnlineInvoice>}></Route>
        
        {/* <Route path='/dashboard' element={<AdminRoute element={<Dashboard></Dashboard>}/> }></Route>
        <Route path='/vieworders' element={<AdminRoute element={<ViewOrders></ViewOrders>}/> }></Route>
        <Route path='/notifications' element={<AdminRoute element={<Notifications></Notifications>}/> }></Route>
        <Route path='/addimage' element={<AdminRoute element={<AddImagePage></AddImagePage>}/> }></Route>
        <Route path='/addsub' element={<AdminRoute element={<AddSubcategory></AddSubcategory>}/> }></Route>
        <Route path='/viewsub' element={<AdminRoute element={<ViewSubcategory></ViewSubcategory>}/> }></Route>
        <Route path='/addsubadmin' element={<AdminRoute element={<AddSubAdmin></AddSubAdmin>}/> }></Route>
        <Route path='/viewsubadmin' element={<AdminRoute element={<ViewSubAdmin></ViewSubAdmin>}/> }></Route>
        <Route path='/sendnotification' element={<AdminRoute element={<SendNotification></SendNotification>}/> }></Route> */}







      </Routes>
    </div>
  );
}

export default App;
