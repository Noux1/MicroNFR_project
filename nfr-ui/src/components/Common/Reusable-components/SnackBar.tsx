import { Alert, Snackbar } from '@mui/material';
import React from 'react';

interface SnackbarProps {
    open: boolean;
    onClose: () => void;
    text: string;
    severity: 'success' | 'error' | 'warning' | 'info';
}

const SnackBar: React.FC<SnackbarProps> = ({ open, onClose, text, severity }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            onClose={onClose}>
            <Alert onClose={onClose}
                severity={severity}
                variant='filled'
                sx={{ width: '100%' }}
            >
                {text}
            </Alert>
        </Snackbar>
    );
}

export default SnackBar;
