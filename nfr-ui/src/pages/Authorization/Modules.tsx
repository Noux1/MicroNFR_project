import { useEffect, useMemo, useState } from 'react'
import { useModuleStore } from '../../store/AdminStore/ModuleStore'
import { usePopupStore, useSnackbarStore } from '../../store/CommonStore/StyleStore'
import { useNavigate } from 'react-router-dom'
import { useKeycloakStore } from '../../store/AuthStore/KeycloakStore'
import Unauthorized from '../Errors/Unauthorized'
import DataTable from '../../components/Common/Reusable-components/AdminComponent/DataTable'
import { Box, CircularProgress } from '@mui/material'

const Modules = () => {
    const columns = useMemo(() => [
        { field: 'moduleName', headerName: 'Module Name', width: 150 },
        { field: 'moduleCode', headerName: 'Module Code', width: 150 },
        { field: 'color', headerName: 'Color', width: 100 },
        { field: 'icon', headerName: 'Icon', width: 100 },
        { field: 'uri', headerName: 'Uri', width: 150 },
    ], []);

    const { modules, addModule, deleteModule, getModules } = useModuleStore();
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
            await getModules();
            setLoading(false);
        };
        fetchData();
    }, [getModules]);

    const fields = [
        { name: 'Module Name', label: 'Module Name', type: 'text', required: true },
        { name: 'Module Code', label: 'Module Code', type: 'text', required: true },
        { name: 'Status', label: 'Status', type: 'switch', options: ['Activated', 'Deactivated'] },
        { name: 'Icon', label: 'Icon', type: 'text', required: true },
        { name: 'Uri', label: 'Uri', type: 'text', required: true },
        { name: 'Color', label: 'Color', type: 'text', required: true },
    ];

    const handleOpenAddPopup = () => {
        openPopup();
    };

    const handleSubmitModule = async (formData: Record<string, any>) => {
        const moduleData = {
            id: null,
            moduleName: formData['Module Name'],
            moduleCode: formData['Module Code'],
            color: formData['Color'],
            icon: formData['Icon'],
            uri: formData['Uri'],
            actif: formData['Status'] === 'Activated',
        };

        try {
            await addModule(moduleData);
            setSnackbarSeverity('success');
            setSnackbarMsg('Module added successfully');
            openSnackbar();
            closePopup();
        } catch (error) {
            setSnackbarSeverity('error');
            setSnackbarMsg('Failed to add module');
            openSnackbar();
        }
    };

    const handleViewDetails = (id: number) => {
        navigate(`/admin/modules/${id}`);
    };

    const handleDeleteModule = async (id: number) => {
        try {
            await deleteModule(id);
            setSnackbarSeverity('success');
            setSnackbarMsg('Module deleted successfully');
            openSnackbar();
        } catch (error) {
            setSnackbarSeverity('error');
            setSnackbarMsg('Failed to delete module');
            openSnackbar();
        }
    };

    if (loading) {
        <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
        </Box>
    }
    else if (!userAuthorities.some(auth => auth.data === 'MODULE_VIEW_ALL' && auth.isGranted)) {
        return <Unauthorized />;
    }

    return (
        <DataTable
            title='Modules'
            createAuthority='MODULE_CREATE'
            userAuthorities={userAuthorities}
            titleAddButton='Add Module'
            fields={fields}
            handleOpenAddPopup={handleOpenAddPopup}
            isOpenPopup={isOpen}
            closePopup={closePopup}
            handleSubmitOption={handleSubmitModule}
            initialData={{}}
            updateAuthority='MODULE_UPDATE'
            deleteAuthority='MODULE_DELETE'
            handleViewDetails={handleViewDetails}
            handleDelete={handleDeleteModule}
            rows={modules}
            columns={[...columns]}
            isOpenSnackbar={isOpenSnackbar}
            severity={snackbarSeverity}
            closeSnackbar={closeSnackbar}
            snackbarText={snackbarMsg}
        />
    )
}

export default Modules