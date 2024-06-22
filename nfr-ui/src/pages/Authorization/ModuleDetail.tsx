import { Box, Button, FormControlLabel, Paper, SelectChangeEvent, Stack, Switch, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SnackBar from '../../components/Common/Reusable-components/SnackBar'
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbarStore } from '../../store/CommonStore/StyleStore';
import axiosInstance from '../../utils/AxiosInstance';
import { Module, useModuleStore } from '../../store/AdminStore/ModuleStore';
import BreadCrumbs from '../../components/Common/Reusable-components/BreadCrumbs';
import { useKeycloakStore } from '../../store/AuthStore/KeycloakStore';
import Unauthorized from '../Errors/Unauthorized';

const ModuleDetail = () => {

    const { id } = useParams<{ id: string }>();
    const [module, setModule] = useState<Module | null>(null)
    const [formData, setFormData] = useState<Record<string, any>>({});
    const { isOpenSnackbar, openSnackbar, closeSnackbar } = useSnackbarStore()
    const [snackbarMsg, setSnackbarMsg] = useState<string>('')
    const { updateModule } = useModuleStore();
    const navigate = useNavigate()
    const { authorities: userAuthorities } = useKeycloakStore()
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');

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
        if (checked) {
            // eslint-disable-next-line
            openSnackbar();
            setSnackbarSeverity('success')
            setSnackbarMsg(`Module Enabled successfully`);
        } else {
            // eslint-disable-next-line
            openSnackbar();
            setSnackbarSeverity('success')
            setSnackbarMsg(`Module Disabled successfully`);
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
                console.log('Role added/updated successfully');
            }
        }
    }

    return (
        <>
            {userAuthorities.some(auth => auth.data === 'MODULE_VIEW' && auth.isGranted) ? (
                <>
                    <BreadCrumbs to='/admin/modules' text1='Modules' text2='Module' />
                    <Stack sx={{ py: 2, height: '80%', marginBottom: 4, boxSizing: 'border-box', fontFamily: 'Nunito, sans serif' }} direction="column">
                        <Paper sx={{ flex: 1, mx: 'auto', width: '80%', p: 2 }}>
                            <Stack direction="column" spacing={1} sx={{ height: 1 }}>
                                <Box component="form" onSubmit={handleSubmit}>
                                    {['Module Name', 'Module Code', 'Color', 'Icon', 'Uri'].map((field) => (
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
                                            disabled={field === 'Module Code'}
                                        />
                                    ))}

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

                                    {userAuthorities.some(auth => auth.data === 'MODULE_UPDATE' && auth.isGranted) && (<Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
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

export default ModuleDetail