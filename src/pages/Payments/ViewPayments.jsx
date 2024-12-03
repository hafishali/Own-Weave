import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton ,Button} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ViewallPayments } from '../../services/allApi';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Label } from 'recharts';



function ViewPayments() {
  const [payments, setPayments] = useState([])
  const [filterstatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handlGetAllPayments = async () => {
    try {
      const response = await ViewallPayments()
      if (response.status === 200) {
        const sortedPayments = response.data.sort((a, b) => new Date(b.created_at	) - new Date(a.created_at));

        setPayments(sortedPayments)
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
  const handleStatusChangeFilter = (event) => {
    setFilterStatus(event.target.value);
  };
  const filteredorders = payments.filter(order => {
    // Status filter
    const statusMatch = filterstatus === 'All' || order.payment_status === filterstatus;
  
    // Date range filter
    const orderDate = dayjs(order.created_at.split("T")[0]);
    const startDateMatch = startDate ? orderDate.isAfter(dayjs(startDate).subtract(1, 'day')) : true;
    const endDateMatch = endDate ? orderDate.isBefore(dayjs(endDate).add(1, 'day')) : true;
  
    return statusMatch && startDateMatch && endDateMatch;
  });
  const clearFilters = () => {
    setFilterStatus("All");
    setStartDate(null);
    setEndDate(null);
  };

const itemsPerPage = 10;
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = filteredorders.slice(indexOfFirstItem, indexOfLastItem);

const count = filteredorders.length; 
const totalPages = Math.ceil(count / itemsPerPage); 
const startCustomerIndex = indexOfFirstItem + 1;  
const endCustomerIndex = Math.min(indexOfLastItem, count);  
const handlePrevPage = () => {
  setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));  
};
const handleNextPage = () => {
  setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));  
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
          {currentItems.length > 0 ? (  
    currentItems.map((payment, index) => (
                <TableRow key={payment.id}>
                  <TableCell>{startCustomerIndex + index}</TableCell>
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
              // Fallback Message when there are no orders
              <TableRow>
                <TableCell colSpan={11} style={{ textAlign: 'center' }}>  {/* Adjust colSpan based on total columns */}
                  No  Payments
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
               {/* Pagination Controls */}
               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
  <Button
    variant="contained"
    onClick={handlePrevPage}
    disabled={currentPage === 1}
  >
    Previous
  </Button>

  <Typography sx={{ mx: 2 }}>
    {`Showing ${startCustomerIndex} to ${endCustomerIndex} of ${count}`}
  </Typography>

  <Button
    variant="contained"
    onClick={handleNextPage}
    disabled={currentPage === totalPages}
  >
    Next
  </Button>
</Box>
    </Box>
  );
}

export default ViewPayments;
