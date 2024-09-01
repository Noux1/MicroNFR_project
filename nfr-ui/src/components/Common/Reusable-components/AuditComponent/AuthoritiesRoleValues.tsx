import { Box, Typography } from '@mui/material'
import React from 'react'
import ModulesRoleValues from './ModulesRoleValues'

const AuthoritiesRoleValues = ({ authoritySet }) => {
    return (
        authoritySet.map((auth, index) => (
            <Box key={index} sx={{ paddingLeft: 7 }}>
                <Typography>Authority ID: {auth.idAuthority}</Typography>
                <Typography>Libelle: {auth.libelle}</Typography>
                <Typography>Active: {auth.actif ? "Yes" : "No"}</Typography>
                <Typography>Authority Type: {auth.authorityType.libelle}</Typography>
                <Typography>Module:</Typography>
                <ModulesRoleValues module={auth.module} />
            </Box>
        ))
    )
}

export default AuthoritiesRoleValues