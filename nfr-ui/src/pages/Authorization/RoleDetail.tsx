import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Button,
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
import { useAuthorityStore } from '../../store/AdminStore/AuthorityStore';
import { Role, useRoleStore } from '../../store/AdminStore/RoleStore';
import { useModuleStore } from '../../store/AdminStore/ModuleStore';
import SnackBar from '../../components/Common/Reusable-components/SnackBar';
import { useSnackbarStore } from '../../store/CommonStore/StyleStore';
import axiosInstance from '../../utils/AxiosInstance';
import BreadCrumbs from '../../components/Common/Reusable-components/BreadCrumbs';
import { useKeycloakStore } from '../../store/AuthStore/KeycloakStore';
import Unauthorized from '../Errors/Unauthorized';

const RoleDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [role, setRole] = useState<Role | null>(null);
    const { modules, getModules } = useModuleStore();
    const { getRoles, getAuthoritiesRole, updateRole, authoritiesRole } = useRoleStore();
    const { authorities, getAuthorities } = useAuthorityStore();
    const [assignedAuthorities, setAssignedAuthorities] = useState<any>([]);
    const [selectedAuthId, setSelectedAuthId] = useState<number | null>(null)
    const [formData, setFormData] = useState<Record<string, any>>({});
    const { isOpenSnackbar, openSnackbar, closeSnackbar } = useSnackbarStore()
    const [snackbarMsg, setSnackbarMsg] = useState<string>('')
    const navigate = useNavigate()
    const { authorities: userAuthorities } = useKeycloakStore()
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const roleData = await axiosInstance.get(`/role/${Number(id)}`)
                setRole(roleData.data);
                setAssignedAuthorities(roleData.data.authorityResponses || []);

                // Set initial form data
                setFormData({
                    'Role': roleData.data.libelle,
                    'Module Name': roleData.data.moduleResponse.moduleName,
                    'Status': roleData.data.actif ? 'Activated' : 'Deactivated',
                });
            } catch (error) {
                console.error("Failed to fetch roles", error);
            }
        };

        fetchUser();

    }, [id]);

    useEffect(() => {
        getAuthoritiesRole(Number(id))
        getModules()
        getAuthorities()
        getRoles()
    }, [getModules, getAuthorities, getRoles, getAuthoritiesRole]);

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


                // eslint-disable-next-line
                openSnackbar();
                setSnackbarSeverity('success')
                setSnackbarMsg(`Authority added successfully`);
                console.log(`Authority added successfully`);
            } catch (error) {
                console.error(`Error adding authority to role: `, error);
                // eslint-disable-next-line
                openSnackbar();
                setSnackbarSeverity('error')
                setSnackbarMsg('Failed to add authority');
            }
        }
    };

    const handleRemove = async (itemId: number) => {
        if (id !== null) {
            try {

                // Envoi de la requête DELETE à l'API
                await axiosInstance.post(`/role/${Number(id)}/authority-remove/${itemId}`);
                setAssignedAuthorities(prevAuthorities => prevAuthorities.filter(auth => auth.id !== itemId));
                // eslint-disable-next-line
                openSnackbar();
                setSnackbarSeverity('success')
                setSnackbarMsg(`Authority removed successfully`);
                console.log('Authority removed successfully');
            } catch (error) {
                console.error('Error removing authority:', error);
                // eslint-disable-next-line
                openSnackbar();
                setSnackbarSeverity('error')
                setSnackbarMsg(`Faied to remove authority`);
                console.log('Role added/updated successfully');
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
        if (checked) {
            // eslint-disable-next-line
            openSnackbar();
            setSnackbarSeverity('success')
            setSnackbarMsg(`User Enabled successfully`);
        } else {
            // eslint-disable-next-line
            openSnackbar();
            setSnackbarSeverity('error')
            setSnackbarMsg(`User Disabled successfully`);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!formData['Module Name']) {
            console.error('Module Name is not selected');
            return; // Sortir de la fonction si aucun module n'est sélectionné
        }

        // Récupérer le module sélectionné
        const selectedModuleName = formData['Module Name'];
        const selectedModule = modules.find(module => module.moduleName === selectedModuleName);
        console.log(selectedModuleName)
        console.log(selectedModule)
        // Vérifier si un module correspondant a été trouvé
        if (!selectedModule) {
            console.error('Selected module not found');
            return; // Sortir de la fonction si aucun module correspondant n'est trouvé
        }

        // Récupérer l'ID du module sélectionné
        const moduleId = selectedModule.id;

        // Si c'est une mise à jour de rôle, récupérer l'ID du module du backend
        let moduleIdRec: number | null = null;
        if (Number(id) !== null) {
            try {
                const response = await axiosInstance.get(`/module/${moduleId}`);
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

                // eslint-disable-next-line
                openSnackbar();
                setSnackbarSeverity('success')
                setSnackbarMsg(`Role updated successfully`);
                setTimeout(() => {
                    navigate('/admin/roles')
                }, 5000);
                console.log('Role updated successfully');
            } catch (error) {
                console.error('Error updating role:', error);
                // eslint-disable-next-line
                openSnackbar();
                setSnackbarSeverity('error')
                setSnackbarMsg(`Failed to update role`);
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


        console.log(selectedId)
        setSelectedAuthId(selectedId);


        setAssignedAuthorities([selectedValue]);
    };

    // const handleChangeMultiple = (event: React.ChangeEvent<HTMLSelectElement>, type: 'authority' | 'module' | 'role') => {
    //     const { options } = event.target;
    //     const value: string[] = [];
    //     let selectedIds: number | null = null;

    //     for (let i = 0, l = options.length; i < l; i += 1) {
    //         if (options[i].selected) {
    //             value.push(options[i].value);

    //             const selectedAuthority = authoritiesRole.find(auth => auth.libelle === options[i].value);
    //             if (selectedAuthority) {
    //                 selectedIds = selectedAuthority.id;
    //             }

    //         }
    //     }

    //     // Mettre à jour le state avec les IDs des éléments sélectionnés

    //     setSelectedAuthId(selectedIds);

    //     setAssignedAuthorities(value);
    // };

    console.log(assignedAuthorities)

    return (
        <>
            {userAuthorities.some(auth => auth.data === 'ROLE_VIEW' && auth.isGranted) ? (
                <>
                    <BreadCrumbs to='/admin/roles' text1='Roles' text2='Role' />
                    <Stack sx={{ py: 2, height: '80%', marginBottom: 4, boxSizing: 'border-box', fontFamily: 'Nunito, sans serif' }} direction="column">
                        <Paper sx={{ flex: 1, mx: 'auto', width: '80%', p: 2 }}>
                            <Stack direction="column" spacing={1} sx={{ height: 1 }}>
                                <Box component="form" onSubmit={handleSubmit}>
                                    <TextField
                                        size='small'
                                        // key={field}
                                        label='Role'
                                        name='Role'
                                        value={formData['Role'] || ''}
                                        onChange={handleChange}
                                        margin="normal"
                                        fullWidth
                                        sx={{ marginBottom: 1 }}
                                    />

                                    <Box display="flex" alignItems="center">
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel id="module-label">Module</InputLabel>
                                            <Select
                                                labelId="module-label"
                                                label="Module Name"
                                                name="Module Name"
                                                value={formData['Module Name'] || ''}
                                                onChange={handleChange}
                                            >
                                                {modules.map((module) => (
                                                    <MenuItem key={module.id} value={module.moduleName}>
                                                        {module.moduleName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>

                                    <Box display="flex" alignItems="center" justifyContent='space-between' gap={4}>
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel id="authority-label">Authority</InputLabel>
                                            <Select
                                                labelId="authority-label"
                                                label="Authority"
                                                name="authority"
                                                value={formData.authority || ''}
                                                onChange={handleChange}
                                            >
                                                {authorities.map((auth) => (
                                                    <MenuItem key={auth.id} value={auth.libelle}>
                                                        {auth.libelle}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {userAuthorities.some(auth => auth.data === 'ROLE_AUTHORITY_ADD' && auth.isGranted) && (<Button
                                            onClick={() => handleAdd(formData)}
                                            variant="contained"
                                            color="primary"
                                            startIcon={<Add />}
                                        >
                                            Add
                                        </Button>)}
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'row' }} >
                                        <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 300 }}>
                                            <InputLabel shrink htmlFor="select-AssignedAuthorities">
                                                Assigned Authorities
                                            </InputLabel>
                                            <Select
                                                native
                                                value={assignedAuthorities[0] || 'Assigned Authorities'}
                                                // @ts-ignore Typings are not considering `native`
                                                onChange={(event) => handleChangeMultiple(event, 'authority')}
                                                label="Assigned Authoriities"
                                                inputProps={{
                                                    id: 'select-AssignedAuthorities',
                                                }}
                                            >
                                                <option value="Assigned Authorities" >Assigned Authorities</option>

                                                {authoritiesRole.map((auth) => (
                                                    <option key={auth.id} value={auth.libelle}>
                                                        {auth.libelle}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Box>
                                            {selectedAuthId && (
                                                <Box >
                                                    <Typography variant="h6">{assignedAuthorities}</Typography>
                                                    {userAuthorities.some(auth => auth.data === 'ROLE_AUTHORITY_REMOVE' && auth.isGranted) && (
                                                        <Button onClick={() => handleRemove(selectedAuthId)}>Remove
                                                        </Button>
                                                    )}
                                                </Box>
                                            )
                                            }
                                        </Box>
                                    </Box>

                                    <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={formData['Status'] === 'Activated'}
                                                    onChange={handleSwitchChange}
                                                    name="Status"
                                                    color="primary"
                                                />
                                            }
                                            label="Status"
                                        />
                                    </Box>

                                    {userAuthorities.some(auth => auth.data === 'ROLE_UPDATE' && auth.isGranted) && (<Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                                        Save Changes
                                    </Button>)}
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
                </>) : (
                <Unauthorized />
            )
            }
        </>

    )
}

export default RoleDetail