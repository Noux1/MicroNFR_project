import { useEffect, useMemo, useState } from 'react';
import { usePopupStore, useSnackbarStore } from '../../store/CommonStore/StyleStore';
import { useAuthorityTypeStore } from '../../store/AdminStore/AuthorityTypeStore';
import { useNavigate } from 'react-router-dom';
import { useKeycloakStore } from '../../store/AuthStore/KeycloakStore';
import Unauthorized from '../Errors/Unauthorized';
import DataTable from '../../components/Common/Reusable-components/AdminComponent/DataTable';
import { Box, CircularProgress } from '@mui/material';

const AuthorityTypes = () => {
    const columns = useMemo(() => [
        { field: 'libelle', headerName: 'Authority Type', width: 200 },
    ], []);

    const { authorityTypes, addAuthorityType, deleteAuthorityType, getAuthorityTypes } = useAuthorityTypeStore();
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
            await getAuthorityTypes();
            setLoading(false);
        };
        fetchData();
    }, [getAuthorityTypes]);

    const fields = [
        { name: 'Authority Type', label: 'Authority Type', type: 'text', required: true },
        { name: 'Status', label: 'Status', type: 'switch', options: ['Activated', 'Deactivated'] },
    ];

    const handleOpenAddPopup = () => {
        openPopup();
    };

    const handleSubmitAuthorityType = async (formData: Record<string, any>) => {
        const authorityTypeData = {
            id: null,
            libelle: formData['Authority Type'],
            actif: formData['Status'] === 'Activated',
        };

        try {
            await addAuthorityType(authorityTypeData);
            setSnackbarSeverity('success');
            setSnackbarMsg('Authority Type added successfully');
            openSnackbar();
            console.log('Authority Type added successfully');
        } catch (error) {
            console.error('Error adding/updating authority type:', error);
            setSnackbarSeverity('error');
            setSnackbarMsg('Failed to add Authority Type');
            openSnackbar();
        }
        closePopup();
    };

    const handleViewDetails = (id: number) => {
        navigate(`/admin/authorityTypes/${id}`);
    };

    const handleDeleteAuthorityType = async (id: number) => {
        try {
            await deleteAuthorityType(id);
            setSnackbarSeverity('success');
            setSnackbarMsg('Authority Type deleted successfully');
            console.log('Authority Type deleted successfully');
            openSnackbar();
        } catch (error) {
            console.error('Error deleting authority type:', error);
            setSnackbarSeverity('error');
            setSnackbarMsg('Failed to delete Authority Type');
            openSnackbar();
        }
    };

    if (loading) {
        <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
        </Box>
    }
    else if (!userAuthorities.some(auth => auth.data === 'AUTHORITY_TYPE_VIEW_ALL' && auth.isGranted)) {
        return <Unauthorized />;
    }

    return (
        <DataTable
            title='Authotrity Types'
            createAuthority='AUTHORITY_TYPE_CREATE'
            userAuthorities={userAuthorities}
            titleAddButton='Add Module'
            fields={fields}
            handleOpenAddPopup={handleOpenAddPopup}
            isOpenPopup={isOpen}
            closePopup={closePopup}
            handleSubmitOption={handleSubmitAuthorityType}
            initialData={{}}
            updateAuthority='AUTHORITY_TYPE_UPDATE'
            deleteAuthority='AUTHORITY_TYPE_DELETE'
            handleViewDetails={handleViewDetails}
            handleDelete={handleDeleteAuthorityType}
            rows={authorityTypes}
            columns={[...columns]}
            isOpenSnackbar={isOpenSnackbar}
            severity={snackbarSeverity}
            closeSnackbar={closeSnackbar}
            snackbarText={snackbarMsg}
        />
    )
};

export default AuthorityTypes;