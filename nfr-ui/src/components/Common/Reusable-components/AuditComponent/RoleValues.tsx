import { Box, Typography } from '@mui/material'
import React from 'react'
import ModulesRoleValues from './ModulesRoleValues'
import AuthoritiesRoleValues from './AuthoritiesRoleValues'

const RoleValues = ({ title, roles }) => {
    return (
        <div>
            <Typography variant='body1' paddingLeft={1}>{title}:</Typography>
            {roles.map((roleItem, index) => (
                <Box key={index} sx={{ paddingLeft: 3 }}>
                    <Typography>Role ID: {roleItem.idRole}</Typography>
                    <Typography>Libelle: {roleItem.libelle}</Typography>
                    <Typography>Active: {roleItem.actif ? "Yes" : "No"}</Typography>
                    <Typography>Module:</Typography>
                    <ModulesRoleValues module={roleItem.module} />
                    <Typography>Authority Set:</Typography>
                    <AuthoritiesRoleValues authoritySet={roleItem.authoritySet} />
                </Box>
            ))}
        </div>
    )
}

export default RoleValues