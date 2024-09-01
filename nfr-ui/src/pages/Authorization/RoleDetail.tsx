import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Paper, SelectChangeEvent, Stack
} from '@mui/material';
import { useAuthorityStore } from '../../store/AdminStore/AuthorityStore';
import { Role, useRoleStore } from '../../store/AdminStore/RoleStore';
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

const RoleDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { getRoles, getAuthoritiesRole, updateRole, authoritiesRole } = useRoleStore();
    const { modules, getModules } = useModuleStore();
    const { authorities, getAuthorities } = useAuthorityStore();
    const { authorities: userAuthorities } = useKeycloakStore()
    const { isOpenSnackbar, openSnackbar, closeSnackbar } = useSnackbarStore()
    const [role, setRole] = useState<Role | null>(null);
    const [assignedAuthorities, setAssignedAuthorities] = useState<any>([]);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [selectedAuthId, setSelectedAuthId] = useState<number | null>(null)
    const [snackbarMsg, setSnackbarMsg] = useState<string>('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');
    const navigate = useNavigate()

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const roleData = await axiosInstance.get(`/role/${Number(id)}`)
                setRole(roleData.data);
                setAssignedAuthorities(roleData.data.authorityResponses || []);
                setFormData({
                    'Role': roleData.data.libelle,
                    'Module Name': roleData.data.moduleResponse.moduleName,
                    'Status': roleData.data.actif ? 'Activated' : 'Deactivated',
                });
            } catch (error) {
                console.error("Failed to fetch roles", error);
            }
        };
        fetchRole();
    }, [id]);

    useEffect(() => {
        getAuthoritiesRole(Number(id))
        getModules()
        getAuthorities()
        getRoles()
    }, [getModules, getAuthorities, getRoles, getAuthoritiesRole, id]);

    const handleAdd = async (formData: Record<string, any>) => {
        if (id !== null) {
            try {
                const selectedAuthority = authorities.find(authority => authority.libelle === formData.authority);
                if (selectedAuthority) {
                    await axiosInstance.post(`/role/${Number(id)}/authority-add/${selectedAuthority.id}`);
                    setAssignedAuthorities(prevAuthorities => [...prevAuthorities, selectedAuthority.libelle]);
                    console.log(selectedAuthority.libelle)
                }
                setFormData(prevFormData => ({ ...prevFormData, authority: '' }));
                setSnackbarSeverity('success')
                setSnackbarMsg(`Authority added to role successfully`);
                openSnackbar();
                console.log(`Authority added to role successfully`);
            } catch (error) {
                console.error(`Error adding authority to role: `, error);
                setSnackbarSeverity('error')
                setSnackbarMsg('Failed to add authority to role');
                openSnackbar();
            }
        }
    };

    const handleRemove = async (itemId: number) => {
        if (id !== null) {
            try {
                await axiosInstance.post(`/role/${Number(id)}/authority-remove/${itemId}`);
                setAssignedAuthorities(prevAuthorities => prevAuthorities.filter(auth => auth.id !== itemId));
                setSnackbarSeverity('success')
                setSnackbarMsg(`Authority removed from role successfully`);
                openSnackbar();
            } catch (error) {
                console.error('Error removing authority:', error);
                setSnackbarSeverity('error')
                setSnackbarMsg(`Failed to remove authority from role`);
                openSnackbar();
            }
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string, value: unknown }> | React.ChangeEvent<{ name?: string, value: unknown }> | SelectChangeEvent<any>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name as string]: value });
    };

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        const status = checked ? 'Activated' : 'Deactivated'; // Map switch value to 'Activated' or 'Deactivated'
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: status
        }));
        try {
            if (checked) {
                setSnackbarSeverity('success')
                setSnackbarMsg(`Role Enabled successfully`);
                openSnackbar();
            } else {
                setSnackbarSeverity('error')
                setSnackbarMsg(`Role Disabled successfully`);
                openSnackbar();
            }
        } catch (error) {
            setSnackbarSeverity('success')
            setSnackbarMsg(`Failed to enable or disable Role`);
            openSnackbar();
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const selectedModule = modules.find(module => module.moduleName === formData['Module Name']);
        if (!selectedModule) {
            console.error('Selected module not found');
            return; // Sortir de la fonction si aucun module correspondant n'est trouvé
        }

        let moduleIdRec: number | null = null; // Si c'est une mise à jour de rôle, récupérer l'ID du module du backend

        if (Number(id) !== null) {
            try {
                const response = await axiosInstance.get(`/module/${selectedModule.id}`);
                moduleIdRec = response.data.id;
            } catch (error) {
                console.error('Error retrieving module ID from backend:', error);
                return; // Sortir de la fonction en cas d'erreur
            }
        }
        if (Number(id) !== null && role !== null) {
            const roleData = {
                id: Number(id),
                libelle: formData['Role'],
                moduleId: moduleIdRec,
                actif: formData['Status'] === 'Activated',
            };

            try {
                await updateRole(Number(id), roleData);
                setSnackbarSeverity('success')
                setSnackbarMsg(`Role updated successfully`);
                openSnackbar();
                setTimeout(() => {
                    navigate('/admin/roles')
                }, 4000);
                console.log('Role updated successfully');
            } catch (error) {
                console.error('Error updating role:', error);
                setSnackbarSeverity('error')
                setSnackbarMsg(`Failed to update role`);
                openSnackbar();
                console.log('Role added/updated successfully');
            }
        }
    };

    const handleChangeMultiple = (event: React.ChangeEvent<{ name?: string; value: unknown }>, type: 'authority' | 'module' | 'role') => {
        const { value } = event.target;
        const selectedValue = value as string;
        let selectedId: number | null = null;
        const selectedAuthority = authoritiesRole.find(auth => auth.libelle === selectedValue);
        if (selectedAuthority) {
            selectedId = selectedAuthority.id;
        }
        setSelectedAuthId(selectedId);
        setAssignedAuthorities([selectedValue]);
    };

    if (!userAuthorities.some(auth => auth.data === 'ROLE_VIEW' && auth.isGranted)) {
        return <Unauthorized />;
    }

    return (
        <>
            <BreadCrumbs to='/admin/roles' text1='Roles' text2='Role' />
            <Stack sx={{ py: 2, height: '80%', marginBottom: 4, boxSizing: 'border-box' }} direction="column">
                <Paper sx={{ flex: 1, mx: 'auto', width: '80%', p: 2 }}>
                    <Stack direction="column" spacing={1} sx={{ height: 1 }}>
                        <Box component="form" onSubmit={handleSubmit}>
                            <TextFieldForm
                                label='Role'
                                name='Role'
                                value={formData['Role'] || ''}
                                onChange={handleChange}
                            />
                            <SelectFieldFrom
                                label='Module Name'
                                name='Module Name'
                                value={formData['Module Name'] || ''}
                                onChange={handleChange}
                                options={modules.map(module => ({ id: module.id, value: module.moduleName }))}
                            />
                            <SelectFieldFrom
                                label='Authority'
                                name='authority'
                                value={formData.authority || ''}
                                onChange={handleChange}
                                options={authorities.map(authority => ({ id: authority.id, value: authority.libelle }))}
                                showAddButton
                                handleAdd={() => handleAdd(formData)}
                                userAuthorities={userAuthorities}
                                addAuthority='ROLE_AUTHORITY_ADD'
                            />
                            <AssignedItems
                                label='Authorities'
                                selectedItemId={selectedAuthId}
                                removePermission='ROLE_AUTHORITY_REMOVE'
                                assignedItems={assignedAuthorities}
                                itemsList={authoritiesRole.map(auth => ({ id: auth.id, libelle: auth.libelle }))}
                                userAuthorities={userAuthorities}
                                handleChange={handleChangeMultiple}
                                handleRemove={() => handleRemove(selectedAuthId)}
                            />
                            <SwitchForm
                                checked={formData['Status'] === 'Activated'}
                                onChange={handleSwitchChange}
                                label='Status'
                            />
                            <ButtonSaveChanges
                                userAuthorities={userAuthorities}
                                updateAuthority='ROLE_UPDATE'
                            />
                        </Box>
                    </Stack>
                </Paper >
            </Stack >
            <SnackBar
                open={isOpenSnackbar}
                severity={snackbarSeverity}
                onClose={closeSnackbar}
                text={snackbarMsg}
            />
        </>

    )
}

export default RoleDetail