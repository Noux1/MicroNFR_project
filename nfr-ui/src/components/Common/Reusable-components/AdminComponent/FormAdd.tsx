import { Box, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent, Switch, TextField } from '@mui/material'
import React from 'react'

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
    formData: Record<string, any>;
    handleChange: (event: React.ChangeEvent<HTMLInputElement | { name?: string, value: unknown }> | React.ChangeEvent<{ name?: string, value: unknown }> | SelectChangeEvent<any>) => void;
    handleSwitchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormAdd: React.FC<FormAddProps> = ({ fields, formData, handleChange, handleSwitchChange }) => {

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
        <Box>
            {renderFields()}
        </Box>
    );
};
export default FormAdd;