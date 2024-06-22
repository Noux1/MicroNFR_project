import { Box, Button, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent, Switch, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'

export interface FormField {
    name: string;
    label: string;
    type?: 'text' | 'number' | 'email' | 'switch' | 'list' | string;
    required?: boolean;
    options?: string[];
    initialValue?: any;
}

interface FormAddProps {
    fields: FormField[];
    onSubmit: (formData: Record<string, any>) => void;
    initialData?: Record<string, any>
}

const FormAdd: React.FC<FormAddProps> = ({ fields, onSubmit, initialData }) => {
    const [formData, setFormData] = useState<Record<string, any>>(initialData || {});

    useEffect(() => {
        setFormData(initialData || {})
    }, [initialData])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string, value: unknown }> | React.ChangeEvent<{ name?: string, value: unknown }> | SelectChangeEvent<any>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name as string]: value });
    };

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        const status = checked ? 'Activated' : 'Deactivated'; // Map switch value to 'Activated' or 'Deactivated'
        setFormData({ ...formData, [name]: status });
        console.log({ ...formData, [name]: status })
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(formData);
        setFormData({});
    };

    const renderFields = () =>
        fields.map((field) => {
            switch (field.type) {
                case 'text':
                case 'number':
                case 'email':
                    return (
                        <TextField
                            size='small'
                            key={field.name}
                            label={field.label}
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                            type={field.type || 'text'}
                            error={field.required && !formData[field.name]}
                            helperText={field.required && !formData[field.name] ? 'Required field' : ''}
                            sx={{ marginBottom: 1 }}
                        />
                    );
                case 'switch':
                    return (
                        <FormControl key={field.name} sx={{ marginBottom: 3 }}>
                            <FormControlLabel
                                label={field.label}
                                control={
                                    <Switch checked={formData[field.name] === 'Activated' || false}
                                        onChange={handleSwitchChange}
                                        name={field.name} size='small' />}

                            />
                        </FormControl>
                    );
                case 'list':
                    return (
                        <FormControl key={field.name} fullWidth sx={{ marginBottom: 2 }}>
                            <InputLabel id='select' size='small'>{field.label}</InputLabel>
                            <Select
                                labelId={`${field.name}-label`}
                                id={field.name}
                                value={formData[field.name] || field.initialValue || ''} // Use initialValue if provided
                                label={field.label}
                                onChange={handleChange}
                                name={field.name}
                                size='small'
                            >
                                {field.options?.map((option) => (
                                    <MenuItem key={option} value={option} >
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl >
                    );
                default:
                    return null;
            }
        });

    return (
        <Box component="form" onSubmit={handleSubmit} >
            {renderFields()}
            <Button type='submit' variant='contained' color='primary' sx={{ marginY: 2 }} size='small'>Add</Button>
        </Box>
    );
};

export default FormAdd;