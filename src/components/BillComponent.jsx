import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

const BillComponent = React.forwardRef(({ orderDetails = {} }, ref) => {
  return (
    <Paper 
      ref={ref} 
      elevation={3} 
      sx={{ 
        padding: 3, 
        maxWidth: 600, 
        margin: '0 auto',
        border: '1px solid #ccc',
        borderRadius: '8px'
      }}
    >
      <Grid container spacing={2}>
        {/* Header Section with Shipping and COD */}
        <Grid item xs={8}>
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              Shipping To:
            </Typography>
            <Typography sx={{ whiteSpace: 'pre-line' }}>
              {orderDetails.customerName || 'Shibu P N'}
              {'\n'}
              {orderDetails.addressLine1 || 'KRRA 40'}
              {'\n'}
              {orderDetails.addressLine2 || 'Maradu po'}
              {'\n'}
              {orderDetails.city || 'Eranakulam dist'}
              {'\n'}
              Pin {orderDetails.pin || '682 304'}
              {'\n'}
              Ph {orderDetails.phone || '8891945529'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={4}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" fontWeight="bold">
              COD: Rs-{orderDetails.amount || '1595'}/-
            </Typography>
            <Typography color="text.secondary">
              co.ID: {orderDetails.orderId || '55220'}
            </Typography>
          </Box>
        </Grid>

        {/* Social Media Section */}
        <Grid item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ my: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FacebookIcon sx={{ fontSize: 20 }} />
                <Typography>ownweave</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InstagramIcon sx={{ fontSize: 20 }} />
                <Typography>@ownweave</Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography>
                Packing Date: {orderDetails.packingDate || '11/11/2024'}
              </Typography>
              <Typography>
                Item co: {orderDetails.itemCode || 'srt, fb'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* QR Code, Logo, and Company Info Section */}
        <Grid item xs={4}>
          <QRCodeSVG
            value="https://ownweave.com"
            size={128}
            style={{ width: '100%', height: 'auto', maxWidth: '128px' }}
          />
        </Grid>

        <Grid item xs={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Box 
              component="img"
              src="/own-weave-logo.svg" 
              alt="Own Weave"
              sx={{
                width: 100,
                height: 100,
                mb: 1,
                bgcolor: '#f5f5f5',
                borderRadius: '50%'
              }}
            />
            <Typography variant="body2">
              Handloom Cloth Manufactur
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={4}>
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              From:
            </Typography>
            <Typography sx={{ whiteSpace: 'pre-line' }}>
              OWN WEAVE
              {'\n'}
              KPKH Tower, New overbridge
              {'\n'}
              Tirur, Malappuram
              {'\n'}
              pin: 676101
              {'\n'}
              Mob: 9995 195 731
            </Typography>
          </Box>
        </Grid>

        {/* Thank You Message */}
        <Grid item xs={12}>
          <Typography 
            align="center" 
            fontWeight="bold"
            sx={{ 
              mt: 2,
              borderTop: '1px solid #eee',
              pt: 2
            }}
          >
            THANK YOU FOR BEING AN AMAZING CUSTOMER
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
});

BillComponent.displayName = 'BillComponent';

export default BillComponent;