import { useEffect, useMemo, useState } from 'react';
import { usePopupStore, useSnackbarStore } from '../../store/CommonStore/StyleStore';
import { useGroupStore } from '../../store/AdminStore/GroupStore';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/AdminStore/UserStore';
import { useKeycloakStore } from '../../store/AuthStore/KeycloakStore';
import Unauthorized from '../Errors/Unauthorized';
import DataTable from '../../components/Common/Reusable-components/AdminComponent/DataTable';
import { Box, CircularProgress } from '@mui/material';

const Groups = () => {
    const columns = useMemo(() => [
        { field: 'libelle', headerName: 'Group', width: 200 },
    ], []);

    const { groups, addGroup, deleteGroup, getGroups } = useGroupStore();
    const { getUsers, users } = useUserStore();
    const { authorities: userAuthorities } = useKeycloakStore();
    const { isOpen, openPopup, closePopup } = usePopupStore();
    const { isOpenSnackbar, openSnackbar, closeSnackbar } = useSnackbarStore();
    const [snackbarMsg, setSnackbarMsg] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');
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
    }, [getGroups, getUsers]);

    const fields = [
        { name: 'Group', label: 'Group', type: 'text', required: true },
        { name: 'Status', label: 'Status', type: 'switch', options: ['Activated', 'Deactivated'] }
    ];

    const handleOpenAddPopup = () => {
        openPopup();
    };

    const handleSubmitGroup = async (formData: Record<string, any>) => {
        const groupData = {
            id: null,
            libelle: formData['Group'],
            actif: formData['Status'] === 'Activated',
        };

        try {
            await addGroup(groupData);
            closePopup();
            setSnackbarSeverity('success');
            setSnackbarMsg('Group added successfully');
            openSnackbar();
        } catch (error) {
            setSnackbarSeverity('error');
            setSnackbarMsg('Error adding group');
            openSnackbar();
        }
    };

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
            setSnackbarSeverity('error');
            setSnackbarMsg('Error deleting group');
            openSnackbar();
        }
    };

    if (loading) {
        <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
        </Box>
    }
    else if (!userAuthorities.some(auth => auth.data === 'GROUP_VIEW_ALL' && auth.isGranted)) {
        return <Unauthorized />;
    }

    return (
        <DataTable
            title='Groups'
            createAuthority='GROUP_CREATE'
            userAuthorities={userAuthorities}
            titleAddButton='Add Group'
            fields={fields}
            handleOpenAddPopup={handleOpenAddPopup}
            isOpenPopup={isOpen}
            closePopup={closePopup}
            handleSubmitOption={handleSubmitGroup}
            initialData={{}}
            updateAuthority='GROUP_UPDATE'
            deleteAuthority='GROUP_DELETE'
            handleViewDetails={handleViewDetails}
            handleDelete={handleDeleteGroup}
            rows={groups}
            columns={[...columns]}
            isOpenSnackbar={isOpenSnackbar}
            severity={snackbarSeverity}
            closeSnackbar={closeSnackbar}
            snackbarText={snackbarMsg}
        />
    );
};

export default Groups;
