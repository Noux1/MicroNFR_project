import { Box, Paper, SelectChangeEvent, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SnackBar from '../../components/Common/Reusable-components/SnackBar'
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbarStore } from '../../store/CommonStore/StyleStore';
import axiosInstance from '../../utils/AxiosInstance';
import { Module, useModuleStore } from '../../store/AdminStore/ModuleStore';
import BreadCrumbs from '../../components/Common/Reusable-components/BreadCrumbs';
import { useKeycloakStore } from '../../store/AuthStore/KeycloakStore';
import Unauthorized from '../Errors/Unauthorized';
import TextFieldForm from '../../components/Common/Reusable-components/AdminComponent/TextFieldForm';
import SwitchForm from '../../components/Common/Reusable-components/AdminComponent/SwitchForm';
import ButtonSaveChanges from '../../components/Common/Reusable-components/AdminComponent/ButtonSaveChanges';

const ModuleDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { updateModule } = useModuleStore();
    const { authorities: userAuthorities } = useKeycloakStore()
    const { isOpenSnackbar, openSnackbar, closeSnackbar } = useSnackbarStore()
    const [module, setModule] = useState<Module | null>(null)
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [snackbarMsg, setSnackbarMsg] = useState<string>('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');
    const navigate = useNavigate()

    useEffect(() => {
        const fetchModule = async () => {
            try {
                const moduleData = await axiosInstance.get(`/module/${Number(id)}`)
                setModule(moduleData.data)
                setFormData({
                    'Module Name': moduleData.data.moduleName,
                    'Module Code': moduleData.data.moduleCode,
                    'Status': moduleData.data.actif ? 'Activated' : 'Desactivated',
                    'Icon': moduleData.data.icon,
                    'Uri': moduleData.data.uri,
                    'Color': moduleData.data.color
                });
            } catch (error) {
                console.error("Failed to fetch module", error);
            }
        }
        fetchModule()
    }, [id])

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
                setSnackbarMsg(`Module Enabled successfully`);
                openSnackbar();
            } else {
                setSnackbarSeverity('success')
                setSnackbarMsg(`Module Disabled successfully`);
                openSnackbar();
            }
        } catch (error) {
            setSnackbarSeverity('success')
            setSnackbarMsg(`Failed to enable or disable Module`);
            openSnackbar();
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (Number(id) !== null && module !== null) {
            const moduleData = {
                id: Number(id),
                moduleName: formData['Module Name'],
                moduleCode: formData['Module Code'],
                color: formData['Color'],
                icon: formData['Icon'],
                uri: formData['Uri'],
                actif: formData['Status'] === 'Activated'
            };
            try {
                await updateModule(Number(id), moduleData);
                // eslint-disable-next-line
                openSnackbar();
                setSnackbarSeverity('success')
                setSnackbarMsg(`Module updated successfully`);
                console.log('Module updated successfully');
                setTimeout(() => {
                    navigate('/admin/modules')
                }, 5000);

            } catch (error) {
                console.error('Error updating module:', error);
                // eslint-disable-next-line
                openSnackbar();
                setSnackbarSeverity('error')
                setSnackbarMsg(`Failed to update module`);
            }
        }
    }

    if (!userAuthorities.some(auth => auth.data === 'MODULE_VIEW' && auth.isGranted)) {
        return <Unauthorized />;
    }

    return (
        <>
            <BreadCrumbs to='/admin/modules' text1='Modules' text2='Module' />
            <Stack sx={{ py: 2, height: '80%', marginBottom: 4, boxSizing: 'border-box' }} direction="column">
                <Paper sx={{ flex: 1, mx: 'auto', width: '80%', p: 2 }}>
                    <Stack direction="column" spacing={1} sx={{ height: 1 }}>
                        <Box component="form" onSubmit={handleSubmit}>
                            {['Module Name', 'Module Code', 'Color', 'Icon', 'Uri'].map((field) => (
                                <TextFieldForm
                                    label={field}
                                    name={field}
                                    value={formData[field] || ''}
                                    onChange={handleChange}
                                    disabled={field === 'Module Code'}
                                />
                            ))}
                            <SwitchForm
                                checked={formData['Status'] === 'Activated'}
                                onChange={handleSwitchChange}
                                label='Status'
                            />
                            <ButtonSaveChanges
                                userAuthorities={userAuthorities}
                                updateAuthority='MODULE_UPDATE'
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

export default ModuleDetail