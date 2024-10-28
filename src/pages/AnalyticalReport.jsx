import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const StockRevenueReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  
  


  // Sample Chart Data
  const chartData = [
    { name: 'Invested', value: 565},
    { name: 'Received', value: 856},
  ];

  const profitData = [
    { name: 'Profit', value: 45 },
    { name: 'Loss', value: 56 },
  ];

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
                Total Stock 
              </Typography>
              <Typography variant="h6" color="text.secondary">
               
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Amount Invested */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
              Invested Amt
              </Typography>
              <Typography variant="h6" color="text.secondary">
                RS.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Amount Received */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                 Received Amt
              </Typography>
              <Typography variant="h6" color="text.secondary">
                RS.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Profit */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Profit
              </Typography>
              <Typography variant="h6" color='green' >
                RS.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {/* Pie Chart for Amounts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Investment vs Received
            </Typography>
            <PieChart width={400} height={400}>
              <Pie
                data={chartData}
                cx={200}
                cy={200}
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                
                  <Cell  fill= '#0088FE'  />
               
              </Pie>
              <Tooltip />
            </PieChart>
          </Paper>
        </Grid>

        {/* Bar Chart for Profit/Loss */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Profit and Loss
            </Typography>
            <BarChart
              width={400}
              height={300}
              data={profitData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StockRevenueReport;
