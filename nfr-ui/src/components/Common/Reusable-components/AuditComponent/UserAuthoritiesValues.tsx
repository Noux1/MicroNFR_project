import { Box, Typography } from '@mui/material'
import React from 'react'

const UserAuthoritiesValues = ({ title, values }) => {
    return (
        <div>
            <Typography variant='body1' paddingLeft={1}>{title}:</Typography>
            <Box sx={{ paddingLeft: 3 }}>
                {values.map((auth, index) => (
                    <div key={index}>
                        <Typography>ID User Authority: {auth.idUserAuthority}</Typography>
                        <Typography>Authority Libelle: {auth.authority.libelle}</Typography>
                        <Typography>Authority Type: {auth.authority.authorityType.libelle}</Typography>
                        <Typography>Module Name: {auth.authority.module.moduleName}</Typography>
                    </div>
                ))}
            </Box>
        </div>
    )
}

export default UserAuthoritiesValues