import React from 'react';
import { Box, Typography } from '@mui/material';


const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 20,
                width: '100%',
                padding: '6px',
                textAlign: 'center',
                zIndex: -1000
            }}
        >
            <Typography variant="body1" >
                &copy; {currentYear}. Tous droits réservés.
            </Typography>
        </Box >
    );
};

export default Footer;
