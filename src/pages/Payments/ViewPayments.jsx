import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ViewallPayments } from '../../services/allApi';

const payments = [
  { id: 'P001', customerName: 'John Doe', amount: 100, date: '2024-08-01', status: 'Completed' },
  { id: 'P002', customerName: 'Jane Smith', amount: 200, date: '2024-08-03', status: 'Pending' },

];

function ViewPayments() {
  const [payments, setPayments] = useState([])

  const handlGetAllPayments = async () => {
    try {
      const response = await ViewallPayments()
      if (response.status === 200) {
        setPayments(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    handlGetAllPayments()
  }, [])
  console.log(payments)
  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'green';
      case 'Failed':
        return 'red';
      case 'Pending':
        return 'orange';
      default:
        return 'black'; // Default color for unknown status
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        View Payments
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "lightblue" }}>
            <TableRow>

              <TableCell>SI</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Customer Number</TableCell>
              <TableCell>Customer Email</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Type</TableCell>
              <TableCell>Status</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {payments && payments.length > 0 ? (
              payments.map((payment,index) => (
                <TableRow key={payment.id}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell>{payment.user?.name}</TableCell>
                  <TableCell>{payment.user?.mobile_number}</TableCell>
                  <TableCell>{payment.user?.email}</TableCell>
                  <TableCell>{payment.total_price}</TableCell>
                  <TableCell>{payment.payment_option}</TableCell>
                  <TableCell style={{ color: getStatusColor(payment.payment_status) }} >
                    {payment.payment_status}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>No payments</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ViewPayments;
