import { Box, Paper, SelectChangeEvent, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SnackBar from '../../components/Common/Reusable-components/SnackBar'
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbarStore } from '../../store/CommonStore/StyleStore';
import { Group, useGroupStore } from '../../store/AdminStore/GroupStore';
import axiosInstance from '../../utils/AxiosInstance';
import BreadCrumbs from '../../components/Common/Reusable-components/BreadCrumbs';
import { useKeycloakStore } from '../../store/AuthStore/KeycloakStore';
import Unauthorized from '../Errors/Unauthorized';
import TextFieldForm from '../../components/Common/Reusable-components/AdminComponent/TextFieldForm';
import SwitchForm from '../../components/Common/Reusable-components/AdminComponent/SwitchForm';
import ButtonSaveChanges from '../../components/Common/Reusable-components/AdminComponent/ButtonSaveChanges';

const GroupDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { updateGroup } = useGroupStore();
    const { authorities: userAuthorities } = useKeycloakStore()
    const { isOpenSnackbar, openSnackbar, closeSnackbar } = useSnackbarStore()
    const [group, setGroup] = useState<Group | null>(null)
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [snackbarMsg, setSnackbarMsg] = useState<string>('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');
    const navigate = useNavigate()

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const groupData = await axiosInstance.get(`/group/${Number(id)}`)
                setGroup(groupData.data)
                setFormData({
                    'Group': groupData.data.libelle,
                    'Status': groupData.data.actif ? 'Activated' : 'Deactivated',
                });
            } catch (error) {
                console.error("Failed to fetch group", error);
            }
        }
        fetchGroup()
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
                setSnackbarMsg(`Group Enabled successfully`);
                openSnackbar();
            } else {
                setSnackbarSeverity('success')
                setSnackbarMsg(`Group Disabled successfully`);
                openSnackbar();
            }
        } catch (error) {
            setSnackbarSeverity('success')
            setSnackbarMsg(`Failed to enable or disable Group`);
            openSnackbar();
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (Number(id) !== null && group !== null) {
            const groupData = {
                id: Number(id),
                libelle: formData['Group'],
                actif: formData['Status'] === 'Activated',
            };

            try {
                await updateGroup(Number(id), groupData);
                setSnackbarSeverity('success')
                setSnackbarMsg(`Group updated successfully`);
                openSnackbar();
                setTimeout(() => {
                    navigate('/admin/groups')
                }, 4000);

            } catch (error) {
                setSnackbarSeverity('error')
                setSnackbarMsg(`Failed to update group`);
                openSnackbar();
                console.error('Error updating group:', error);
            }
        }
    }

    if (!userAuthorities.some(auth => auth.data === 'GROUP_VIEW' && auth.isGranted)) {
        return <Unauthorized />;
    }

    return (
        <>
            <BreadCrumbs to='/admin/groups' text1='Groups' text2='Group' />
            <Stack sx={{ py: 2, height: '80%', marginBottom: 4, boxSizing: 'border-box' }} direction="column">
                <Paper sx={{ flex: 1, mx: 'auto', width: '80%', p: 2 }}>
                    <Stack direction="column" spacing={1} sx={{ height: 1 }}>
                        <Box component="form" onSubmit={handleSubmit}>
                            <TextFieldForm
                                label='Group'
                                name='Group'
                                value={formData['Group'] || ''}
                                onChange={handleChange}
                            />
                            <SwitchForm
                                checked={formData['Status'] === 'Activated'}
                                onChange={handleSwitchChange}
                                label='Status'
                            />
                            <ButtonSaveChanges
                                userAuthorities={userAuthorities}
                                updateAuthority='GROUP_UPDATE'
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

export default GroupDetail