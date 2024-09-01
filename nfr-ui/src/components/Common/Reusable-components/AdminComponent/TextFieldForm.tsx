import { SelectChangeEvent, TextField } from '@mui/material'
import React from 'react'

interface TextFieldFormProps {
    label: string,
    name: string,
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement | { name?: string, value: unknown }> | React.ChangeEvent<{ name?: string, value: unknown }> | SelectChangeEvent<any>) => void,
    disabled?: boolean
}

const TextFieldForm: React.FC<TextFieldFormProps> = ({ label, name, value, onChange, disabled }) => {
    return (
        <TextField
            size='small'
            label={label}
            name={name}
            value={value}
            onChange={onChange}
            margin="normal"
            fullWidth
            sx={{ marginBottom: 1 }}
            disabled={disabled}
        />
    )
}

export default TextFieldForm