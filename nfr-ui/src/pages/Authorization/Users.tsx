import { useEffect, useMemo, useState } from 'react'
import { useUserStore } from '../../store/AdminStore/UserStore'
import { usePopupStore, useSnackbarStore } from '../../store/CommonStore/StyleStore'
import { Box, Chip, Stack, Typography } from '@mui/material'
import ButtonForm from '../../components/Common/Reusable-components/ButtonForm'
import Popup from '../../components/Common/Reusable-components/Popup'
import { DataGrid, GridCellParams } from '@mui/x-data-grid'
import ButtonMore from '../../components/Common/Reusable-components/ButtonMore'
import { useKeycloakStore } from '../../store/AuthStore/KeycloakStore'
import { useNavigate } from 'react-router-dom';
import SnackBar from '../../components/Common/Reusable-components/SnackBar'
import { useGroupStore } from '../../store/AdminStore/GroupStore'
import axiosInstance from '../../utils/AxiosInstance'
import Unauthorized from '../Errors/Unauthorized'


const Users = () => {
    const columns = useMemo(() => [
        { field: 'userName', headerName: 'User Name', width: 150 },
        { field: 'firstName', headerName: 'First Name', width: 150 },
        { field: 'lastName', headerName: 'Last Name', width: 100 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },

    ], [])

    const { users, addUser, deleteUser, getUsers } = useUserStore()
    const { groups, getGroups } = useGroupStore()
    const { authorities: userAuthorities } = useKeycloakStore()
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    useEffect(() => {
        getUsers()
        getGroups()
    }, [getUsers, getGroups])

    const fields = [
        {
            name: 'User Name',
            label: 'User Name',
            type: 'text',
            required: true
        },
        {
            name: 'First Name',
            label: 'First Name',
            type: 'text',
            required: true
        },
        {
            name: 'Last Name',
            label: 'Last Name',
            type: 'text',
            required: true
        },
        {
            name: 'Email',
            label: 'Email',
            type: 'text',
            required: true
        },
        {
            name: 'Phone Number',
            label: 'Phone Number',
            type: 'text',
            required: true
        },
        {
            name: 'Group',
            label: 'Group',
            type: 'list',
            options: groups.map(group => group.libelle)
        },
        {
            name: 'Password',
            label: 'Password',
            type: 'text',
            // options: ['Activated', 'Desactivated']
        },
        {
            name: 'Status',
            label: 'Status',
            type: 'switch',
            options: ['Activated', 'Desactivated']
        },

        {
            name: 'Temporary',
            label: 'Temporary',
            type: 'switch',
            options: ['Activated', 'Desactivated']
        },
        {
            name: 'Email Verified',
            label: 'Email Verified',
            type: 'switch',
            options: ['Activated', 'Desactivated']
        }
    ];
    const { isOpen, openPopup, closePopup } = usePopupStore();
    const [updateFormData, setUpdateFormData] = useState<Record<string, any>>({});
    const { isOpenSnackbar, openSnackbar, closeSnackbar } = useSnackbarStore()
    const [snackbarMsg, setSnackbarMsg] = useState<string>('')

    const handleOpenAddPopup = () => {
        setUpdateFormData({}); // Clear any previous initial data
        openPopup();
    };

    const handleAddUser = async (formData: Record<string, any>) => {
        if (!formData['Group']) {
            console.error('Group is not selected');
            return; // Sortir de la fonction si aucun module n'est sélectionné
        }

        // Récupérer le module sélectionné
        const groupSelected = formData['Group'];
        const selectedGroup = groups.find(group => group.libelle === groupSelected);
        console.log(selectedGroup)
        console.log(selectedGroup)
        // Vérifier si un module correspondant a été trouvé
        if (!selectedGroup) {
            console.error('Selected group not found');
            return; // Sortir de la fonction si aucun module correspondant n'est trouvé
        }

        // Récupérer l'ID du module sélectionné
        const groupId = selectedGroup.id;

        // Si c'est une mise à jour de rôle, récupérer l'ID du module du backend
        let groupIdRec: number | null = null;

        try {
            const responseGroup = await axiosInstance.get(`/group/${groupId}`);
            groupIdRec = responseGroup.data.id;
        } catch (error) {
            console.error('Error retrieving group ID from backend:', error);
            return; // Sortir de la fonction en cas d'erreur
        }

        const userData = {
            id: null,
            userName: formData['User Name'],
            firstName: formData['First Name'],
            lastName: formData['Last Name'],
            email: formData['Email'],
            phoneNumber: formData['Phone Number'],
            actif: formData['Status'] === 'Activated',
            groupId: groupIdRec !== null ? groupIdRec : groupId,
            password: formData['Password'],
            temporary: formData['Temporary'] === 'Activated',
            emailVerified: formData['Email Verified'] === 'Activated',
            requiredActions: null
        };

        try {
            await addUser(userData);
            // eslint-disable-next-line
            openSnackbar();
            setSnackbarSeverity('success')
            setSnackbarMsg(`User added successfully`);
            console.log('User added successfully');
            closePopup(); // Close the popup only if user is added successfully
            setUpdateFormData({});
        } catch (error) {
            console.error('Error adding user:', error);
            // eslint-disable-next-line
            openSnackbar();
            setSnackbarSeverity('error')
            setSnackbarMsg(`Failed to add user`);
        }
    };

    const handleDeleteUser = (id: number) => {
        deleteUser(id)
        // eslint-disable-next-line
        openSnackbar();
        setSnackbarSeverity('success')
        setSnackbarMsg(`User added successfully`);
    }

    const navigate = useNavigate();

    const handleViewDetails = (id: number) => {
        navigate(`/admin/users/${id}`);
    };

    return (
        <>
            {userAuthorities.some(auth => auth.data === 'USER_GET_ALL' && auth.isGranted) ? (
                <>
                    <Box
                        sx={{
                            height: 350, marginX: 6
                        }}>
                        <Stack direction='row' margin={2} justifyContent='space-between'>
                            <Typography variant='h5' sx={
                                {
                                    fontFamily: 'Nunito, sans serif'
                                }
                            }>
                                Users
                            </Typography>
                            {userAuthorities.some(auth => auth.data === 'USER_CREATE' && auth.isGranted) && (
                                <ButtonForm
                                    text='Add User'
                                    fields={fields}
                                    onSubmit={handleOpenAddPopup} />
                            )}
                            <Popup
                                open={isOpen}
                                onClose={closePopup}
                                fields={fields}
                                onSubmit={handleAddUser}
                                initialData={{}}
                            />
                            {/* <IconButton size='small' onClick={refreshEvents}><Refresh /></IconButton> */}
                        </Stack >

                        <DataGrid
                            columns={[
                                ...columns,

                                {
                                    field: 'actif',
                                    headerName: 'Status',
                                    width: 100,
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
                                        <Box>
                                            <ButtonMore
                                                id={params.row.id}
                                                handleUpdate={handleViewDetails}
                                                handleDelete={userAuthorities.some(auth => auth.data === 'USER_DELETE' && auth.isGranted) && handleDeleteUser} />

                                        </Box>

                                    )
                                }
                            ]}
                            rows={users.map((user) => ({ ...user, id: user.id }))} // Add unique IDs to each row
                            getRowId={(row) => row.id}
                            sx={{
                                fontFamily: 'Nunito, sans serif'
                            }}
                        />
                    </Box>
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

export default Users