import { Box, FormControlLabel, Switch } from '@mui/material'
import React from 'react'

interface SwitchFormProps {
    checked: boolean,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    label: string
}

const SwitchForm: React.FC<SwitchFormProps> = ({ checked, onChange, label }) => {
    return (
        <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
            <FormControlLabel
                control={
                    <Switch
                        checked={checked}
                        onChange={onChange}
                        name={label}
                        color="primary"
                    />
                }
                label={label}
            />
        </Box>
    )
}

export default SwitchForm