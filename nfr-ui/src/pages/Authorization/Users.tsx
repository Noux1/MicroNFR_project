import { useEffect, useMemo, useState } from 'react'
import { useUserStore } from '../../store/AdminStore/UserStore'
import { usePopupStore, useSnackbarStore } from '../../store/CommonStore/StyleStore'
import { useKeycloakStore } from '../../store/AuthStore/KeycloakStore'
import { useNavigate } from 'react-router-dom';
import { useGroupStore } from '../../store/AdminStore/GroupStore'
import Unauthorized from '../Errors/Unauthorized'
import DataTable from '../../components/Common/Reusable-components/AdminComponent/DataTable'
import { Box, CircularProgress } from '@mui/material';

const Users = () => {
    const columns = useMemo(() => [
        { field: 'userName', headerName: 'User Name', width: 150 },
        { field: 'firstName', headerName: 'First Name', width: 150 },
        { field: 'lastName', headerName: 'Last Name', width: 100 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
    ], []);

    const { users, addUser, deleteUser, getUsers } = useUserStore();
    const { groups, getGroups } = useGroupStore();
    const { authorities: userAuthorities } = useKeycloakStore();
    const { isOpen, openPopup, closePopup } = usePopupStore();
    const { isOpenSnackbar, openSnackbar, closeSnackbar } = useSnackbarStore();
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');
    const [snackbarMsg, setSnackbarMsg] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await getUsers();
            await getGroups();
            setLoading(false);
        };

        fetchData();
    }, [getUsers, getGroups]);

    const fields = [
        { name: 'User Name', label: 'User Name', type: 'text', required: true },
        { name: 'First Name', label: 'First Name', type: 'text', required: true },
        { name: 'Last Name', label: 'Last Name', type: 'text', required: true },
        { name: 'Email', label: 'Email', type: 'text', required: true },
        { name: 'Phone Number', label: 'Phone Number', type: 'text', required: true },
        { name: 'Group', label: 'Group', type: 'list', options: groups.map(group => group.libelle) },
        { name: 'Password', label: 'Password', type: 'text' },
        { name: 'Status', label: 'Status', type: 'switch', options: ['Activated', 'Deactivated'] },
        { name: 'Temporary', label: 'Temporary', type: 'switch', options: ['Activated', 'Deactivated'] },
        { name: 'Email Verified', label: 'Email Verified', type: 'switch', options: ['Activated', 'Deactivated'] }
    ];

    const handleOpenAddPopup = () => {
        openPopup();
    };

    const handleSubmitUser = async (formData: Record<string, any>) => {
        const selectedGroup = groups.find(group => group.libelle === formData['Group']);
        if (!selectedGroup) {
            console.error('Selected group not found');
            return;
        }

        const userData = {
            id: null,
            userName: formData['User Name'],
            firstName: formData['First Name'],
            lastName: formData['Last Name'],
            email: formData['Email'],
            phoneNumber: formData['Phone Number'],
            actif: formData['Status'] === 'Activated',
            groupId: selectedGroup.id,
            password: formData['Password'],
            temporary: formData['Temporary'] === 'Activated',
            emailVerified: formData['Email Verified'] === 'Activated',
            requiredActions: null
        };

        try {
            await addUser(userData);
            setSnackbarSeverity('success');
            setSnackbarMsg('User added successfully');
            openSnackbar();
            closePopup();
        } catch (error) {
            console.error('Error adding user:', error);
            setSnackbarSeverity('error');
            setSnackbarMsg('Failed to add user');
            openSnackbar();
        }
    };

    const handleDeleteUser = async (id: number) => {
        try {
            await deleteUser(id);
            setSnackbarSeverity('success');
            setSnackbarMsg('User deleted successfully');
            openSnackbar();
        } catch (error) {
            console.error('Error deleting user:', error);
            setSnackbarSeverity('error');
            setSnackbarMsg('Failed to delete user');
            openSnackbar();
        }
    };

    const handleViewDetails = (id: number) => {
        navigate(`/admin/users/${id}`);
    };

    if (loading) {
        <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
        </Box>
    }
    else if (!userAuthorities.some(auth => auth.data === 'USER_GET_ALL' && auth.isGranted)) {
        return <Unauthorized />;
    }

    return (
        <DataTable
            title='Users'
            createAuthority='USER_CREATE'
            userAuthorities={userAuthorities}
            titleAddButton='Add User'
            fields={fields}
            handleOpenAddPopup={handleOpenAddPopup}
            isOpenPopup={isOpen}
            closePopup={closePopup}
            handleSubmitOption={handleSubmitUser}
            initialData={{}}
            updateAuthority='USER_UPDATE'
            deleteAuthority='USER_DELETE'
            handleViewDetails={handleViewDetails}
            handleDelete={handleDeleteUser}
            rows={users}
            columns={[...columns]}
            isOpenSnackbar={isOpenSnackbar}
            severity={snackbarSeverity}
            closeSnackbar={closeSnackbar}
            snackbarText={snackbarMsg}
        />
    )
}

export default Users