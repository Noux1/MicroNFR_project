import { Box, Chip, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { usePopupStore, useSnackbarStore } from '../../store/CommonStore/StyleStore';
import ButtonForm from '../../components/Common/Reusable-components/ButtonForm';
import Popup from '../../components/Common/Reusable-components/Popup';
import { useGroupStore } from '../../store/AdminStore/GroupStore';
import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import ButtonMore from '../../components/Common/Reusable-components/ButtonMore';
import { useNavigate } from 'react-router-dom';
import SnackBar from '../../components/Common/Reusable-components/SnackBar';
import { useUserStore } from '../../store/AdminStore/UserStore';
import { useKeycloakStore } from '../../store/AuthStore/KeycloakStore';
import Unauthorized from '../Errors/Unauthorized';

const Groups = () => {
    const columns = useMemo(() => [
        { field: 'libelle', headerName: 'Group', width: 200 },
    ], []);

    const { groups, addGroup, deleteGroup, getGroups } = useGroupStore();
    const { getUsers, users } = useUserStore();
    const { authorities: userAuthorities } = useKeycloakStore();

    useEffect(() => {
        getGroups();
        getUsers();
    }, [getGroups, getUsers]);

    const fields = [
        {
            name: 'Group',
            label: 'Group',
            type: 'text',
            required: true
        },
        {
            name: 'Status',
            label: 'Status',
            type: 'switch',
            options: ['Activated', 'Deactivated']
        }
    ];

    const { isOpen, openPopup, closePopup } = usePopupStore();
    const [updateFormData, setUpdateFormData] = useState<Record<string, any>>({});
    const { isOpenSnackbar, openSnackbar, closeSnackbar } = useSnackbarStore();
    const [snackbarMsg, setSnackbarMsg] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    const handleOpenAddPopup = () => {
        setUpdateFormData({}); // Clear any previous initial data
        openPopup();
    };

    const handleAddGroup = async (formData: Record<string, any>) => {
        const groupData = {
            id: null,
            libelle: formData['Group'],
            actif: formData['Status'] === 'Activated'
        };

        try {
            await addGroup(groupData);
            setUpdateFormData({});
            closePopup();
            setSnackbarSeverity('success');
            setSnackbarMsg(`Group added successfully`);
            openSnackbar();
            console.log('Group added/updated successfully');
        } catch (error) {
            console.error('Error adding/updating group:', error);
            setSnackbarSeverity('error');
            setSnackbarMsg('Error adding/updating group');
            openSnackbar();
        }
    };

    const navigate = useNavigate();

    const handleViewDetails = (id: number) => {
        navigate(`/admin/groups/${id}`);
    };

    const handleDeleteGroup = async (id: number) => {
        const groupAssigned = users.some(user => user.groupResponse.id === id);

        if (groupAssigned) {

            setSnackbarSeverity('error');
            setSnackbarMsg('Cannot delete group, it is assigned to a user');
            openSnackbar();
            return;
        }

        try {
            await deleteGroup(id);
            setSnackbarSeverity('success');
            setSnackbarMsg('Group deleted successfully');
            openSnackbar();
        } catch (error) {
            console.error('Error deleting group:', error);
            setSnackbarSeverity('error');
            setSnackbarMsg('Error deleting group');
            openSnackbar();
        }
    };

    return (
        <>
            {userAuthorities.some(auth => auth.data === 'GROUP_VIEW_ALL' && auth.isGranted) ? (
                <>
                    <Box sx={{ height: 350, marginX: 6 }}>
                        <Stack direction='row' margin={2} justifyContent='space-between'>
                            <Typography variant='h5' sx={{ fontFamily: 'Nunito, sans serif' }}>
                                Groups
                            </Typography>
                            {userAuthorities.some(auth => auth.data === 'GROUP_CREATE' && auth.isGranted) && (
                                <ButtonForm
                                    text='Add Group'
                                    fields={fields}
                                    onSubmit={handleOpenAddPopup} />
                            )}
                            <Popup
                                open={isOpen}
                                onClose={closePopup}
                                fields={fields}
                                onSubmit={handleAddGroup}
                                initialData={{}}
                            />
                        </Stack>

                        <DataGrid
                            columns={[
                                ...columns,
                                {
                                    field: 'actif',
                                    headerName: 'Status',
                                    width: 200,
                                    renderCell: (params: GridCellParams) => (
                                        <Box>
                                            {params.value ? (
                                                <Chip color='success' variant='outlined' label='Activated' />
                                            ) : (
                                                <Chip color='error' variant='outlined' label='Deactivated' />
                                            )}
                                        </Box>
                                    )
                                },
                                {
                                    field: 'actions',
                                    headerName: 'Actions',
                                    width: 100,
                                    renderCell: (params: GridCellParams) => (
                                        <ButtonMore
                                            id={params.row.id}
                                            handleUpdate={handleViewDetails}
                                            handleDelete={userAuthorities.some(auth => auth.data === 'GROUP_DELETE' && auth.isGranted) && handleDeleteGroup} />
                                    )
                                }
                            ]}
                            rows={groups.map(group => ({ ...group, id: group.id }))} // Add unique IDs to each row
                            getRowId={(row) => row.id}
                            sx={{ fontFamily: 'Nunito, sans serif' }}
                        />
                    </Box>
                    <SnackBar
                        open={isOpenSnackbar}
                        onClose={closeSnackbar}
                        text={snackbarMsg}
                        severity={snackbarSeverity}
                    />
                </>
            ) : (
                <Unauthorized />
            )}
        </>
    );
};

export default Groups;
