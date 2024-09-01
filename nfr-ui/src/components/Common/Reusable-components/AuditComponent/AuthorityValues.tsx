import { Box, Typography } from '@mui/material'
import React from 'react'

const AuthorityValues = ({ title, values }) => {
    return (
        <div>
            <Typography variant='body1' paddingLeft={1}>{title} </Typography>
            <Box sx={{ paddingLeft: 3 }}>
                <Typography>Authority ID: {values.idAuthority}</Typography>
                <Typography>Libelle: {values.libelle}</Typography>
                <Typography>Active: {values.actif ? "Yes" : "No"}</Typography>
                <Typography>Authority Type: {values.authorityType.libelle}</Typography>
                <Typography>Module:</Typography>
                <Box sx={{ paddingLeft: 2 }}>
                    <Typography>Module ID: {values.module.idModule}</Typography>
                    <Typography>URI: {values.module.uri}</Typography>
                    <Typography>Icon: {values.module.icon}</Typography>
                    <Typography>Color: {values.module.color}</Typography>
                    <Typography>Module Name: {values.module.moduleName}</Typography>
                    <Typography>Module Code: {values.module.moduleCode}</Typography>
                </Box>
            </Box>
        </div>)
}

export default AuthorityValues