import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ModuleValues from '../../components/Common/Reusable-components/AuditComponent/ModuleValues';
import RoleValues from '../../components/Common/Reusable-components/AuditComponent/RoleValues';
import PropertyValues from '../../components/Common/Reusable-components/AuditComponent/PropertyValues';
import GroupValues from '../../components/Common/Reusable-components/AuditComponent/GroupValues';
import UserAuthoritiesValues from '../../components/Common/Reusable-components/AuditComponent/UserAuthoritiesValues';
import AuthorityValues from '../../components/Common/Reusable-components/AuditComponent/AuthorityValues';
import UserValues from '../../components/Common/Reusable-components/AuditComponent/UserValues';

const Descriptions = ({ data }) => {
    const [description, setDescription] = useState({
        module: false,
        role: false,
        actif: false,
        username: false,
        email: false,
        firstName: false,
        lastName: false,
        phoneNumber: false,
        group: false,
        userAuthorities: false,
        uuid: false,
        authority: false,
        granted: false,
        user: false,
        moduleData: null,
        roleData: null,
        actifData: null,
        usernameData: null,
        emailData: null,
        firstNameData: null,
        lastNameData: null,
        phoneNumberData: null,
        groupData: null,
        userAuthoritiesData: null,
        uuidData: null,
        authorityData: null,
        grantedData: null,
        userData: null
    });

    const updateState = (property, value, data) => {
        setDescription(prevState => ({
            ...prevState,
            [`${property}`]: value,
            [`${property}Data`]: data
        }));
    };

    useEffect(() => {
        data.forEach((item) => {
            switch (item.property) {
                case "Modules":
                    updateState("module", true, item);
                    break;
                case "Roles":
                    updateState("role", true, item);
                    break;
                case "actif":
                    updateState("actif", true, item);
                    break;
                case "userName":
                    updateState("username", true, item);
                    break;
                case "email":
                    updateState("email", true, item);
                    break;
                case "firstName":
                    updateState("firstName", true, item);
                    break;
                case "lastName":
                    updateState("lastName", true, item);
                    break;
                case "phoneNumber":
                    updateState("phoneNumber", true, item);
                    break;
                case "group":
                    updateState("group", true, item);
                    break;
                case "userAuthorities":
                    updateState("userAuthorities", true, item);
                    break;
                case "uuid":
                    updateState("uuid", true, item);
                    break;
                case "authority":
                    updateState("authority", true, item);
                    break;
                case "granted":
                    updateState("granted", true, item);
                    break;
                case "user":
                    updateState("user", true, item);
                    break;
                default:
                    break;
            }
        });
    }, [data]);


    return (
        <div>
            {description.module && (description.moduleData.oldValue.length !== 0 || description.moduleData.newValue.length !== 0) && (
                <Box>
                    <Typography variant="h6">Modules:</Typography>
                    {description.moduleData.oldValue && (
                        <ModuleValues
                            title="Old Value:"
                            values={description.moduleData.oldValue}
                        />
                    )}
                    {description.moduleData.newValue && (
                        <ModuleValues
                            title="New Value:"
                            values={description.moduleData.newValue}
                        />
                    )}
                </Box>
            )
            }
            {
                description.role && (description.roleData.oldValue.length !== 0 || description.roleData.newValue.length !== 0) && (
                    <Box>
                        <Typography variant="h6">Roles:</Typography>
                        {description.roleData.oldValue && (
                            <RoleValues
                                title="Old Value: "
                                roles={description.roleData.oldValue}
                            />
                        )}
                        {description.roleData.newValue && (
                            <RoleValues
                                title="New Value: "
                                roles={description.roleData.newValue}
                            />
                        )}
                    </Box>

                )}
            {
                description.actif && description.actifData && (
                    <PropertyValues title="Actif" oldValue={description.actifData.oldValue} newValue={description.actifData.newValue} />
                )
            }
            {
                description.username && (description.usernameData) && (
                    <PropertyValues title="User Name" oldValue={description.usernameData.oldValue} newValue={description.usernameData.newValue} />
                )
            }
            {
                description.email && description.emailData && (
                    <PropertyValues title="Email" oldValue={description.emailData.oldValue} newValue={description.emailData.newValue} />
                )
            }
            {
                description.firstName && description.firstNameData && (
                    <PropertyValues title="First Name" oldValue={description.firstNameData.oldValue} newValue={description.firstNameData.newValue} />
                )
            }
            {
                description.lastName && description.lastNameData && (
                    <PropertyValues title="Last Name" oldValue={description.lastNameData.oldValue} newValue={description.lastNameData.newValue} />
                )
            }
            {
                description.phoneNumber && description.phoneNumberData && (
                    <PropertyValues title="Phone Number" oldValue={description.phoneNumberData.oldValue} newValue={description.phoneNumberData.newValue} />
                )
            }
            {
                description.group && description.groupData && (
                    <Box>
                        <Typography variant="h6">Group:</Typography>
                        {description.groupData.oldValue && (
                            <GroupValues title="Old Value: " values={description.groupData.oldValue} />
                        )}
                        {description.groupData.newValue && (
                            <GroupValues title="New Value: " values={description.groupData.newValue} />
                        )}
                    </Box>)
            }
            {
                description.userAuthorities && description.userAuthoritiesData.oldValue.length !== 0 && description.userAuthoritiesData.newValue.length !== 0 && (
                    <Box>
                        <Typography variant="h6">User Authorities:</Typography>
                        {description.userAuthoritiesData.oldValue && (
                            <UserAuthoritiesValues title="Old Value: " values={description.userAuthoritiesData.oldValue} />
                        )}
                        {description.userAuthoritiesData.newValue && (
                            <UserAuthoritiesValues title="New Value: " values={description.userAuthoritiesData.newValue} />
                        )}
                    </Box>
                )
            }
            {
                description.uuid && description.uuidData && (
                    <PropertyValues title="UUID" oldValue={description.uuidData.oldValue} newValue={description.uuidData.newValue} />
                )
            }
            {
                description.authority && description.authorityData && (
                    <Box>
                        <Typography variant="h6">Authority:</Typography>
                        {description.authorityData.oldValue && (
                            <AuthorityValues title="Old Value: " values={description.authorityData.oldValue} />
                        )}
                        {description.authorityData.newValue && (
                            <AuthorityValues title="New Value: " values={description.authorityData.newValue} />
                        )}
                    </Box>
                )
            }
            {
                description.granted && description.grantedData && (
                    <PropertyValues title="Granted" oldValue={description.grantedData.oldValue} newValue={description.grantedData.newValue} />
                )
            }
            {
                description.user && description.userData && (
                    <Box>
                        <Typography variant="h6">User:</Typography>
                        {description.userData.oldValue && (
                            <UserValues title={"Old Value:"} values={description.userData.oldValue} />
                        )}
                        {description.userData.newValue && (
                            <UserValues title={"New Value:"} values={description.userData.newValue} />
                        )}
                    </Box>
                )
            }
        </div >
    )
}

export default Descriptions;

