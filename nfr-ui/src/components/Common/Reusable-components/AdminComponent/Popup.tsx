import { Close } from '@mui/icons-material'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FormAdd, { FormField } from './FormAdd'
import { SelectChangeEvent } from '@mui/material'


interface PopupProps {
    open: boolean;
    onClose: () => void;
    fields: FormField[];
    onSubmit: (formData: any) => void;
    initialData?: Record<string, any>;
}

const Popup: React.FC<PopupProps> = ({ open, onClose, fields, onSubmit, initialData }) => {
    const [formData, setFormData] = useState<Record<string, any>>(initialData || {});

    useEffect(() => {
        setFormData(initialData || {});
    }, [initialData]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string, value: unknown }> | React.ChangeEvent<{ name?: string, value: unknown }> | SelectChangeEvent<any>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name as string]: value });
    };

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        const status = checked ? 'Activated' : 'Deactivated'; // Map switch value to 'Activated' or 'Deactivated'
        setFormData({ ...formData, [name]: status });
    };

    const handleSubmit = () => {
        onSubmit(formData);
        setFormData({});
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Box className='flex justify-between'>
                    Add
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent className='flex-col justify-between items-start'>
                <FormAdd
                    fields={fields}
                    formData={formData}
                    handleChange={handleChange}
                    handleSwitchChange={handleSwitchChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit} variant='contained' color='primary'>Add</Button>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default Popup;
