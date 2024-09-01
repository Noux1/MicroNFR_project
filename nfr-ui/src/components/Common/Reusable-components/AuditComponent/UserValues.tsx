import { Box, Typography } from '@mui/material'
import React from 'react'
import GroupValues from './GroupValues'
import UserAuthoritiesValues from './UserAuthoritiesValues'
import ModuleValues from './ModuleValues'
import RoleValues from './RoleValues'

const UserValues = ({ title, values }) => {
    return (
        <div>
            <Typography variant='body1' paddingLeft={1}>{title} </Typography>
            <Box sx={{ paddingLeft: 3 }}>
                <Typography>User ID: {values.idUser}</Typography>
                <Typography>UUID: {values.uuid}</Typography>
                <Typography>Username: {values.userName}</Typography>
                <Typography>First Name: {values.firstName}</Typography>
                <Typography>Last Name: {values.lastName}</Typography>
                <Typography>Email: {values.email}</Typography>
                <Typography>Phone Number: {values.phoneNumber}</Typography>
                <Typography>Active: {values.actif ? "Yes" : "No"}</Typography>
                <GroupValues title={"Group"} values={values.group} />
                <UserAuthoritiesValues title={"User Authorities"} values={values.userAuthorities} />
                <ModuleValues title={"Modules"} values={values.modules} />
                <RoleValues title={"Roles"} roles={values.roles} />
            </Box>
        </div >
    )
}

export default UserValues
