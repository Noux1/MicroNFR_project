import { Close } from '@mui/icons-material'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import React from 'react'
import FormAdd, { FormField } from './FormAdd'

interface PopupProps {
    open: boolean,
    onClose: () => void
    fields: FormField[]
    onSubmit: (formData: any) => void;
    initialData?: Record<string, any>

}

const Popup: React.FC<PopupProps> = ({ open, onClose, fields, onSubmit, initialData }) => {
    return (
        <Dialog open={open} onClose={onClose} >
            <DialogTitle >
                <Box className='flex justify-between '>
                    Add
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent className='flex-col justify-between items-start'>
                <FormAdd fields={fields} onSubmit={onSubmit} initialData={initialData} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog >
    )
}

export default Popup