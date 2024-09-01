import { Add } from '@mui/icons-material'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React from 'react'

interface SelectFieldFormProps {
    label: string,
    name: string,
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement | { name?: string, value: unknown }> | React.ChangeEvent<{ name?: string, value: unknown }> | SelectChangeEvent<any>) => void,
    options: { id: number | string, value: string }[],
    showAddButton?: boolean,
    handleAdd?: () => void,
    userAuthorities?: { data: string, isGranted: boolean }[],
    addAuthority?: string
}

const SelectFieldFrom: React.FC<SelectFieldFormProps> = ({ label, name, value, onChange, options, showAddButton, handleAdd, userAuthorities, addAuthority }) => {
    return (
        <Box display="flex" alignItems="center">
            <FormControl fullWidth margin="normal">
                <InputLabel id={`${name}-label`}>{label} </InputLabel>
                <Select
                    labelId={`${name}-label`}
                    label={label}
                    name={name}
                    value={value}
                    onChange={onChange}
                >
                    {options.map((option) => (
                        <MenuItem key={option.id} value={option.value}>
                            {option.value}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {showAddButton && handleAdd && userAuthorities.some(auth => auth.data === addAuthority && auth.isGranted) && (
                <Button
                    onClick={handleAdd}
                    variant="contained"
                    color="primary"
                    startIcon={< Add />}
                >
                    Add
                </Button>
            )
            }
        </Box >
    )
}

export default SelectFieldFrom