import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Button, Chip, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Stack
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
import TextFieldForm from '../../components/Common/Reusable-components/AdminComponent/TextFieldForm';
import SelectFieldFrom from '../../components/Common/Reusable-components/AdminComponent/SelectFieldFrom';
import AssignedItems from '../../components/Common/Reusable-components/AdminComponent/AssignedItems';
import SwitchForm from '../../components/Common/Reusable-components/AdminComponent/SwitchForm';
import ButtonSaveChanges from '../../components/Common/Reusable-components/AdminComponent/ButtonSaveChanges';

const UserDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { getUser, updateUser, getAuthoritiesUser, authoritiesUser, modulesUser, rolesUser } = useUserStore();
    const { modules, getModules } = useModuleStore();
    const { roles, getRoles } = useRoleStore();
    const { authorities, getAuthorities } = useAuthorityStore();
    const { groups, getGroups } = useGroupStore();
    const { authorities: userAuthorities } = useKeycloakStore();
    const { isOpenSnackbar, openSnackbar, closeSnackbar } = useSnackbarStore()
    const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [assignedAuthorities, setAssignedAuthorities] = useState<any>(authoritiesUser);
    const [assignedModules, setAssignedModules] = useState<any>(modulesUser);
    const [assignedRoles, setAssignedRoles] = useState<any>(rolesUser);
    const [selectedAuthId, setSelectedAuthId] = useState<number | null>(null)
    const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null)
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null)
    const [snackbarMsg, setSnackbarMsg] = useState<string>('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUser(Number(id));
                setUser(userData);
                setAssignedAuthorities(userData.authorityResponses || []);
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
    }, [getModules, getAuthorities, getGroups, getRoles, getAuthoritiesUser, id]);

    const handleAdd = async (formData: Record<string, any>, type: 'module' | 'role' | 'authority' | 'group' | 'requiredActions') => {
        if (id !== null) {
            try {
                switch (type) {
                    case 'module':
                        const selectedModule = modules.find(module => module.moduleName === formData.module);
                        if (selectedModule) {
                            await axiosInstance.put(`/user/${Number(id)}/module/${selectedModule.id}`);
                            setAssignedModules(prevModules => [...prevModules, selectedModule.moduleName])
                            setSnackbarSeverity('success')
                            setSnackbarMsg(`${type} added successfully`);
                            openSnackbar();
                            console.log(`${type} added successfully`);
                        }
                        break;
                    case 'role':
                        const selectedRole = roles.find(role => role.libelle === formData.role);
                        if (selectedRole) {
                            await axiosInstance.put(`/user/${Number(id)}/role/${selectedRole.id}`);
                            setAssignedRoles(prevRoles => [...prevRoles, selectedRole.libelle])
                            setSnackbarSeverity('success')
                            setSnackbarMsg(`${type} added successfully`);
                            openSnackbar();
                            console.log(`${type} added successfully`);
                        }
                        break;
                    case 'authority':
                        const selectedAuthority = authorities.find(authority => authority.libelle === formData.authority);
                        if (selectedAuthority) {
                            await axiosInstance.put(`/user/${Number(id)}/authority/grant/${selectedAuthority.id}`);
                            setAssignedAuthorities(prevAuthorities => [...prevAuthorities, selectedAuthority.libelle]);
                            setSnackbarSeverity('success')
                            setSnackbarMsg(`${type} added successfully`);
                            openSnackbar();
                            console.log(`${type} added successfully`);
                        }
                        break;
                    case 'requiredActions':
                        await axiosInstance.post(`/user/required-actions/${Number(id)}`, formData.requiredActions);
                        setSnackbarSeverity('success')
                        setSnackbarMsg(`${type} added successfully`);
                        openSnackbar();
                        console.log(`${type} added successfully`);
                        break;
                }
            } catch (error) {
                console.error(`Error adding ${type}: `, error);
                setSnackbarSeverity('error')
                setSnackbarMsg(`Failed to add ${type}`);
                openSnackbar();
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
                await axiosInstance.delete(url);
                setAssignedAuthorities(prevAuthorities => prevAuthorities.filter(auth => auth.id !== itemId));
                setSnackbarSeverity('success')
                setSnackbarMsg(`${itemType} removed successfully`);
                openSnackbar();
            } catch (error) {
                console.error('Error removing authority:', error);
                setSnackbarSeverity('error')
                setSnackbarMsg(`Failed to remove ${itemType} `);
                openSnackbar();
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
                if (granted) {
                    setSnackbarSeverity('success')
                    setSnackbarMsg(`Authority granted successfully`);
                    openSnackbar();
                } else {
                    setSnackbarSeverity('success')
                    setSnackbarMsg(`Authority revoked successfully`);
                    openSnackbar();
                }
            } catch (error) {
                console.error('Error toggling authority:', error);
                setSnackbarSeverity('error')
                setSnackbarMsg(`Failed to revoke or grant authorty`);
                openSnackbar();
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
            setSnackbarSeverity('success')
            setSnackbarMsg(`User ${checked ? 'Enabled' : 'Disabled'} successfully`);
            openSnackbar();
        } catch (error) {
            console.error('Error updating user status:', error);
            setSnackbarSeverity('error')
            setSnackbarMsg(`Failed to ${checked ? 'Enable' : 'Disable'} User`);
            openSnackbar();
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const selectedGroup = groups.find(group => group.libelle === formData['Group']);
        if (!selectedGroup) {
            console.error('Selected group not found');
            return;
        }

        let groupIdRec: number | null = null;// Si c'est une mise à jour de groupe, récupérer l'ID du groupe du backend

        try {
            const responseGroup = await axiosInstance.get(`/group/${selectedGroup.id}`);
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
                groupId: groupIdRec !== null ? groupIdRec : selectedGroup.id
            };
            try {
                await updateUser(Number(id), userData);
                setSnackbarSeverity('success')
                setSnackbarMsg(`User updated successfully`);
                openSnackbar();
                setTimeout(() => {
                    navigate('/admin/users');
                }, 4000);
                console.log('User updated successfully');
            } catch (error) {
                console.error('Error updating user:', error);
                setSnackbarSeverity('error')
                setSnackbarMsg(`Failed to update user`);
                openSnackbar();
            }
        }
    };

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

    if (!userAuthorities.some(auth => auth.data === 'USER_GET_ID' && auth.isGranted)) {
        return <Unauthorized />;
    }

    return (
        <>
            <BreadCrumbs to='/admin/users' text1='Users' text2='User' />
            <Stack sx={{ py: 2, height: '80%', marginBottom: 4, boxSizing: 'border-box' }} direction="column">
                <Paper sx={{ flex: 1, mx: 'auto', width: '80%', p: 2 }}>
                    <Stack direction="column" spacing={1} sx={{ height: 1 }}>
                        <Box component="form" onSubmit={handleSubmit}>
                            {['User Name', 'First Name', 'Last Name', 'Email', 'Phone Number'].map((field) => (
                                <TextFieldForm
                                    key={field}
                                    label={field}
                                    name={field}
                                    value={formData[field] || ''}
                                    onChange={handleChange}
                                    disabled={field === 'User Name' || field === 'Phone Number'}
                                />
                            ))}
                            <SelectFieldFrom
                                label='Group'
                                name='Group'
                                value={formData['Group'] || ''}
                                onChange={handleChange}
                                options={groups.map(group => ({ id: group.id, value: group.libelle }))}
                            />
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
                            <SelectFieldFrom
                                label='Module'
                                name='module'
                                value={formData.module || ''}
                                onChange={handleChange}
                                options={modules.map(module => ({ id: module.id, value: module.moduleName }))}
                                showAddButton
                                handleAdd={() => handleAdd(formData, 'module')}
                                userAuthorities={userAuthorities}
                                addAuthority='USER_MODULE_ADD'
                            />
                            <SelectFieldFrom
                                label='Role'
                                name='role'
                                value={formData.role || ''}
                                onChange={handleChange}
                                options={roles.map(role => ({ id: role.id, value: role.libelle }))}
                                showAddButton
                                handleAdd={() => handleAdd(formData, 'role')}
                                userAuthorities={userAuthorities}
                                addAuthority='USER_ROLE_ADD'
                            />
                            <SelectFieldFrom
                                label='Authority'
                                name='authority'
                                value={formData.authority || ''}
                                onChange={handleChange}
                                options={authorities.map(authority => ({ id: authority.id, value: authority.libelle }))}
                                showAddButton
                                handleAdd={() => handleAdd(formData, 'authority')}
                                userAuthorities={userAuthorities}
                                addAuthority='USER_AUTHORITY_GRANT'
                            />
                            <AssignedItems
                                label='Modules'
                                selectedItemId={selectedModuleId}
                                removePermission='USER_MODULE_REMOVE'
                                assignedItems={assignedModules}
                                itemsList={modulesUser.map(module => ({ id: module.id, libelle: module.moduleName }))}
                                userAuthorities={userAuthorities}
                                handleChange={handleChangeModule}
                                handleRemove={() => handleRemove(selectedModuleId, 'module')}
                            />
                            <AssignedItems
                                label='Roles'
                                selectedItemId={selectedRoleId}
                                removePermission='USER_ROLE_REMOVE'
                                assignedItems={assignedRoles}
                                itemsList={rolesUser.map(role => ({ id: role.id, libelle: role.libelle }))}
                                userAuthorities={userAuthorities}
                                handleChange={handleChangeRole}
                                handleRemove={() => handleRemove(selectedRoleId, 'role')}
                            />
                            <AssignedItems
                                label='Authorities'
                                selectedItemId={selectedAuthId}
                                removePermission='USER_AUTHORITY_REMOVE'
                                assignedItems={assignedAuthorities}
                                itemsList={authoritiesUser.map(auth => ({ id: auth.authorityResponse.id, libelle: auth.authorityResponse.libelle }))}
                                userAuthorities={userAuthorities}
                                handleChange={handleChangeAuthority}
                                handleRemove={() => handleRemove(selectedAuthId, 'authority')}
                                handleToggle={handleToggleAuthority}
                                togglePermissions={{ grant: 'USER_AUTHORITY_GRANT', revoke: 'USER_AUTHORITY_REVOKE' }}
                            />
                            <SwitchForm
                                checked={formData['Status'] === 'Activated'}
                                onChange={userAuthorities.some(auth => auth.data === 'USER_ENABLE_DISABLE' && auth.isGranted) && handleSwitchChange}
                                label='Status'
                            />
                            <ButtonSaveChanges
                                userAuthorities={userAuthorities}
                                updateAuthority='USER_UPDATE'
                            />
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
        </>
    );
};

export default UserDetail;
