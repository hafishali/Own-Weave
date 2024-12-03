import { Box, Container, Grid, Typography, Paper, CircularProgress, Button, TextField, MenuItem } from '@mui/material';
import { Line, Pie as ChartjsPie } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';
import { ViewSalesoverview, ViewDashboardstatistics } from '../../services/allApi';
import { useEffect, useState } from 'react';
import { Pie,Cell, PieChart } from 'recharts';



ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement
);


function Dashboard() {
  

  // Fetch total customers count on component mount
 

  // fetch payments count
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

  const [fromMonth, setFromMonth] = useState("January");
  const [fromYear, setFromYear] = useState("2024");
  const [toMonth, setToMonth] = useState("December");
  const [toYear, setToYear] = useState("2024");
  const [allSalesData, setAllSalesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ViewSalesoverview(); // API call to fetch data
        const monthlyOrders = response.data.monthly_orders || [];

        // Store all data for filtering purposes
        setAllSalesData(monthlyOrders);

        // Format data for the chart
        const formattedLabels = monthlyOrders.map((order) => {
          const date = new Date(order.month);
          return date.toLocaleString("default", { month: "long", year: "numeric" }); // "Month Year"
        });

        const formattedData = monthlyOrders.map((order) => order.total_orders);

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

const [pieData, setPieData] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ViewDashboardstatistics();
        console.log("Received response:", response);
  
        const totalInvested = response.data.total_invested_amount || 0;
        const totalReceived = response.data.total_received_amount || 0;
        const total = totalInvested + totalReceived;
  
        // Avoid division by zero
        if (total > 0) {
          const newData = [
            { name: "Invested", value: (totalInvested / total) * 100 },
            { name: "Received", value: (totalReceived / total) * 100 },
          ];
          
          setChartData(newData); // Update state
          console.log("chartdata",newData);
          
        } else {
          setChartData([]); // Handle empty state
          console.log("No data available for chart");
        }
      } catch (error) {
        console.error("Error fetching dashboard statistics:", error);
      }
    };
  
    fetchData();
  }, []);
  
  // Log updates to chartData state
  useEffect(() => {
    console.log("Updated chartData:", chartData);
  }, [chartData]);
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ViewDashboardstatistics();
        const ordersByDistrict = response.data.orders_by_district_combined;
  
        // Sort districts by order count in descending order
        const sortedOrders = [...ordersByDistrict].sort((a, b) => b.order_count - a.order_count);
  
        // Select the top 7 districts
        const top7 = sortedOrders.slice(0, 7);
  
        // If there are more than 7 districts, combine the remaining into an "Others" category
        let labels = top7.map(item => item.district);
        let data = top7.map(item => item.order_count);
  
        if (sortedOrders.length > 7) {
          const othersOrderCount = sortedOrders.slice(7).reduce((sum, item) => sum + item.order_count, 0);
          labels.push('Others');
          data.push(othersOrderCount);
        }
  
        // Prepare the data for the Pie chart
        setPieData({
          labels,
          datasets: [
            {
              label: '# of Orders',
              data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(199, 199, 199, 0.2)',
                'rgba(128, 128, 128, 0.2)', // Color for "Others"
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(199, 199, 199, 1)',
                'rgba(128, 128, 128, 1)', // Border color for "Others"
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  

  const filterSalesData = () => {
    const monthToNumber = (month) =>
      new Date(`${month} 1, 2000`).getMonth(); // Normalize month parsing.
  
    const fromDate = new Date(fromYear, monthToNumber(fromMonth));
    const toDate = new Date(toYear, monthToNumber(toMonth));
  
    const filteredData = allSalesData.filter((item) => {
      const itemDate = new Date(item.year, monthToNumber(item.month));
      return itemDate >= fromDate && itemDate <= toDate;
    });
  
    if (filteredData.length > 0) {
      setSalesData({
        labels: filteredData.map((data) => `${data.month} ${data.year}`),
        datasets: [
          {
            label: "Sales",
            data: filteredData.map((data) => data.total_orders),
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
          },
        ],
      });
    } else {
      setSalesData({ labels: [], datasets: [] });
    }
  };
  
 
  const [totalProducts, setTotalProducts] = useState(null);
  const [totalCustomers, settotalCustomers] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [paidOrders, setPaidOrders] = useState(null);
  const [shopOrders, setShopOrders] = useState(null);
  const [cashOnDelivery, setCashOnDelivery] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch total products from the API
    ViewDashboardstatistics()
      .then((response) => {
        setTotalProducts(response.data.total_products); 
        settotalCustomers(response.data.total_users)
        setTotalRevenue(response.data.total_received_amount)
        setPaidOrders(response.data.total_orders)
        setCashOnDelivery(response.data.total_cod_user_orders+response.data.total_cod_admin_orders)
        console.log(response.data);
        
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  }, []);
  

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw.toFixed(2)}%`;  // Custom tooltip format
          },
        },
      },
    },
  };

  if (loading) {
    return ( <Box sx={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}><CircularProgress /></Box> );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
 
  

 

  return (
    <Container>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        {/* Summary Boxes */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Total Products
              </Typography>
             
                <Typography color="error"></Typography>
             
                <Typography variant="h4">          {totalProducts}
                </Typography>
              
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Total Customers
              </Typography>
              
                
              
                <Typography color="error"></Typography>
              
                <Typography variant="h4">{totalCustomers}</Typography>
             
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Total Revenue
              </Typography>
              
                

                <Typography color="error"></Typography>
           
                <Typography variant="h4">{totalRevenue}</Typography>
            
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Paid Orders
              </Typography>
             
                <Typography color="error"></Typography>
             
                <Typography variant="h4">{paidOrders}</Typography>
                {/* <Typography  variant="h6" sx={{textAlign:"center",}}><VisibilityIcon/></Typography> */}
                
              
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Shop Orders
              </Typography>
              
                
              
                <Typography color="error"></Typography>
              
                <Typography variant="h4">10</Typography>
                {/* <Typography  variant="h6" sx={{textAlign:"center",}}><VisibilityIcon/></Typography> */}
             
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Cash On Delivery
              </Typography>
              
                

                <Typography color="error"></Typography>
           
                <Typography variant="h4">{cashOnDelivery}</Typography>
                {/* <Typography  variant="h6" sx={{textAlign:"center",}}><VisibilityIcon/></Typography> */}
            
            </Paper>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
  <Paper elevation={3} sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>
      Sales Overview
    </Typography>
    {/* Filter Section */}
    <Grid container spacing={2} alignItems="center">
      <Grid item>
        <TextField
          select
          label="From Month"
          variant="outlined"
          value={fromMonth}
          onChange={(e) => setFromMonth(e.target.value)}
          fullWidth
          sx={{ minWidth: 120 }}
        >
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((month) => (
            <MenuItem key={month} value={month}>
              {month}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item>
        <TextField
          select
          label="From Year"
          variant="outlined"
          value={fromYear}
          onChange={(e) => setFromYear(e.target.value)}
          fullWidth
          sx={{ minWidth: 120 }}
        >
          {["2023", "2024", "2025"].map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item>
        <TextField
          select
          label="To Month"
          variant="outlined"
          value={toMonth}
          onChange={(e) => setToMonth(e.target.value)}
          fullWidth
          sx={{ minWidth: 120 }}
        >
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((month) => (
            <MenuItem key={month} value={month}>
              {month}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item>
        <TextField
          select
          label="To Year"
          variant="outlined"
          value={toYear}
          onChange={(e) => setToYear(e.target.value)}
          fullWidth
          sx={{ minWidth: 120 }}
        >
          {["2023", "2024", "2025"].map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" onClick={filterSalesData}>
          Apply Filter
        </Button>
      </Grid>
    </Grid>
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

<Grid  item xs={12} md={6}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Category Breakdown
        </Typography>
        {pieData ? (
          <ChartjsPie data={pieData} />
        ) : (
          <Typography variant="body2">Loading...</Typography>
        )}
      </Paper>
    </Grid>
    

        </Grid>

        <Grid container spacing={3} sx={{ mt: 3 }}>
       
        </Grid>
        <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
  <Paper sx={{ p: 2, width: "100%", height: "100%" }}>
    <Typography variant="h6" gutterBottom>
      Investment vs Received
    </Typography>
    {chartData.length > 0 ? (
      <PieChart width={350} height={350}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: ${value.toFixed(2)}%`} // Ensures proper format
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          options={options}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index === 0 ? "#0088FE" : "#00C49F"} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    ) : (
      <Typography>No data available</Typography>
    )}
  </Paper>
</Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Dashboard;
