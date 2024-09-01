import { Box, Typography } from '@mui/material'
import React from 'react'

const PropertyValues = ({ title, oldValue, newValue }) => {
    return (
        <Box>
            <Typography variant="h6">{title}:</Typography>
            {oldValue !== null && (
                <Typography variant='body1' paddingLeft={1}>Old Value: {oldValue ? oldValue.toString() : "No"}</Typography>
            )}
            {newValue !== null && (
                <Typography variant='body1' paddingLeft={1}>New Value: {newValue ? newValue.toString() : "No"}</Typography>
            )}
        </Box>
    )
}

export default PropertyValues