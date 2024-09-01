import { Box, Typography } from '@mui/material'
import React from 'react'

const ModuleValues = ({ title, values }) => {
    return (
        <div>
            <Typography variant='body1' paddingLeft={1}>{title}:</Typography>
            <Box sx={{ paddingLeft: 3 }}>
                {values.map((mod, index) => (
                    <div key={index}>
                        <Typography>Module Name: {mod.moduleName}</Typography>
                        <Typography>Module Code: {mod.moduleCode}</Typography>
                        <Typography>URI: {mod.uri}</Typography>
                        <Typography>Icon: {mod.icon}</Typography>
                        <Typography>Color: {mod.color}</Typography>
                        <Typography>Active: {mod.actif ? "Yes" : "No"}</Typography>
                        <Typography>Module ID: {mod.idModule}</Typography>
                    </div>
                ))}
            </Box>
        </div>
    )
}

export default ModuleValues