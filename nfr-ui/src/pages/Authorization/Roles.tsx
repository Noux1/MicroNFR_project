import { GridCellParams } from '@mui/x-data-grid'
import { useEffect, useMemo, useState } from 'react'
import { usePopupStore, useSnackbarStore } from '../../store/CommonStore/StyleStore'
import { useRoleStore } from '../../store/AdminStore/RoleStore'
import { useModuleStore } from '../../store/AdminStore/ModuleStore'
import { useNavigate } from 'react-router-dom'
import { useKeycloakStore } from '../../store/AuthStore/KeycloakStore'
import Unauthorized from '../Errors/Unauthorized'
import DataTable from '../../components/Common/Reusable-components/AdminComponent/DataTable'
import { Box, CircularProgress } from '@mui/material'

const Roles = () => {
    const columns = useMemo(() => [
        { field: 'libelle', headerName: 'Role', width: 200 },
    ], []);

    const { roles, addRole, deleteRole, getRoles } = useRoleStore();
    const { modules, getModules } = useModuleStore();
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
            await getRoles();
            await getModules();
            setLoading(false);
        };
        fetchData();
    }, [getRoles, getModules]);

    const fields = [
        { name: 'Role', label: 'Role', type: 'text', required: true },
        { name: 'Status', label: 'Status', type: 'switch', options: ['Activated', 'Deactivated'] },
        { name: 'Module Name', label: 'Module Name', type: 'list', required: true, options: modules.map(module => module.moduleName) }
    ];

    const handleOpenAddPopup = () => {
        openPopup();
    };

    const handleSubmitRole = async (formData: Record<string, any>) => {
        const selectedModule = modules.find(module => module.moduleName === formData['Module Name']);
        if (!selectedModule) {
            console.error('Selected module not found');
            return;
        }

        const roleData = {
            id: null,
            libelle: formData['Role'],
            moduleId: selectedModule.id,
            actif: formData['Status'] === 'Activated'
        };

        try {
            await addRole(roleData);
            setSnackbarSeverity('success');
            setSnackbarMsg('Role added successfully');
            openSnackbar();
            closePopup();
        } catch (error) {
            console.error('Error adding role:', error);
            setSnackbarSeverity('error');
            setSnackbarMsg('Failed to add role');
            openSnackbar();
        }
    };

    const handleViewDetails = (id: number) => {
        navigate(`/admin/roles/${id}`);
    };

    const handleDeleteRole = async (id: number) => {
        try {
            await deleteRole(id);
            setSnackbarSeverity('success');
            setSnackbarMsg('Role deleted successfully');
            openSnackbar();
        } catch (error) {
            console.error('Error deleting role:', error);
            setSnackbarSeverity('error');
            setSnackbarMsg('Failed to delete role');
            openSnackbar();
        }
    };

    if (loading) {
        <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
        </Box>
    }
    else if (!userAuthorities.some(auth => auth.data === 'ROLE_VIEW_ALL' && auth.isGranted)) {
        return <Unauthorized />;
    }

    return (
        <DataTable
            title='Roles'
            createAuthority='ROLE_CREATE'
            userAuthorities={userAuthorities}
            titleAddButton='Add Role'
            fields={fields}
            handleOpenAddPopup={handleOpenAddPopup}
            isOpenPopup={isOpen}
            closePopup={closePopup}
            handleSubmitOption={handleSubmitRole}
            initialData={{}}
            updateAuthority='ROLE_UPDATE'
            deleteAuthority='ROLE_DELETE'
            handleViewDetails={handleViewDetails}
            handleDelete={handleDeleteRole}
            rows={roles}
            columns={[...columns,
            {
                field: 'moduleName',
                headerName: 'Module Name',
                width: 200,
                renderCell: (params: GridCellParams) => (
                    <span>{params.row.moduleResponse.moduleName}</span>
                )
            }]}
            isOpenSnackbar={isOpenSnackbar}
            severity={snackbarSeverity}
            closeSnackbar={closeSnackbar}
            snackbarText={snackbarMsg}
        />
    )
}

export default Roles