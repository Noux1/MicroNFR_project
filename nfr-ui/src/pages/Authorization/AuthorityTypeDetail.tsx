import { Box, Button, FormControlLabel, Paper, SelectChangeEvent, Stack, Switch, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SnackBar from '../../components/Common/Reusable-components/SnackBar'
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbarStore } from '../../store/CommonStore/StyleStore';
import { Group, useGroupStore } from '../../store/AdminStore/GroupStore';
import axiosInstance from '../../utils/AxiosInstance';
import { AuthorityType, useAuthorityTypeStore } from '../../store/AdminStore/AuthorityTypeStore';
import BreadCrumbs from '../../components/Common/Reusable-components/BreadCrumbs';
import { useKeycloakStore } from '../../store/AuthStore/KeycloakStore';
import Unauthorized from '../Errors/Unauthorized';

const AuthorityTypeDetail = () => {

    const { id } = useParams<{ id: string }>();
    const [authorityType, setAuthorityType] = useState<AuthorityType | null>(null)
    const [formData, setFormData] = useState<Record<string, any>>({});
    const { isOpenSnackbar, openSnackbar, closeSnackbar } = useSnackbarStore()
    const [snackbarMsg, setSnackbarMsg] = useState<string>('')
    const { updateAuthorityType } = useAuthorityTypeStore();
    const navigate = useNavigate()
    const { authorities: userAuthorities } = useKeycloakStore()
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    useEffect(() => {
        const fetchAuthorityType = async () => {
            try {
                const authorityTypeData = await axiosInstance.get(`/authorityType/${Number(id)}`)
                setAuthorityType(authorityTypeData.data)
                setFormData({
                    'Authority Type': authorityTypeData.data.libelle,
                    'Status': authorityTypeData.data.actif ? 'Activated' : 'Deactivated',
                });
            } catch (error) {
                console.error("Failed to fetch group", error);
            }
        }
        fetchAuthorityType()
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
                // eslint-disable-next-line
                openSnackbar();
                setSnackbarSeverity('success')
                setSnackbarMsg(`Authority Type Enabled successfully`);
            } else {
                // eslint-disable-next-line
                openSnackbar();
                setSnackbarSeverity('success')
                setSnackbarMsg(`Authority Type Disabled successfully`);
            }
        } catch (error) {
            // eslint-disable-next-line
            openSnackbar();
            setSnackbarSeverity('error')
            setSnackbarMsg(`Failed to enable or disable Authority Type`);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (Number(id) !== null && authorityType !== null) {
            const authorityTypeData = {
                id: Number(id),
                libelle: formData['Authority Type'],
                actif: formData['Status'] === 'Activated',
            };

            try {
                await updateAuthorityType(Number(id), authorityTypeData);
                // eslint-disable-next-line
                openSnackbar();
                setSnackbarSeverity('success')
                setSnackbarMsg(`Authority Type updated successfully`);
                setTimeout(() => {
                    navigate('/admin/authorityTypes')
                }, 5000);

                console.log('Authority Type updated successfully');
            } catch (error) {
                console.error('Error updating Authority Type:', error);
                // eslint-disable-next-line
                openSnackbar();
                setSnackbarSeverity('error')
                setSnackbarMsg(`Failed to update Authority Type`);
            }
        }
    }

    return (
        <>
            {userAuthorities.some(auth => auth.data === 'AUTHORITY_TYPE_VIEW' && auth.isGranted) ? (
                <>
                    <BreadCrumbs to='/admin/authorityTypes' text1='Authority Types' text2='Authority Type' />
                    <Stack sx={{ py: 2, height: '80%', marginBottom: 4, boxSizing: 'border-box', fontFamily: 'Nunito, sans serif' }} direction="column">
                        <Paper sx={{ flex: 1, mx: 'auto', width: '80%', p: 2 }}>
                            <Stack direction="column" spacing={1} sx={{ height: 1 }}>
                                <Box component="form" onSubmit={handleSubmit}>
                                    <TextField
                                        size='small'
                                        // key={field}
                                        label='Authority Type'
                                        name='Authority Type'
                                        value={formData['Authority Type'] || ''}
                                        onChange={handleChange}
                                        margin="normal"
                                        fullWidth
                                        sx={{ marginBottom: 1 }}
                                    />

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

                                    {userAuthorities.some(auth => auth.data === 'AUTHORITY_TYPE_UPDATE' && auth.isGranted) && (<Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
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

export default AuthorityTypeDetail