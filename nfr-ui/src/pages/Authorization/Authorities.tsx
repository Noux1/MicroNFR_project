import { useEffect, useMemo, useState } from 'react'
import { usePopupStore, useSnackbarStore } from '../../store/CommonStore/StyleStore';
import { useAuthorityStore } from '../../store/AdminStore/AuthorityStore';
import { useAuthorityTypeStore } from '../../store/AdminStore/AuthorityTypeStore';
import { useModuleStore } from '../../store/AdminStore/ModuleStore';
import { GridCellParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useKeycloakStore } from '../../store/AuthStore/KeycloakStore';
import Unauthorized from '../Errors/Unauthorized';
import DataTable from '../../components/Common/Reusable-components/AdminComponent/DataTable';
import { Box, CircularProgress } from '@mui/material';

const Authorities = () => {
    const columns = useMemo(() => [
        { field: 'libelle', headerName: 'Authority', width: 200 },
    ], [])

    const { authorities, addAuthority, getAuthorities } = useAuthorityStore()
    const { modules, getModules } = useModuleStore()
    const { authorityTypes, getAuthorityTypes } = useAuthorityTypeStore()
    const { authorities: userAuthorities } = useKeycloakStore()
    const { isOpen, openPopup, closePopup } = usePopupStore();
    const { isOpenSnackbar, openSnackbar, closeSnackbar } = useSnackbarStore()
    const [snackbarMsg, setSnackbarMsg] = useState<string>('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await getAuthorities()
            await getModules()
            await getAuthorityTypes()
            setLoading(false);
        };
        fetchData();
    }, [getAuthorities, getModules, getAuthorityTypes])

    const fields = [
        { name: 'Authority', label: 'Authority', type: 'text', required: true },
        { name: 'Status', label: 'Status', type: 'switch', options: ['Activated', 'Deactivated'] },
        { name: 'Module Name', label: 'Module Name', type: 'list', required: true, options: modules.map(module => module.moduleName) },
        { name: 'Authority Type', label: 'Authority Type', type: 'list', required: true, options: authorityTypes.map(authorityType => authorityType.libelle) },
    ];

    const handleOpenAddPopup = () => {
        openPopup();
    };

    const handleSubmitAuthority = async (formData: Record<string, any>) => {
        const selectedModule = modules.find(module => module.moduleName === formData['Module Name']);
        if (!selectedModule) {
            console.error('Selected module not found');
            return;
        }

        const selectedAuthorityType = authorityTypes.find(authorityType => authorityType.libelle === formData['Authority Type']);
        if (!selectedAuthorityType) {
            console.error('Selected authority type not found');
            return;
        }

        const authorityData = {
            id: null,
            libelle: formData['Authority'],
            moduleId: selectedModule.id,
            authorityTypeId: selectedAuthorityType.id,
            actif: formData['Status'] === 'Activated'
        };

        try {
            await addAuthority(authorityData);
            setSnackbarSeverity('success')
            setSnackbarMsg(`Authority added successfully`);
            openSnackbar();
        } catch (error) {
            console.error('Error adding/updating authority:', error);
            setSnackbarSeverity('error')
            setSnackbarMsg(`Failed to add Authority`);
            openSnackbar();
        }
        closePopup();
    }

    const handleViewDetails = (id: number) => {
        navigate(`/admin/authorities/${id}`);
    };

    if (loading) {
        <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
        </Box>
    }
    else if (!userAuthorities.some(auth => auth.data === 'AUTHORITY_VIEW_ALL' && auth.isGranted)) {
        return <Unauthorized />;
    }

    return (
        <DataTable
            title='Authotrities'
            createAuthority='AUTHORITY_CREATE'
            userAuthorities={userAuthorities}
            titleAddButton='Add Authority'
            fields={fields}
            handleOpenAddPopup={handleOpenAddPopup}
            isOpenPopup={isOpen}
            closePopup={closePopup}
            handleSubmitOption={handleSubmitAuthority}
            initialData={{}}
            updateAuthority='AUTHORITY_UPDATE'
            handleViewDetails={handleViewDetails}
            rows={authorities}
            columns={[...columns,
            {
                field: 'moduleName',
                headerName: 'Module Name',
                width: 200,
                renderCell: (params: GridCellParams) => (
                    <span>{params.row.moduleResponse.moduleName}</span>
                )
            },
            {
                field: 'libelleAT',
                headerName: 'Authority Type',
                width: 200,
                renderCell: (params: GridCellParams) => (
                    <span>{params.row.authorityTypeResponse.libelle}</span>
                )
            }]}
            isOpenSnackbar={isOpenSnackbar}
            severity={snackbarSeverity}
            closeSnackbar={closeSnackbar}
            snackbarText={snackbarMsg}
        />
    )
}

export default Authorities