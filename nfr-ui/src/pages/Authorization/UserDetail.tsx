import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Button,
    Chip,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';

import { User, useUserStore } from '../../store/AdminStore/UserStore';
import { useGroupStore } from '../../store/AdminStore/GroupStore';
import { useAuthorityStore } from '../../store/AdminStore/AuthorityStore';
import { useRoleStore } from '../../store/AdminStore/RoleStore';
import { useModuleStore } from '../../store/AdminStore/ModuleStore';
import SnackBar from '../../components/Common/Reusable-components/SnackBar';
import { useSnackbarStore } from '../../store/CommonStore/StyleStore';
import axiosInstance from '../../utils/AxiosInstance';
import BreadCrumbs from '../../components/Common/Reusable-components/BreadCrumbs';
import { useKeycloakStore } from '../../store/AuthStore/KeycloakStore';
import Unauthorized from '../Errors/Unauthorized';


const UserDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const { getUser, updateUser, getAuthoritiesUser, authoritiesUser, modulesUser, rolesUser } = useUserStore();
    const { modules, getModules } = useModuleStore();
    const { roles, getRoles } = useRoleStore();
    const { authorities, getAuthorities } = useAuthorityStore();
    const { groups, getGroups } = useGroupStore();
    const [assignedAuthorities, setAssignedAuthorities] = useState<any>(authoritiesUser);
    const [assignedModules, setAssignedModules] = useState<any>(modulesUser);
    const [assignedRoles, setAssignedRoles] = useState<any>(rolesUser);
    const [selectedAuthId, setSelectedAuthId] = useState<number | null>(null)
    const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null)
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null)
    const [formData, setFormData] = useState<Record<string, any>>({});
    const { isOpenSnackbar, openSnackbar, closeSnackbar } = useSnackbarStore()
    const [snackbarMsg, setSnackbarMsg] = useState<string>('')
    const { authorities: userAuthorities } = useKeycloakStore()
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUser(Number(id));
                setUser(userData);
                setAssignedAuthorities(userData.authorityResponses || []);

                // Set initial form data
                setFormData({
                    'User Name': userData.userName,
                    'First Name': userData.firstName,
                    'Last Name': userData.lastName,
                    'Email': userData.email,
                    'Phone Number': userData.phoneNumber,
                    'Status': userData.actif ? 'Activated' : 'Deactivated',
                    'Group': userData.groupResponse.libelle
                });
            } catch (error) {
                console.error("Failed to fetch user", error);
            }
        };

        fetchUser();

    }, [id, getUser]);

    useEffect(() => {
        getAuthoritiesUser(Number(id))
        getModules()
        getAuthorities()
        getGroups()
        getRoles()
    }, [getModules, getAuthorities, getGroups, getRoles, getAuthoritiesUser]);


    const handleAdd = async (formData: Record<string, any>, type: 'module' | 'role' | 'authority' | 'group' | 'requiredActions') => {
        if (id !== null) {
            try {
                switch (type) {
                    case 'module':
                        const selectedModule = modules.find(module => module.moduleName === formData.module);
                        if (selectedModule) {
                            await axiosInstance.put(`/user/${Number(id)}/module/${selectedModule.id}`);
                            setAssignedModules(prevModules => [...prevModules, selectedModule.moduleName])
                            // eslint-disable-next-line
                            openSnackbar();
                            setSnackbarSeverity('success')
                            setSnackbarMsg(`${type} added successfully`);
                            console.log(`${type} added successfully`);
                        }
                        break;
                    case 'role':
                        const selectedRole = roles.find(role => role.libelle === formData.role);
                        if (selectedRole) {
                            await axiosInstance.put(`/user/${Number(id)}/role/${selectedRole.id}`);
                            setAssignedRoles(prevRoles => [...prevRoles, selectedRole.libelle])
                            // eslint-disable-next-line
                            openSnackbar();
                            setSnackbarSeverity('success')
                            setSnackbarMsg(`${type} added successfully`);
                            console.log(`${type} added successfully`);
                        }
                        break;
                    case 'authority':
                        const selectedAuthority = authorities.find(authority => authority.libelle === formData.authority);
                        if (selectedAuthority) {
                            await axiosInstance.put(`/user/${Number(id)}/authority/grant/${selectedAuthority.id}`);
                            setAssignedAuthorities(prevAuthorities => [...prevAuthorities, selectedAuthority.libelle]);
                            // eslint-disable-next-line
                            openSnackbar();
                            setSnackbarSeverity('success')
                            setSnackbarMsg(`${type} added successfully`);
                            console.log(`${type} added successfully`);
                            console.log(selectedAuthority.libelle)

                        }
                        break;
                    case 'requiredActions':
                        await axiosInstance.post(`/user/required-actions/${Number(id)}`, formData.requiredActions);
                        // eslint-disable-next-line
                        openSnackbar();
                        setSnackbarSeverity('success')
                        setSnackbarMsg(`${type} added successfully`);
                        console.log(`${type} added successfully`);
                        break;
                }

            } catch (error) {
                console.error(`Error adding ${type}: `, error);
                // eslint-disable-next-line
                openSnackbar();
                setSnackbarSeverity('error')
                setSnackbarMsg(`Failed to add ${type}`);
            }
        }
    };

    const handleRemove = async (itemId: number, itemType: 'authority' | 'role' | 'module') => {
        if (id !== null) {
            try {
                let url = '';
                switch (itemType) {
                    case 'authority':
                        url = `/user/${Number(id)}/authority/${itemId}`;
                        break;
                    case 'role':
                        url = `/user/${Number(id)}/role/${itemId}`;
                        break;
                    case 'module':
                        url = `/user/${Number(id)}/module/${itemId}`;
                        break;
                    default:
                        throw new Error('Invalid item type');
                }
                // Envoi de la requête DELETE à l'API
                await axiosInstance.delete(url);
                setAssignedAuthorities(prevAuthorities => prevAuthorities.filter(auth => auth.id !== itemId));
                // eslint-disable-next-line
                openSnackbar();
                setSnackbarSeverity('success')
                setSnackbarMsg(`${itemType} removed successfully`);

                console.log('Authority removed successfully');
            } catch (error) {
                console.error('Error removing authority:', error);
                // eslint-disable-next-line
                openSnackbar();
                setSnackbarSeverity('error')
                setSnackbarMsg(`Failed to remove ${itemType} `);
            }
        }
    };

    const handleToggleAuthority = async (authorityId: number, granted: boolean) => {
        if (id !== null) {
            try {
                if (granted) {
                    await axiosInstance.put(`/user/${Number(id)}/authority/grant/${authorityId}`);
                } else {
                    await axiosInstance.put(`/user/${Number(id)}/authority/revoke/${authorityId}`);
                }
                setAssignedAuthorities(prevAuthorities =>
                    prevAuthorities.map(auth =>
                        auth.id === authorityId ? { ...auth, granted } : auth
                    )
                );
                if (granted) {// eslint-disable-next-line
                    openSnackbar();
                    setSnackbarSeverity('success')
                    setSnackbarMsg(`Authority granted successfully`);
                } else {
                    // eslint-disable-next-line
                    openSnackbar();
                    setSnackbarSeverity('success')
                    setSnackbarMsg(`Authority revoked successfully`);
                }
                console.log('Authority toggled successfully');
            } catch (error) {
                console.error('Error toggling authority:', error);
                // eslint-disable-next-line
                openSnackbar();
                setSnackbarSeverity('error')
                setSnackbarMsg(`Failed to revoke or grant authorty`);
            }
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string, value: unknown }> | React.ChangeEvent<{ name?: string, value: unknown }> | SelectChangeEvent<any>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name as string]: value });
    };

    const handleSwitchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        const status = checked ? 'Activated' : 'Deactivated'; // Map switch value to 'Activated' or 'Deactivated'
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: status
        }));

        try {
            await axiosInstance.patch(`/user/enable-disableUser/${Number(id)}`, {
                actif: checked
            });
            openSnackbar();
            setSnackbarSeverity('success')
            setSnackbarMsg(`User ${checked ? 'Enabled' : 'Disabled'} successfully`);
        } catch (error) {
            console.error('Error updating user status:', error);
            openSnackbar();
            setSnackbarSeverity('error')
            setSnackbarMsg(`Failed to ${checked ? 'Enable' : 'Disable'}`);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!formData['Group']) {
            console.error('Group is not selected');
            return; // Sortir de la fonction si aucun module n'est sélectionné
        }

        // Récupérer le module sélectionné
        const groupSelected = formData['Group'];
        const selectedGroup = groups.find(group => group.libelle === groupSelected);
        console.log(selectedGroup)
        console.log(selectedGroup)
        // Vérifier si un module correspondant a été trouvé
        if (!selectedGroup) {
            console.error('Selected group not found');
            return; // Sortir de la fonction si aucun module correspondant n'est trouvé
        }

        // Récupérer l'ID du module sélectionné
        const groupId = selectedGroup.id;

        // Si c'est une mise à jour de rôle, récupérer l'ID du module du backend
        let groupIdRec: number | null = null;

        try {
            const responseGroup = await axiosInstance.get(`/group/${groupId}`);
            groupIdRec = responseGroup.data.id;
        } catch (error) {
            console.error('Error retrieving group ID from backend:', error);
            return; // Sortir de la fonction en cas d'erreur
        }

        if (Number(id) !== null && user !== null) {
            const userData = {
                id: Number(id),
                uuid: user.uuid,
                userName: formData['User Name'],
                firstName: formData['First Name'],
                lastName: formData['Last Name'],
                email: formData['Email'],
                phoneNumber: formData['Phone Number'],
                actif: formData['Status'] === 'Activated',
                groupId: groupIdRec !== null ? groupIdRec : groupId
            };

            try {
                await updateUser(Number(id), userData);
                // await axiosInstance.patch(`/user/enable-disableUser/${Number(id)}`, {
                //     actif: formData['Status'] === 'Activated'
                // });
                // eslint-disable-next-line
                openSnackbar();
                setSnackbarSeverity('success')
                setSnackbarMsg(`User updated successfully`);
                setTimeout(() => {
                    navigate('/admin/users');
                }, 5000);
                console.log('User updated successfully');
            } catch (error) {
                console.error('Error updating user:', error);
                // eslint-disable-next-line
                openSnackbar();
                setSnackbarSeverity('error')
                setSnackbarMsg(`Failed to update user`);
            }
        }
    };


    // const handleChangeMultiple = (event: SelectChangeEvent<string>, type: 'authority' | 'module' | 'role') => {
    //     const { value } = event.target;
    //     const selectedValue = value as string;
    //     let selectedId: number | null = null;

    //     if (type === 'authority') {
    //         const selectedAuthority = authoritiesUser.find(auth => auth.authorityResponse.libelle === selectedValue);
    //         if (selectedAuthority) {
    //             selectedId = selectedAuthority.authorityResponse.id;
    //         }
    //     } else if (type === 'module') {
    //         const selectedModule = modules.find(module => module.moduleName === selectedValue);
    //         if (selectedModule) {
    //             selectedId = selectedModule.id;
    //         }
    //     } else if (type === 'role') {
    //         const selectedRole = roles.find(role => role.libelle === selectedValue);
    //         if (selectedRole) {
    //             selectedId = selectedRole.id;
    //         }
    //     }

    //     // Mettre à jour le state avec l'ID de l'élément sélectionné
    //     if (type === 'authority') {
    //         setSelectedAuthId(selectedId);
    //     } else if (type === 'module') {
    //         setSelectedModuleId(selectedId);
    //     } else if (type === 'role') {
    //         setSelectedRoleId(selectedId);
    //     }

    //     setAssignedAuthorities([selectedValue]);
    //     setAssignedModules([selectedValue])
    //     setAssignedRoles([selectedValue])
    // };

    const handleChangeAuthority = (event: SelectChangeEvent<string>) => {
        const { value } = event.target;
        const selectedValue = value as string;
        let selectedId: number | null = null;
        const selectedAuthority = authoritiesUser.find(auth => auth.authorityResponse.libelle === selectedValue);
        if (selectedAuthority) {
            selectedId = selectedAuthority.authorityResponse.id;
        }
        setSelectedAuthId(selectedId);
        setAssignedAuthorities([selectedValue]);
    }
    const handleChangeModule = (event: SelectChangeEvent<string>) => {
        const { value } = event.target;
        const selectedValue = value as string;
        let selectedId: number | null = null;
        const selectedModule = modules.find(module => module.moduleName === selectedValue);
        if (selectedModule) {
            selectedId = selectedModule.id;
        }

        setSelectedModuleId(selectedId);
        setAssignedModules([selectedValue]);
    }
    const handleChangeRole = (event: SelectChangeEvent<string>) => {
        const { value } = event.target;
        const selectedValue = value as string;
        let selectedId: number | null = null;
        const selectedRole = roles.find(role => role.libelle === selectedValue);
        if (selectedRole) {
            selectedId = selectedRole.id;
        }
        setSelectedRoleId(selectedId);
        setAssignedRoles([selectedValue]);
    }
    console.log(modulesUser)
    console.log(rolesUser)
    console.log(assignedAuthorities)
    return (
        <>
            {userAuthorities.some(auth => auth.data === 'USER_GET_ID' && auth.isGranted) ?
                (<>
                    <BreadCrumbs to='/admin/users' text1='Users' text2='User' />
                    <Stack sx={{ py: 2, height: '80%', marginBottom: 4, boxSizing: 'border-box', fontFamily: 'Nunito, sans serif' }} direction="column">
                        <Paper sx={{ flex: 1, mx: 'auto', width: '80%', p: 2 }}>
                            <Stack direction="column" spacing={1} sx={{ height: 1 }}>
                                <Box component="form" onSubmit={handleSubmit}>
                                    {['User Name', 'First Name', 'Last Name', 'Email', 'Phone Number'].map((field) => (
                                        <TextField
                                            size='small'
                                            key={field}
                                            label={field}
                                            name={field}
                                            value={formData[field] || ''}
                                            onChange={handleChange}
                                            margin="normal"
                                            fullWidth
                                            sx={{ marginBottom: 1 }}
                                            disabled={field === 'User Name' || field === 'Phone Number'}
                                        />
                                    ))}

                                    <Box display="flex" alignItems="center">
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel id="group-label">Group</InputLabel>
                                            <Select
                                                labelId="group-label"
                                                label="Group"
                                                name="Group"
                                                value={formData['Group'] || ''}
                                                onChange={handleChange}
                                            >
                                                {groups.map((group) => (
                                                    <MenuItem key={group.id} value={group.libelle}>
                                                        {group.libelle}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>

                                    <Box display="flex" alignItems="center" justifyContent='space-between' gap={4}>
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel id="required-actions-label">Required Actions</InputLabel>
                                            <Select
                                                labelId="required-actions-label"
                                                label="Required Actions"
                                                multiple
                                                name="requiredActions"
                                                value={formData.requiredActions || []}
                                                onChange={handleChange}
                                                renderValue={(selected) => (
                                                    <Box display="flex" flexWrap="wrap">
                                                        {(selected as string[]).map((value) => (
                                                            <Chip key={value} label={value} />
                                                        ))}
                                                    </Box>
                                                )}
                                            >
                                                {['VERIFY_EMAIL', 'CONFIGURE_TOTP', 'UPDATE_PASSWORD', 'TERMS_AND_CONDITIONS'].map((action) => (
                                                    <MenuItem key={action} value={action}>
                                                        {action}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {userAuthorities.some(auth => auth.data === 'USER_REQUIRED_ACTIONS_ADD' && auth.isGranted) && (<Button
                                            onClick={() => handleAdd(formData, 'requiredActions')}
                                            variant="contained"
                                            color="primary"
                                            startIcon={<Add />}
                                        >
                                            Add
                                        </Button>
                                        )}
                                    </Box>

                                    <Box display="flex" alignItems="center" justifyContent='space-between' gap={4}>                                <FormControl fullWidth margin="normal">
                                        <InputLabel id="module-label">Module</InputLabel>
                                        <Select
                                            labelId="module-label"
                                            label="Module"
                                            name="module"
                                            value={formData.module || ''}
                                            onChange={handleChange}
                                        >
                                            {modules.map((module) => (
                                                <MenuItem key={module.id} value={module.moduleName}>
                                                    {module.moduleName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                        {userAuthorities.some(auth => auth.data === 'USER_MODULE_ADD' && auth.isGranted) && (<Button
                                            onClick={() => handleAdd(formData, 'module')}
                                            variant="contained"
                                            color="primary"
                                            startIcon={<Add />}
                                        >
                                            Add
                                        </Button>)}
                                    </Box>

                                    <Box display="flex" alignItems="center" justifyContent='space-between' gap={4}>                                <FormControl fullWidth margin="normal">
                                        <InputLabel id="role-label">Role</InputLabel>
                                        <Select
                                            labelId="role-label"
                                            label="Role"
                                            name="role"
                                            value={formData.role || ''}
                                            onChange={handleChange}
                                        >
                                            {roles.map((role) => (
                                                <MenuItem key={role.id} value={role.libelle}>
                                                    {role.libelle}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                        {userAuthorities.some(auth => auth.data === 'USER_MODULE_ADD' && auth.isGranted) && (<Button
                                            onClick={() => handleAdd(formData, 'role')}
                                            variant="contained"
                                            color="primary"
                                            startIcon={<Add />}
                                        >
                                            Add
                                        </Button>)}
                                    </Box>

                                    <Box display="flex" alignItems="center" justifyContent='space-between' gap={4}>                                <FormControl fullWidth margin="normal">
                                        <InputLabel id="authority-label">Authority</InputLabel>
                                        <Select
                                            labelId="authority-label"
                                            label="Authority"
                                            name="authority"
                                            value={formData.authority || ''}
                                            onChange={handleChange}
                                        >
                                            {authorities.map((authority) => (
                                                <MenuItem key={authority.id} value={authority.libelle}>
                                                    {authority.libelle}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                        {userAuthorities.some(auth => auth.data === 'USER_ROLE_ADD' && auth.isGranted) && (<Button
                                            onClick={() => handleAdd(formData, 'authority')}
                                            variant="contained"
                                            color="primary"
                                            startIcon={<Add />}
                                        >
                                            Add
                                        </Button>)}
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                        <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 300 }}>
                                            <InputLabel shrink htmlFor="select-AssignedModules">
                                                Assigned Modules
                                            </InputLabel>
                                            <Select
                                                native
                                                value={assignedModules[0] || 'Assigned Modules'}
                                                onChange={(event) => handleChangeModule(event)}
                                                label="Assigned Modules"
                                                inputProps={{
                                                    id: 'select-AssignedModules',
                                                }}
                                            >
                                                <option value="Assigned Modules" >Assigned Modules</option>
                                                {modulesUser.map((auth) => (
                                                    <option key={auth.id} value={auth.moduleName}>
                                                        {auth.moduleName}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Box>
                                            {selectedModuleId && (
                                                <Box>
                                                    <Typography variant="h6">{assignedModules[0]}</Typography>
                                                    {userAuthorities.some(auth => auth.data === 'USER_MODULE_REMOVE' && auth.isGranted) && (
                                                        <Button onClick={() => handleRemove(selectedModuleId, 'module')}>Remove</Button>
                                                    )}
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                        <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 400 }}>
                                            <InputLabel shrink htmlFor="select-AssignedRoles">
                                                Assigned Roles
                                            </InputLabel>
                                            <Select
                                                native
                                                value={assignedRoles[0] || 'Assigned Roles'}
                                                onChange={(event) => handleChangeRole(event)}
                                                label="Assigned Roles"
                                                inputProps={{
                                                    id: 'select-AssignedRoles',
                                                }}
                                            >
                                                <option value="Assigned Roles" >Assigned Roles</option>

                                                {rolesUser.map((role) => (
                                                    <option key={role.id} value={role.libelle}>
                                                        {role.libelle}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Box>
                                            {selectedRoleId && (
                                                <Box>
                                                    <Typography variant="h6">{assignedRoles[0]}</Typography>
                                                    {userAuthorities.some(auth => auth.data === 'USER_ROLE_REMOVE' && auth.isGranted) && (
                                                        <Button onClick={() => handleRemove(selectedRoleId, 'role')}>Remove</Button>
                                                    )}
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                        <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 400 }}>
                                            <InputLabel shrink htmlFor="select-AssignedAuthorities">
                                                Assigned Authorities
                                            </InputLabel>
                                            <Select
                                                native
                                                value={assignedAuthorities[0] || 'Assigned Authorities'}
                                                onChange={(event) => handleChangeAuthority(event)}
                                                label="Assigned Authorities"
                                                inputProps={{
                                                    id: 'select-AssignedAuthorities',
                                                }}
                                            >
                                                <option value="Assigned Authorities" >Assigned Authorities</option>
                                                {authoritiesUser.map((auth) => (
                                                    <option key={auth.authorityResponse.id} value={auth.authorityResponse.libelle}>
                                                        {auth.authorityResponse.libelle}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Box>
                                            {selectedAuthId && (
                                                <Box>
                                                    <Typography variant="h6">{assignedAuthorities[0]}</Typography>
                                                    {userAuthorities.some(auth => auth.data === 'USER_AUTHORITY_GRANT' && auth.isGranted) && (
                                                        <Button onClick={() => handleToggleAuthority(selectedAuthId, true)}>Grant</Button>
                                                    )}
                                                    {userAuthorities.some(auth => auth.data === 'USER_AUTHORITY_REVOKE' && auth.isGranted) && (
                                                        <Button onClick={() => handleToggleAuthority(selectedAuthId, false)}>Revoke</Button>
                                                    )}
                                                    {userAuthorities.some(auth => auth.data === 'USER_AUTHORITY_REMOVE' && auth.isGranted) && (
                                                        <Button onClick={() => handleRemove(selectedAuthId, 'authority')}>Remove</Button>
                                                    )}
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>

                                    <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={formData['Status'] === 'Activated'}
                                                    onChange={userAuthorities.some(auth => auth.data === 'USER_ENABLE_DISABLE' && auth.isGranted) && handleSwitchChange}
                                                    name="Status"
                                                    color="primary"
                                                />
                                            }
                                            label="Status"
                                        />
                                    </Box>

                                    {userAuthorities.some(auth => auth.data === 'USER_UPDATE' && auth.isGranted) && (<Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                                        Save Changes
                                    </Button>)}
                                </Box>
                            </Stack >
                        </Paper >
                    </Stack >
                    <SnackBar
                        open={isOpenSnackbar}
                        severity={snackbarSeverity}
                        onClose={closeSnackbar}
                        text={snackbarMsg}
                    />
                </>) : (
                    <Unauthorized />
                )
            }
        </>
    );
};

export default UserDetail;
