import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

const Descriptions = ({ data }) => {
    const [module, setModule] = useState(false)
    const [role, setRole] = useState(false)
    const [actif, setActif] = useState(false)
    const [username, setUsername] = useState(false)
    const [email, setEmail] = useState(false)
    const [firstName, setFirstName] = useState(false)
    const [lastName, setLastName] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState(false)
    const [group, setGroup] = useState(false)
    const [userAuthorities, setUserAuthorities] = useState(false)
    const [uuid, setUuid] = useState(false)
    const [user, setUser] = useState(false)
    const [authority, setAuthority] = useState(false)
    const [granted, setGranted] = useState(false)

    const [moduleData, setModuleData] = useState(null)
    const [roleData, setRoleData] = useState(null)
    const [actifData, setActifData] = useState(null)
    const [usernameData, setUsernameData] = useState(null)
    const [emailData, setEmailData] = useState(null)
    const [firstNameData, setFirstNameData] = useState(null)
    const [lastNameData, setLastNameData] = useState(null)
    const [phoneNumberData, setPhoneNumberData] = useState(null)
    const [groupData, setGroupData] = useState(null)
    const [userAuthoritiesData, setUserAuthoritiesData] = useState(null)
    const [uuidData, setUuidData] = useState(null)
    const [authorityData, setAuthorityData] = useState(null)
    const [grantedData, setGrantedData] = useState(null)
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        data.forEach((item) => {
            switch (item.property) {
                case "Modules":
                    setModule(true);
                    setModuleData(item);
                    break;
                case "Roles":
                    setRole(true);
                    setRoleData(item);
                    break;
                case "actif":
                    setActif(true);
                    setActifData(item);
                    break;
                case "userName":
                    setUsername(true);
                    setUsernameData(item);
                    break;
                case "email":
                    setEmail(true);
                    setEmailData(item);
                    break;
                case "firstName":
                    setFirstName(true);
                    setFirstNameData(item);
                    break;
                case "lastName":
                    setLastName(true);
                    setLastNameData(item);
                    break;
                case "phoneNumber":
                    setPhoneNumber(true);
                    setPhoneNumberData(item);
                    break;
                case "group":
                    setGroup(true);
                    setGroupData(item);
                    break;
                case "userAuthorities":
                    setUserAuthorities(true);
                    setUserAuthoritiesData(item);
                    break;
                case "uuid":
                    setUuid(true);
                    setUuidData(item);
                    break;
                case "authority":
                    setAuthority(true);
                    setAuthorityData(item);
                    break;
                case "granted":
                    setGranted(true);
                    setGrantedData(item);
                    break;
                case "user":
                    setUser(true);
                    setUserData(item);
                    break;
                default:
                    break;
            }
        });
    }, [data]);

    return (
        <div>
            {module && moduleData && (
                <Box>
                    <Typography variant="h6">Modules:</Typography>
                    {moduleData.oldValue && moduleData.oldValue.map((mod, index) => (
                        <div key={index}>
                            <Typography variant='body1' paddingLeft={1}>Old Value:</Typography>
                            <Box sx={{ paddingLeft: 3 }}>
                                <Typography >Module Name: {mod.moduleName}</Typography>
                                <Typography>Module Code: {mod.moduleCode}</Typography>
                                <Typography>URI: {mod.uri}</Typography>
                                <Typography>Icon: {mod.icon}</Typography>
                                <Typography>Color: {mod.color}</Typography>
                                <Typography>Active: {mod.actif ? "Yes" : "No"}</Typography>
                                <Typography>Module ID: {mod.idModule}</Typography>
                            </Box>
                        </div>
                    ))}
                    {moduleData.newValue && moduleData.newValue.map((mod, index) => (
                        <div key={index}>
                            <Typography variant='body1' paddingLeft={1}>New Value:</Typography>
                            <Box sx={{ paddingLeft: 3 }}>
                                <Typography >Module Name: {mod.moduleName}</Typography>
                                <Typography>Module Code: {mod.moduleCode}</Typography>
                                <Typography>URI: {mod.uri}</Typography>
                                <Typography>Icon: {mod.icon}</Typography>
                                <Typography>Color: {mod.color}</Typography>
                                <Typography>Active: {mod.actif ? "Yes" : "No"}</Typography>
                                <Typography>Module ID: {mod.idModule}</Typography>
                            </Box>
                        </div>
                    ))}
                </Box>
            )
            }
            {
                role && roleData && (
                    <Box>
                        <Typography variant="h6">Roles:</Typography>
                        {roleData.oldValue && roleData.oldValue.map((roleItem, index) => (
                            <div key={index}>
                                <Typography variant='body1' paddingLeft={1}>Old Value:</Typography>
                                <Box sx={{ paddingLeft: 3 }}>
                                    <Typography>Role ID: {roleItem.idRole}</Typography>
                                    <Typography>Libelle: {roleItem.libelle}</Typography>
                                    <Typography>Active: {roleItem.actif ? "Yes" : "No"}</Typography>
                                    <Typography>Module:</Typography>
                                    <Box sx={{ paddingLeft: 2 }}>
                                        <Typography>Module ID: {roleItem.module.idModule}</Typography>
                                        <Typography>URI: {roleItem.module.uri}</Typography>
                                        <Typography>Icon: {roleItem.module.icon}</Typography>
                                        <Typography>Color: {roleItem.module.color}</Typography>
                                        <Typography>Module Name: {roleItem.module.moduleName}</Typography>
                                        <Typography>Module Code: {roleItem.module.moduleCode}</Typography>
                                        <Typography>Authority Set:</Typography>
                                    </Box>
                                </Box>

                                {roleItem.authoritySet.map((auth, authIndex) => (
                                    <div key={authIndex}>
                                        <Box sx={{ paddingLeft: 7 }}>
                                            <Typography>Authority ID: {auth.idAuthority}</Typography>
                                            <Typography>Libelle: {auth.libelle}</Typography>
                                            <Typography>Active: {auth.actif ? "Yes" : "No"}</Typography>
                                            <Typography>Authority Type: {auth.authorityType.libelle}</Typography>
                                            <Typography>Module:</Typography>
                                            <Box sx={{ paddingLeft: 3 }}>
                                                <Typography>Module ID: {auth.module.idModule}</Typography>
                                                <Typography>URI: {auth.module.uri}</Typography>
                                                <Typography>Icon: {auth.module.icon}</Typography>
                                                <Typography>Color: {auth.module.color}</Typography>
                                                <Typography>Module Name: {auth.module.moduleName}</Typography>
                                                <Typography>Module Code: {auth.module.moduleCode}</Typography>
                                            </Box>
                                        </Box>
                                    </div>
                                ))}
                            </div>
                        ))}
                        {roleData.newValue && roleData.newValue.map((roleItem, index) => (
                            <div key={index}>
                                <Typography variant='body1' paddingLeft={1}>New Value:</Typography>
                                <Box sx={{ paddingLeft: 3 }}>
                                    <Typography>Role ID: {roleItem.idRole}</Typography>
                                    <Typography>Libelle: {roleItem.libelle}</Typography>
                                    <Typography>Active: {roleItem.actif ? "Yes" : "No"}</Typography>
                                    <Typography>Module:</Typography>
                                    <Box sx={{ paddingLeft: 2 }}>
                                        <Typography>Module ID: {roleItem.module.idModule}</Typography>
                                        <Typography>URI: {roleItem.module.uri}</Typography>
                                        <Typography>Icon: {roleItem.module.icon}</Typography>
                                        <Typography>Color: {roleItem.module.color}</Typography>
                                        <Typography>Module Name: {roleItem.module.moduleName}</Typography>
                                        <Typography>Module Code: {roleItem.module.moduleCode}</Typography>
                                        <Typography>Authority Set:</Typography>
                                    </Box>
                                </Box>

                                {roleItem.authoritySet.map((auth, authIndex) => (
                                    <div key={authIndex}>
                                        <Box sx={{ paddingLeft: 7 }}>
                                            <Typography>Authority ID: {auth.idAuthority}</Typography>
                                            <Typography>Libelle: {auth.libelle}</Typography>
                                            <Typography>Active: {auth.actif ? "Yes" : "No"}</Typography>
                                            <Typography>Authority Type: {auth.authorityType.libelle}</Typography>
                                            <Typography>Module:</Typography>
                                            <Box sx={{ paddingLeft: 3 }}>
                                                <Typography>Module ID: {auth.module.idModule}</Typography>
                                                <Typography>URI: {auth.module.uri}</Typography>
                                                <Typography>Icon: {auth.module.icon}</Typography>
                                                <Typography>Color: {auth.module.color}</Typography>
                                                <Typography>Module Name: {auth.module.moduleName}</Typography>
                                                <Typography>Module Code: {auth.module.moduleCode}</Typography>
                                            </Box>
                                        </Box>
                                    </div>
                                ))
                                }
                            </div>
                        ))}
                    </Box>
                )
            }
            {
                actif && actifData && (
                    <Box>
                        <Typography variant="h6">Actif:</Typography>
                        {actifData.oldValue && (
                            <Typography variant='body1' paddingLeft={1}>Old Value: {actifData.oldValue ? "Yes" : "No"}</Typography>
                        )}
                        {actifData.newValue && (
                            <Typography variant='body1' sx={{ fontWeight: 600 }} paddingLeft={1}>New Value: {actifData.newValue ? "Yes" : "No"}</Typography>
                        )}
                    </Box>
                )
            }
            {
                username && usernameData && (
                    <Box>
                        <Typography variant="h6">Username:</Typography>
                        {usernameData.oldValue && (
                            <Typography variant='body1' paddingLeft={1}>Old Value: {usernameData.oldValue}</Typography>
                        )}
                        {usernameData.newValue && (
                            <Typography variant='body1' paddingLeft={1}>New Value: {usernameData.newValue}</Typography>
                        )}
                    </Box>
                )
            }
            {
                email && emailData && (
                    <Box>
                        <Typography variant="h6">Email:</Typography>
                        {emailData.oldValue && (
                            <Typography variant='body1' paddingLeft={1}>Old Value: {emailData.oldValue}</Typography>
                        )}
                        {emailData.newValue && (
                            <Typography variant='body1' paddingLeft={1}>New Value: {emailData.newValue}</Typography>
                        )}
                    </Box>
                )
            }
            {
                firstName && firstNameData && (
                    <Box>
                        <Typography variant="h6">First Name:</Typography>
                        {firstNameData.oldValue && (
                            <Typography variant='body1' paddingLeft={1}>Old Value: {firstNameData.oldValue}</Typography>
                        )}
                        {firstNameData.newValue && (
                            <Typography variant='body1' paddingLeft={1}>New Value: {firstNameData.newValue}</Typography>
                        )}
                    </Box>
                )
            }
            {
                lastName && lastNameData && (
                    <Box>
                        <Typography variant="h6">Last Name:</Typography>
                        {lastNameData.oldValue && (
                            <Typography variant='body1' paddingLeft={1}>Old Value: {lastNameData.oldValue}</Typography>
                        )}
                        {lastNameData.newValue && (
                            <Typography variant='body1' paddingLeft={1} >New Value: {lastNameData.newValue}</Typography>
                        )}
                    </Box>
                )
            }
            {
                phoneNumber && phoneNumberData && (
                    <Box>
                        <Typography variant="h6">Phone Number:</Typography>
                        {phoneNumberData.oldalue && (
                            <Typography variant='body1' paddingLeft={1}>Old Value: {phoneNumberData.oldValue}</Typography>
                        )}
                        {phoneNumberData.newValue && (
                            <Typography variant='body1' paddingLeft={1}>New Value: {phoneNumberData.newValue}</Typography>
                        )}
                    </Box>
                )
            }
            {
                group && groupData && (
                    <Box>
                        <Typography variant="h6">Group:</Typography>
                        {groupData.oldValue && (
                            <>
                                <Typography variant='body1' paddingLeft={1}>Old Value:</Typography>
                                <Box sx={{ paddingLeft: 3 }}>
                                    <Typography> Group ID: {groupData.oldValue.idGroup}</Typography>
                                    <Typography>Libelle: {groupData.oldValue.libelle}</Typography>
                                    <Typography>Active: {groupData.oldValue.actif ? "Yes" : "No"}</Typography>
                                </Box>
                            </>
                        )}
                        {groupData.newValue && (<>
                            <Typography variant='body1' paddingLeft={1}>New Value:</Typography>
                            <Box sx={{ paddingLeft: 3 }}>
                                <Typography> Group ID: {groupData.oldValue.idGroup}</Typography>
                                <Typography>Libelle: {groupData.oldValue.libelle}</Typography>
                                <Typography>Active: {groupData.oldValue.actif ? "Yes" : "No"}</Typography>
                            </Box>
                        </>
                        )}
                    </Box>
                )
            }
            {
                userAuthorities && userAuthoritiesData && (
                    <Box>
                        <Typography variant="h6">User Authorities:</Typography>
                        {userAuthoritiesData.oldValue && userAuthoritiesData.oldValue.map((auth, index) => (
                            <div key={index}>
                                <Typography variant='body1' paddingLeft={1}>Old Value:</Typography>
                                <Box sx={{ paddingLeft: 3 }}>
                                    <Typography>ID User Authority: {auth.idUserAuthority}</Typography>
                                    <Typography>Authority Libelle: {auth.authority.libelle}</Typography>
                                    <Typography>Authority Type: {auth.authority.authorityType.libelle}</Typography>
                                    <Typography>Module Name: {auth.authority.module.moduleName}</Typography>
                                </Box>
                            </div>
                        ))}
                        {userAuthoritiesData.newValue && userAuthoritiesData.newValue.map((auth, index) => (
                            <div key={index}>
                                <Typography variant='body1' paddingLeft={1}>New Value:</Typography>
                                <Box sx={{ paddingLeft: 3 }}>
                                    <Typography>ID User Authority: {auth.idUserAuthority}</Typography>
                                    <Typography>Authority Libelle: {auth.authority.libelle}</Typography>
                                    <Typography>Authority Type: {auth.authority.authorityType.libelle}</Typography>
                                    <Typography>Module Name: {auth.authority.module.moduleName}</Typography>
                                </Box>
                            </div>
                        ))}
                    </Box>
                )
            }
            {
                uuid && uuidData && (
                    <Box>
                        <Typography variant="h6">UUID:</Typography>
                        {uuidData.oldValue && (
                            <Typography variant='body1' paddingLeft={1}>Old Value: {uuidData.oldValue}</Typography>
                        )}
                        {uuidData.newValue && (
                            <Typography variant='body1' paddingLeft={1}>New Value: {uuidData.newValue}</Typography>
                        )}
                    </Box>
                )
            }
            {authority && authorityData && (
                <Box>
                    <Typography variant="h6">Authority:</Typography>
                    {authorityData.oldValue && (
                        <div>
                            <Typography variant='body1' paddingLeft={1}>Old Value:</Typography>
                            <Box sx={{ paddingLeft: 3 }}>
                                <Typography>Authority ID: {authorityData.oldValue.idAuthority}</Typography>
                                <Typography>Libelle: {authorityData.oldValue.libelle}</Typography>
                                <Typography>Active: {authorityData.oldValue.actif ? "Yes" : "No"}</Typography>
                                <Typography>Authority Type: {authorityData.oldValue.authorityType.libelle}</Typography>
                                <Typography>Module:</Typography>
                                <Box sx={{ paddingLeft: 2 }}>
                                    <Typography>Module ID: {authorityData.oldValue.module.idModule}</Typography>
                                    <Typography>URI: {authorityData.oldValue.module.uri}</Typography>
                                    <Typography>Icon: {authorityData.oldValue.module.icon}</Typography>
                                    <Typography>Color: {authorityData.oldValue.module.color}</Typography>
                                    <Typography>Module Name: {authorityData.oldValue.module.moduleName}</Typography>
                                    <Typography>Module Code: {authorityData.oldValue.module.moduleCode}</Typography>
                                </Box>
                            </Box>
                        </div>
                    )}
                    {authorityData.newValue && (
                        <div>
                            <Typography variant='body1' paddingLeft={1}>New Value:</Typography>
                            <Box sx={{ paddingLeft: 3 }}>
                                <Typography>Authority ID: {authorityData.newValue.idAuthority}</Typography>
                                <Typography>Libelle: {authorityData.newValue.libelle}</Typography>
                                <Typography>Active: {authorityData.newValue.actif ? "Yes" : "No"}</Typography>
                                <Typography>Authority Type: {authorityData.newValue.authorityType.libelle}</Typography>
                                <Typography>Module:</Typography>
                                <Box sx={{ paddingLeft: 2 }}>
                                    <Typography>Module ID: {authorityData.newValue.module.idModule}</Typography>
                                    <Typography>URI: {authorityData.newValue.module.uri}</Typography>
                                    <Typography>Icon: {authorityData.newValue.module.icon}</Typography>
                                    <Typography>Color: {authorityData.newValue.module.color}</Typography>
                                    <Typography>Module Name: {authorityData.newValue.module.moduleName}</Typography>
                                    <Typography>Module Code: {authorityData.newValue.module.moduleCode}</Typography>
                                </Box>
                            </Box>
                        </div>
                    )}
                </Box>
            )}
            {granted && grantedData && (
                <Box>
                    <Typography variant="h6">Granted:</Typography>
                    {grantedData.oldValue && (
                        <Typography variant='body1' paddingLeft={1}>Old Value: {grantedData.oldValue ? "Yes" : "No"}</Typography>
                    )}
                    {grantedData.newValue && (
                        <Typography>New Value: {grantedData.newValue ? "Yes" : "No"}</Typography>
                    )}
                </Box>
            )}
            {user && userData && (
                <Box>
                    <Typography variant="h6">User:</Typography>
                    {userData.oldValue && (
                        <div>
                            <Typography variant='body1' paddingLeft={1}>Old Value:</Typography>
                            <Box sx={{ paddingLeft: 3 }}>
                                <Typography>User ID: {userData.oldValue.idUser}</Typography>
                                <Typography>UUID: {userData.oldValue.uuid}</Typography>
                                <Typography>Username: {userData.oldValue.userName}</Typography>
                                <Typography>First Name: {userData.oldValue.firstName}</Typography>
                                <Typography>Last Name: {userData.oldValue.lastName}</Typography>
                                <Typography>Email: {userData.oldValue.email}</Typography>
                                <Typography>Phone Number: {userData.oldValue.phoneNumber}</Typography>
                                <Typography>Active: {userData.oldValue.actif ? "Yes" : "No"}</Typography>
                                <Typography>Group:</Typography>
                                <Box sx={{ paddingLeft: 2 }}>
                                    <Typography>Group ID: {userData.oldValue.group.idGroup}</Typography>
                                    <Typography>Libelle: {userData.oldValue.group.libelle}</Typography>
                                    <Typography>Active: {userData.oldValue.group.actif ? "Yes" : "No"}</Typography>
                                </Box>
                                <Typography>User Authorities:</Typography>
                                {userData.oldValue.userAuthorities.map((auth, authIndex) => (
                                    <Box key={authIndex} sx={{ paddingLeft: 5 }}>
                                        <Typography>Authority ID: {auth.authority.idAuthority}</Typography>
                                        <Typography>Libelle: {auth.authority.libelle}</Typography>
                                        <Typography>Active: {auth.authority.actif ? "Yes" : "No"}</Typography>
                                        <Typography>Authority Type: {auth.authority.authorityType.libelle}</Typography>
                                        <Typography>Module:</Typography>
                                        <Box sx={{ paddingLeft: 2 }}>
                                            <Typography>Module ID: {auth.authority.module.idModule}</Typography>
                                            <Typography>URI: {auth.authority.module.uri}</Typography>
                                            <Typography>Icon: {auth.authority.module.icon}</Typography>
                                            <Typography>Color: {auth.authority.module.color}</Typography>
                                            <Typography>Module Name: {auth.authority.module.moduleName}</Typography>
                                            <Typography>Module Code: {auth.authority.module.moduleCode}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                                <Typography>Modules:</Typography>
                                {userData.oldValue.modules.map((mod, modIndex) => (
                                    <Box key={modIndex} sx={{ paddingLeft: 5 }}>
                                        <Typography>Module ID: {mod.idModule}</Typography>
                                        <Typography>URI: {mod.uri}</Typography>
                                        <Typography>Icon: {mod.icon}</Typography>
                                        <Typography>Color: {mod.color}</Typography>
                                        <Typography>Module Name: {mod.moduleName}</Typography>
                                        <Typography>Module Code: {mod.moduleCode}</Typography>
                                    </Box>
                                ))}
                                <Typography>Roles:</Typography>
                                {userData.oldValue.roles.map((role, roleIndex) => (
                                    <Box key={roleIndex} sx={{ paddingLeft: 5 }}>
                                        <Typography>Role ID: {role.idRole}</Typography>
                                        <Typography>Libelle: {role.libelle}</Typography>
                                        <Typography>Active: {role.actif ? "Yes" : "No"}</Typography>
                                        <Typography>Module:</Typography>
                                        <Box sx={{ paddingLeft: 2 }}>
                                            <Typography>Module ID: {role.module.idModule}</Typography>
                                            <Typography>URI: {role.module.uri}</Typography>
                                            <Typography>Icon: {role.module.icon}</Typography>
                                            <Typography>Color: {role.module.color}</Typography>
                                            <Typography>Module Name: {role.module.moduleName}</Typography>
                                            <Typography>Module Code: {role.module.moduleCode}</Typography>
                                        </Box>
                                        <Typography>Authority Set:</Typography>
                                        {role.authoritySet.map((auth, authIndex) => (
                                            <Box key={authIndex} sx={{ paddingLeft: 5 }}>
                                                <Typography>Authority ID: {auth.idAuthority}</Typography>
                                                <Typography>Libelle: {auth.libelle}</Typography>
                                                <Typography>Active: {auth.actif ? "Yes" : "No"}</Typography>
                                                <Typography>Authority Type: {auth.authorityType.libelle}</Typography>
                                                <Typography>Module:</Typography>
                                                <Box sx={{ paddingLeft: 2 }}>
                                                    <Typography>Module ID: {auth.module.idModule}</Typography>
                                                    <Typography>URI: {auth.module.uri}</Typography>
                                                    <Typography>Icon: {auth.module.icon}</Typography>
                                                    <Typography>Color: {auth.module.color}</Typography>
                                                    <Typography>Module Name: {auth.module.moduleName}</Typography>
                                                    <Typography>Module Code: {auth.module.moduleCode}</Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                ))}
                            </Box>
                        </div>
                    )}
                    {userData.newValue && (
                        <div>
                            <Typography variant='body1' paddingLeft={1}>New Value:</Typography>
                            <Box sx={{ paddingLeft: 3 }}>
                                <Typography>User ID: {userData.newValue.idUser}</Typography>
                                <Typography>UUID: {userData.newValue.uuid}</Typography>
                                <Typography>Username: {userData.newValue.userName}</Typography>
                                <Typography>First Name: {userData.newValue.firstName}</Typography>
                                <Typography>Last Name: {userData.newValue.lastName}</Typography>
                                <Typography>Email: {userData.newValue.email}</Typography>
                                <Typography>Phone Number: {userData.newValue.phoneNumber}</Typography>
                                <Typography>Active: {userData.newValue.actif ? "Yes" : "No"}</Typography>
                                <Typography>Group:</Typography>
                                <Box sx={{ paddingLeft: 2 }}>
                                    <Typography>Group ID: {userData.newalue.group.idGroup}</Typography>
                                    <Typography>Libelle: {userData.newValue.group.libelle}</Typography>
                                    <Typography>Active: {userData.newValue.group.actif ? "Yes" : "No"}</Typography>
                                </Box>
                                <Typography>User Authorities:</Typography>
                                {userData.newValue.userAuthorities.map((auth, authIndex) => (
                                    <Box key={authIndex} sx={{ paddingLeft: 5 }}>
                                        <Typography>Authority ID: {auth.authority.idAuthority}</Typography>
                                        <Typography>Libelle: {auth.authority.libelle}</Typography>
                                        <Typography>Active: {auth.authority.actif ? "Yes" : "No"}</Typography>
                                        <Typography>Authority Type: {auth.authority.authorityType.libelle}</Typography>
                                        <Typography>Module:</Typography>
                                        <Box sx={{ paddingLeft: 2 }}>
                                            <Typography>Module ID: {auth.authority.module.idModule}</Typography>
                                            <Typography>URI: {auth.authority.module.uri}</Typography>
                                            <Typography>Icon: {auth.authority.module.icon}</Typography>
                                            <Typography>Color: {auth.authority.module.color}</Typography>
                                            <Typography>Module Name: {auth.authority.module.moduleName}</Typography>
                                            <Typography>Module Code: {auth.authority.module.moduleCode}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                                <Typography>Modules:</Typography>
                                {userData.newValue.modules.map((mod, modIndex) => (
                                    <Box key={modIndex} sx={{ paddingLeft: 5 }}>
                                        <Typography>Module ID: {mod.idModule}</Typography>
                                        <Typography>URI: {mod.uri}</Typography>
                                        <Typography>Icon: {mod.icon}</Typography>
                                        <Typography>Color: {mod.color}</Typography>
                                        <Typography>Module Name: {mod.moduleName}</Typography>
                                        <Typography>Module Code: {mod.moduleCode}</Typography>
                                    </Box>
                                ))}
                                <Typography>Roles:</Typography>
                                {userData.newValue.roles.map((role, roleIndex) => (
                                    <Box key={roleIndex} sx={{ paddingLeft: 5 }}>
                                        <Typography>Role ID: {role.idRole}</Typography>
                                        <Typography>Libelle: {role.libelle}</Typography>
                                        <Typography>Active: {role.actif ? "Yes" : "No"}</Typography>
                                        <Typography>Module:</Typography>
                                        <Box sx={{ paddingLeft: 2 }}>
                                            <Typography>Module ID: {role.module.idModule}</Typography>
                                            <Typography>URI: {role.module.uri}</Typography>
                                            <Typography>Icon: {role.module.icon}</Typography>
                                            <Typography>Color: {role.module.color}</Typography>
                                            <Typography>Module Name: {role.module.moduleName}</Typography>
                                            <Typography>Module Code: {role.module.moduleCode}</Typography>
                                        </Box>
                                        <Typography>Authority Set:</Typography>
                                        {role.authoritySet.map((auth, authIndex) => (
                                            <Box key={authIndex} sx={{ paddingLeft: 5 }}>
                                                <Typography>Authority ID: {auth.idAuthority}</Typography>
                                                <Typography>Libelle: {auth.libelle}</Typography>
                                                <Typography>Active: {auth.actif ? "Yes" : "No"}</Typography>
                                                <Typography>Authority Type: {auth.authorityType.libelle}</Typography>
                                                <Typography>Module:</Typography>
                                                <Box sx={{ paddingLeft: 2 }}>
                                                    <Typography>Module ID: {auth.module.idModule}</Typography>
                                                    <Typography>URI: {auth.module.uri}</Typography>
                                                    <Typography>Icon: {auth.module.icon}</Typography>
                                                    <Typography>Color: {auth.module.color}</Typography>
                                                    <Typography>Module Name: {auth.module.moduleName}</Typography>
                                                    <Typography>Module Code: {auth.module.moduleCode}</Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                ))}
                            </Box>
                        </div>

                    )}
                </Box>
            )}
        </div >
    )
}

export default Descriptions;

