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

} from '@mui/material';
import { Authority, useAuthorityStore } from '../../store/AdminStore/AuthorityStore';
import { useModuleStore } from '../../store/AdminStore/ModuleStore';
import SnackBar from '../../components/Common/Reusable-components/SnackBar';
import { useSnackbarStore } from '../../store/CommonStore/StyleStore';
import axiosInstance from '../../utils/AxiosInstance';
import { useAuthorityTypeStore } from '../../store/AdminStore/AuthorityTypeStore';
import BreadCrumbs from '../../components/Common/Reusable-components/BreadCrumbs';
import { useKeycloakStore } from '../../store/AuthStore/KeycloakStore';
import Unauthorized from '../Errors/Unauthorized';

const AuthorityDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [authority, setAuthority] = useState<Authority | null>(null);
    const { modules, getModules } = useModuleStore();
    const { authorityTypes, getAuthorityTypes } = useAuthorityTypeStore()
    const { getAuthorities, updateAuthority } = useAuthorityStore();
    const [assignedAuthorities, setAssignedAuthorities] = useState<any>([]);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const { isOpenSnackbar, openSnackbar, closeSnackbar } = useSnackbarStore()
    const [snackbarMsg, setSnackbarMsg] = useState<string>('')
    const navigate = useNavigate()
    const { authorities: userAuthorities } = useKeycloakStore()
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    useEffect(() => {
        const fetchAuthority = async () => {
            try {
                const authorityData = await axiosInstance.get(`/authority/${Number(id)}`)
                setAuthority(authorityData.data);
                setAssignedAuthorities(authorityData.data.authorityResponses || []);

                // Set initial form data
                setFormData({
                    'Authority': authorityData.data.libelle,
                    'Module Name': authorityData.data.moduleResponse.moduleName,
                    'Authority Type': authorityData.data.authorityTypeResponse.libelle,
                    'Status': authorityData.data.actif ? 'Activated' : 'Deactivated',
                });
            } catch (error) {
                console.error("Failed to fetch authorities", error);
            }
        };

        fetchAuthority();

    }, [id]);

    useEffect(() => {
        getModules()
        getAuthorities()
        getAuthorityTypes()
    }, [getModules, getAuthorities, getAuthorityTypes]);


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
                // eslint-disable-next-line
                openSnackbar();
                setSnackbarSeverity('success')
                setSnackbarMsg(`User Enabled successfully`);
            } else {
                // eslint-disable-next-line
                openSnackbar();
                setSnackbarSeverity('success')
                setSnackbarMsg(`User Disabled successfully`);
            }
        } catch (error) {
            // eslint-disable-next-line
            openSnackbar();
            setSnackbarSeverity('error')
            setSnackbarMsg(`Failed to enable or disable Authority`);
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

        if (!formData['Authority Type']) {
            console.error('Authority Type is not selected');
            return; // Sortir de la fonction si aucun module n'est sélectionné
        }

        // Récupérer le module sélectionné
        const selectedAuthorityType = formData['Authority Type'];
        const selectedAuthType = authorityTypes.find(authorityType => authorityType.libelle === selectedAuthorityType);

        // Vérifier si un module correspondant a été trouvé
        if (!selectedAuthType) {
            console.error('Selected authority type not found');
            return; // Sortir de la fonction si aucun module correspondant n'est trouvé
        }

        // Récupérer l'ID du module sélectionné
        const authorityTypeId = selectedAuthType.id;

        // Si c'est une mise à jour de rôle, récupérer l'ID du module du backend
        let authTypeIdRec: number | null = null;

        if (Number(id) !== null) {
            try {
                const responseModule = await axiosInstance.get(`/module/${moduleId}`);
                moduleIdRec = responseModule.data.id;
                const responseAT = await axiosInstance.get(`/authorityType/${authorityTypeId}`);
                authTypeIdRec = responseAT.data.id;
            } catch (error) {
                console.error('Error retrieving authority type ID from backend:', error);
                return; // Sortir de la fonction en cas d'erreur
            }
        }


        if (Number(id) !== null && authority !== null) {

            const authorityData = {
                id: Number(id),
                libelle: formData['Authority'],
                moduleId: moduleIdRec !== null ? moduleIdRec : moduleId,
                authorityTypeId: authTypeIdRec !== null ? authTypeIdRec : authorityTypeId,
                actif: formData['Status'] === 'Activated'
            };

            try {
                await updateAuthority(Number(id), authorityData);

                // eslint-disable-next-line
                openSnackbar();
                setSnackbarSeverity('success')
                setSnackbarMsg(`Authority updated successfully`);
                setTimeout(() => {
                    navigate('/admin/authorities');
                }, 5000);
                console.log('Authority updated successfully');
            } catch (error) {
                console.error('Error updating authority:', error);
                // eslint-disable-next-line
                openSnackbar();
                setSnackbarSeverity('error')
                setSnackbarMsg(`Failed to update Authority`);
            }
        }
    };


    console.log(assignedAuthorities)

    return (
        <>
            {userAuthorities.some(auth => auth.data === 'AUTHORITY_VIEW_ONE' && auth.isGranted) ? (
                <>
                    <BreadCrumbs to='/admin/authorities' text1='Authorities' text2='Authority' />
                    <Stack sx={{ py: 2, height: '80%', marginBottom: 4, boxSizing: 'border-box', fontFamily: 'Nunito, sans serif' }} direction="column">
                        <Paper sx={{ flex: 1, mx: 'auto', width: '80%', p: 2 }}>
                            <Stack direction="column" spacing={1} sx={{ height: 1 }}>
                                <Box component="form" onSubmit={handleSubmit}>
                                    <TextField
                                        size='small'
                                        // key={field}
                                        label='Authority'
                                        name='Authority'
                                        value={formData['Authority'] || ''}
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

                                    <Box display="flex" alignItems="center">
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel id="authorityType-label">Authority Type</InputLabel>
                                            <Select
                                                labelId="authorityType-label"
                                                label="Authority Type"
                                                name="Authority Type"
                                                value={formData['Authority Type'] || ''}
                                                onChange={handleChange}
                                            >
                                                {authorityTypes.map((auth) => (
                                                    <MenuItem key={auth.id} value={auth.libelle}>
                                                        {auth.libelle}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
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

                                    {userAuthorities.some(auth => auth.data === 'AUTHORITY_UPDATE' && auth.isGranted) && (
                                        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
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
                </>
            ) : (
                <Unauthorized />
            )
            }
        </>

    )
}

export default AuthorityDetail