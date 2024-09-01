import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Paper, SelectChangeEvent, Stack,
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
import TextFieldForm from '../../components/Common/Reusable-components/AdminComponent/TextFieldForm';
import SelectFieldFrom from '../../components/Common/Reusable-components/AdminComponent/SelectFieldFrom';
import SwitchForm from '../../components/Common/Reusable-components/AdminComponent/SwitchForm';
import ButtonSaveChanges from '../../components/Common/Reusable-components/AdminComponent/ButtonSaveChanges';

const AuthorityDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { modules, getModules } = useModuleStore();
    const { authorityTypes, getAuthorityTypes } = useAuthorityTypeStore()
    const { getAuthorities, updateAuthority } = useAuthorityStore();
    const { authorities: userAuthorities } = useKeycloakStore()
    const { isOpenSnackbar, openSnackbar, closeSnackbar } = useSnackbarStore()
    const [authority, setAuthority] = useState<Authority | null>(null);
    // const [assignedAuthorities, setAssignedAuthorities] = useState<any>([]);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [snackbarMsg, setSnackbarMsg] = useState<string>('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAuthority = async () => {
            try {
                const authorityData = await axiosInstance.get(`/authority/${Number(id)}`)
                setAuthority(authorityData.data);
                // setAssignedAuthorities(authorityData.data.authorityResponses || []);
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
                setSnackbarSeverity('success')
                setSnackbarMsg(`Authority Enabled successfully`);
                openSnackbar();
            } else {
                setSnackbarSeverity('success')
                setSnackbarMsg(`Authority Disabled successfully`);
                openSnackbar();
            }
        } catch (error) {
            setSnackbarSeverity('error')
            setSnackbarMsg(`Failed to enable or disable Authority`);
            openSnackbar();
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const selectedModule = modules.find(module => module.moduleName === formData['Module Name']);
        if (!selectedModule) {
            console.error('Selected module not found');
            return;
        }

        const selectedAuthType = authorityTypes.find(authorityType => authorityType.libelle === formData['Authority Type']);
        if (!selectedAuthType) {
            console.error('Selected authority type not found');
            return; // Sortir de la fonction si aucun module correspondant n'est trouvé
        }

        // Si c'est une mise à jour de rôle, récupérer l'ID du module et authType du backend
        let moduleIdRec: number | null = null;
        let authTypeIdRec: number | null = null;

        if (Number(id) !== null) {
            try {
                const responseModule = await axiosInstance.get(`/module/${selectedModule.id}`);
                moduleIdRec = responseModule.data.id;
                const responseAT = await axiosInstance.get(`/authorityType/${selectedAuthType.id}`);
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
                moduleId: moduleIdRec !== null ? moduleIdRec : selectedModule.id,
                authorityTypeId: authTypeIdRec !== null ? authTypeIdRec : selectedAuthType.id,
                actif: formData['Status'] === 'Activated'
            };

            try {
                await updateAuthority(Number(id), authorityData);
                setSnackbarSeverity('success')
                setSnackbarMsg(`Authority updated successfully`);
                openSnackbar();
                setTimeout(() => {
                    navigate('/admin/authorities');
                }, 5000);
                console.log('Authority updated successfully');
            } catch (error) {
                console.error('Error updating authority:', error);
                setSnackbarSeverity('error')
                setSnackbarMsg(`Failed to update Authority`);
                openSnackbar();

            }
        }
    };

    if (!userAuthorities.some(auth => auth.data === 'AUTHORITY_VIEW_ONE' && auth.isGranted)) {
        return <Unauthorized />;
    }

    return (
        <>
            <BreadCrumbs to='/admin/authorities' text1='Authorities' text2='Authority' />
            <Stack sx={{ py: 2, height: '80%', marginBottom: 4, boxSizing: 'border-box' }} direction="column">
                <Paper sx={{ flex: 1, mx: 'auto', width: '80%', p: 2 }}>
                    <Stack direction="column" spacing={1} sx={{ height: 1 }}>
                        <Box component="form" onSubmit={handleSubmit}>
                            <TextFieldForm
                                label='Authority'
                                name='Authority'
                                value={formData['Authority'] || ''}
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
                                label='Authority Type'
                                name='Authority Type'
                                value={formData['Authority Type'] || ''}
                                onChange={handleChange}
                                options={authorityTypes.map(authority => ({ id: authority.id, value: authority.libelle }))}
                            />
                            <SwitchForm
                                checked={formData['Status'] === 'Activated'}
                                onChange={handleSwitchChange}
                                label='Status'
                            />
                            <ButtonSaveChanges
                                userAuthorities={userAuthorities}
                                updateAuthority='AUTHORITY_UPDATE'
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

export default AuthorityDetail