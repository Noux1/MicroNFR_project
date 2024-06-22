import { Box, Button, FormControlLabel, Paper, SelectChangeEvent, Stack, Switch, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SnackBar from '../../components/Common/Reusable-components/SnackBar'
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbarStore } from '../../store/CommonStore/StyleStore';
import { Group, useGroupStore } from '../../store/AdminStore/GroupStore';
import axiosInstance from '../../utils/AxiosInstance';
import BreadCrumbs from '../../components/Common/Reusable-components/BreadCrumbs';
import { useKeycloakStore } from '../../store/AuthStore/KeycloakStore';
import Unauthorized from '../Errors/Unauthorized';

const GroupDetail = () => {

    const { id } = useParams<{ id: string }>();
    const [group, setGroup] = useState<Group | null>(null)
    const [formData, setFormData] = useState<Record<string, any>>({});
    const { isOpenSnackbar, openSnackbar, closeSnackbar } = useSnackbarStore()
    const [snackbarMsg, setSnackbarMsg] = useState<string>('')
    const { updateGroup } = useGroupStore();
    const navigate = useNavigate()
    const { authorities: userAuthorities } = useKeycloakStore()
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');

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
        if (checked) {
            // eslint-disable-next-line
            openSnackbar();
            setSnackbarSeverity('success')
            setSnackbarMsg(`Group Enabled successfully`);
        } else {
            // eslint-disable-next-line
            openSnackbar();
            setSnackbarSeverity('success')
            setSnackbarMsg(`Group Disabled successfully`);
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
                // eslint-disable-next-line
                openSnackbar();
                setSnackbarSeverity('success')
                setSnackbarMsg(`Group updated successfully`);
                setTimeout(() => {
                    navigate('/admin/groups')
                }, 5000);

                console.log('Group updated successfully');
            } catch (error) {
                // eslint-disable-next-line
                openSnackbar();
                setSnackbarSeverity('error')
                setSnackbarMsg(`Failed to update group`);
                console.error('Error updating group:', error);
            }
        }
    }

    return (
        <>
            {userAuthorities.some(auth => auth.data === 'GROUP_VIEW' && auth.isGranted) ? (
                <>
                    <BreadCrumbs to='/admin/groups' text1='Groups' text2='Group' />
                    <Stack sx={{ py: 2, height: '80%', marginBottom: 4, boxSizing: 'border-box', fontFamily: 'Nunito, sans serif' }} direction="column">
                        <Paper sx={{ flex: 1, mx: 'auto', width: '80%', p: 2 }}>
                            <Stack direction="column" spacing={1} sx={{ height: 1 }}>
                                <Box component="form" onSubmit={handleSubmit}>
                                    <TextField
                                        size='small'
                                        // key={field}
                                        label='Group'
                                        name='Group'
                                        value={formData['Group'] || ''}
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

                                    {userAuthorities.some(auth => auth.data === 'GROUP_UPDATE' && auth.isGranted) && (<Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
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

export default GroupDetail