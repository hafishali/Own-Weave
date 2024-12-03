import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import { ViewDashboardstatistics, ViewSalesoverview } from '../../services/allApi';
import { Line } from 'react-chartjs-2';


const StockRevenueReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(null);
  const [todayOrders, setTodayOrders] = useState(null);
  const [todayRevenue, setTodayRevenue] = useState(null);
  const [todayCod, setTodayCod] = useState(null);
  const [todayOnlinePayment, setTodaOnlinePayment] = useState(null);
  const [todayShopOrders, setTodayShopOrders] = useState(null);
 



  
  



  const profitData = [
    { name: 'Profit', value: 45 },
    { name: 'Loss', value: 56 },
  ];
  const [allSalesData, setAllSalesData] = useState([]);

  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Sales',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ViewDashboardstatistics(); // API call to fetch data
        const dailyOrders = response.data.last_7_days_orders || [];
console.log("dailyorders",dailyOrders);

        // Store all data for filtering purposes
        setAllSalesData(dailyOrders);

        // Format data for the chart
        const formattedLabels = dailyOrders.map((order) => {
          const dayOfWeek = new Date(order.day).toLocaleDateString("default", { weekday: "long" });
          return dayOfWeek;
        });
        
        // Extract the total orders
        const formattedData = dailyOrders.map((order) => order.total_orders);
        setSalesData({
          labels: formattedLabels,
          datasets: [
            {
              label: "Sales",
              data: formattedData,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    // Fetch total products from the API
    ViewDashboardstatistics()
      .then((response) => {
        setTotalProducts(response.data.total_products); 
        setTodayOrders(response.data.today_orders_count)
        setTodayRevenue(response.data.today_received_amount)
        setTodayCod(response.data.today_cod_orders)
        setTodaOnlinePayment(response.data.today_online_payment_orders)
        setTodayShopOrders(response.data.today_shop_orders)
        console.log(response.data);
        
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
 
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Stock Revenue Report
      </Typography>

      <Grid container spacing={3}>
        {/* Total Stock Quantity */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Total Product 
              </Typography>
              <Typography variant="h6" >
               {totalProducts}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
              Today Orders
              </Typography>
              <Typography variant="h6">
                {todayOrders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Amount Received */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Today Received Amt
              </Typography>
              <Typography variant="h6" >
              {todayRevenue}

              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Today Cash On Delivery
              </Typography>
              <Typography variant="h6"  >
              {todayCod}

              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid className='mt-3' container spacing={3} style={{marginTop:'5%'}}>
      <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Today Shop Order
              </Typography>
              <Typography variant="h6"  >
              {todayShopOrders}

              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Today Online Payment
              </Typography>
              <Typography variant="h6"  >
              {todayOnlinePayment}

              </Typography>
            </CardContent>
          </Card>
        
</Grid>
</Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
       

        {/* Bar Chart for Profit/Loss */}
        <Grid item xs={12} md={6}>
  <Paper elevation={3} sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>
      Sales Overview
    </Typography>
    {/* Filter Section */}
  
    {/* Line Chart */}
    {salesData.labels.length ? (
      <Line data={salesData} />
    ) : (
      <Typography
        variant="body1"
        color="textSecondary"
        align="center"
        sx={{ mt: 2 }}
      >
        No data available for the selected range.
      </Typography>
    )}
  </Paper>
</Grid>
      </Grid>
    </Box>
  );
};

export default StockRevenueReport;
