import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React from 'react'


interface FilterProps {
    label: string;
    menuItems: {
        value: string;
        text: string;
    }[];
    onChange: (selectedValue: string) => void;
}

const Filter: React.FC<FilterProps> = ({ label, menuItems, onChange }) => {
    const [value, setValue] = React.useState('');

    const handleChange = (event: SelectChangeEvent<string>) => {
        const selectedValue = event.target.value as string;
        setValue(selectedValue);
        onChange(selectedValue);
    };

    return (
        <FormControl sx={{ width: 200 }}>
            <InputLabel id='select' size='small'>{label}</InputLabel>
            <Select
                size='small'
                label={label}
                labelId='select'
                value={value}
                onChange={handleChange} // Pass handleChange directly
            >
                {menuItems.map((menuItem) => (
                    <MenuItem key={menuItem.value} value={menuItem.value}>
                        {menuItem.text}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default Filter;
