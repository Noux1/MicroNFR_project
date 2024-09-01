import { Box, Paper, SelectChangeEvent, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SnackBar from '../../components/Common/Reusable-components/SnackBar'
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbarStore } from '../../store/CommonStore/StyleStore';
import axiosInstance from '../../utils/AxiosInstance';
import { AuthorityType, useAuthorityTypeStore } from '../../store/AdminStore/AuthorityTypeStore';
import BreadCrumbs from '../../components/Common/Reusable-components/BreadCrumbs';
import { useKeycloakStore } from '../../store/AuthStore/KeycloakStore';
import Unauthorized from '../Errors/Unauthorized';
import TextFieldForm from '../../components/Common/Reusable-components/AdminComponent/TextFieldForm';
import SwitchForm from '../../components/Common/Reusable-components/AdminComponent/SwitchForm';
import ButtonSaveChanges from '../../components/Common/Reusable-components/AdminComponent/ButtonSaveChanges';

const AuthorityTypeDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { updateAuthorityType } = useAuthorityTypeStore();
    const { authorities: userAuthorities } = useKeycloakStore()
    const { isOpenSnackbar, openSnackbar, closeSnackbar } = useSnackbarStore()
    const [authorityType, setAuthorityType] = useState<AuthorityType | null>(null)
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [snackbarMsg, setSnackbarMsg] = useState<string>('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');
    const navigate = useNavigate()

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
                setSnackbarSeverity('success')
                setSnackbarMsg(`Authority Type Enabled successfully`);
                openSnackbar();
            } else {
                setSnackbarSeverity('success')
                setSnackbarMsg(`Authority Type Disabled successfully`);
                openSnackbar();
            }
        } catch (error) {
            setSnackbarSeverity('error')
            setSnackbarMsg(`Failed to enable or disable Authority Type`);
            openSnackbar();
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
                setSnackbarSeverity('success')
                setSnackbarMsg(`Authority Type updated successfully`);
                openSnackbar();
                setTimeout(() => {
                    navigate('/admin/authorityTypes')
                }, 4000);

            } catch (error) {
                console.error('Error updating Authority Type:', error);
                setSnackbarSeverity('error')
                setSnackbarMsg(`Failed to update Authority Type`);
                openSnackbar();
            }
        }
    }

    if (!userAuthorities.some(auth => auth.data === 'AUTHORITY_TYPE_VIEW' && auth.isGranted)) {
        return <Unauthorized />;
    }

    return (
        <>
            <BreadCrumbs to='/admin/authorityTypes' text1='Authority Types' text2='Authority Type' />
            <Stack sx={{ py: 2, height: '80%', marginBottom: 4, boxSizing: 'border-box' }} direction="column">
                <Paper sx={{ flex: 1, mx: 'auto', width: '80%', p: 2 }}>
                    <Stack direction="column" spacing={1} sx={{ height: 1 }}>
                        <Box component="form" onSubmit={handleSubmit}>
                            <TextFieldForm
                                label='Authority Type'
                                name='Authority Type'
                                value={formData['Authority Type'] || ''}
                                onChange={handleChange}
                            />
                            <SwitchForm
                                checked={formData['Status'] === 'Activated'}
                                onChange={handleSwitchChange}
                                label='Status'
                            />
                            <ButtonSaveChanges
                                userAuthorities={userAuthorities}
                                updateAuthority='AUTHORITY_TYPE_UPDATE'
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

export default AuthorityTypeDetail