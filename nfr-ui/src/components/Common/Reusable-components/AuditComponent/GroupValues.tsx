import { Box, Typography } from '@mui/material'
import React from 'react'

const GroupValues = ({ title, values }) => {
    return (
        <div>
            <Typography variant='body1' paddingLeft={1}>{title}:</Typography>
            <Box sx={{ paddingLeft: 3 }}>
                <Typography>Group ID: {values.idGroup}</Typography>
                <Typography>Libelle: {values.libelle}</Typography>
                <Typography>Active: {values.actif ? "Yes" : "No"}</Typography>
            </Box>
        </div>
    )


}

export default GroupValues