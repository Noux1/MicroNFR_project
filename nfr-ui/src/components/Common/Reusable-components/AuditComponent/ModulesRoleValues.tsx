import { Box, Typography } from '@mui/material'
import React from 'react'

const ModulesRoleValues = ({ module }) => {
    return (
        <Box sx={{ paddingLeft: 2 }}>
            <Typography>Module ID: {module.idModule}</Typography>
            <Typography>URI: {module.uri}</Typography>
            <Typography>Icon: {module.icon}</Typography>
            <Typography>Color: {module.color}</Typography>
            <Typography>Module Name: {module.moduleName}</Typography>
            <Typography>Module Code: {module.moduleCode}</Typography>
            <Typography>Authority Set: </Typography>
        </Box>
    )
}

export default ModulesRoleValues