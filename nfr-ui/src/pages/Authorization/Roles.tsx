import { Box, Chip, Stack, Typography } from '@mui/material'
import { DataGrid, GridCellParams } from '@mui/x-data-grid'
import { useEffect, useMemo, useState } from 'react'
import ButtonForm from '../../components/Common/Reusable-components/ButtonForm'
import { usePopupStore, useSnackbarStore } from '../../store/CommonStore/StyleStore'
import Popup from '../../components/Common/Reusable-components/Popup'
import ButtonMore from '../../components/Common/Reusable-components/ButtonMore'
import { useRoleStore } from '../../store/AdminStore/RoleStore'
import { useModuleStore } from '../../store/AdminStore/ModuleStore'
import axiosInstance from '../../utils/AxiosInstance'
import SnackBar from '../../components/Common/Reusable-components/SnackBar'
import { useNavigate } from 'react-router-dom'
import { useKeycloakStore } from '../../store/AuthStore/KeycloakStore'
import Unauthorized from '../Errors/Unauthorized'


const Roles = () => {
    const columns = useMemo(() => [
        { field: 'libelle', headerName: 'Role', width: 200 },

    ], [])

    const { roles, addRole, updateRole, deleteRole, getRoles } = useRoleStore()
    const { modules, getModules } = useModuleStore()
    const { authorities: userAuthorities } = useKeycloakStore()

    useEffect(() => {
        getRoles()
        getModules()
    }, [getRoles, getModules])

    const fields = [
        {
            name: 'Role',
            label: 'Role',
            type: 'text',
            required: true
        },
        {
            name: 'Status',
            label: 'Status',
            type: 'switch',
            options: ['Activated', 'Desactivated']
        },
        {
            name: 'Module Name',
            label: 'Module Name',
            type: 'list',
            required: true,
            options: modules.map(module => module.moduleName)
        }
    ];
    const { isOpen, openPopup, closePopup } = usePopupStore();
    const [updateFormData, setUpdateFormData] = useState<Record<string, any>>({});
    const [updateRoleId, setUpdateRoleId] = useState<number | null>(null);
    const { isOpenSnackbar, openSnackbar, closeSnackbar } = useSnackbarStore()
    const [snackbarMsg, setSnackbarMsg] = useState<string>('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    const handleOpenAddPopup = () => {
        setUpdateFormData({}); // Clear any previous initial data
        openPopup();
    };


    const handleSubmitRole = async (formData: Record<string, any>) => {
        // Vérifier si le champ "Module Name" est défini dans le formulaire
        if (!formData['Module Name']) {
            console.error('Module Name is not selected');
            return; // Sortir de la fonction si aucun module n'est sélectionné
        }

        // Récupérer le module sélectionné
        const selectedModuleName = formData['Module Name'];
        const selectedModule = modules.find(module => module.moduleName === selectedModuleName);
        console.log(selectedModuleName)
        console.log(selectedModule)
        // Vérifier si un module correspondant a été trouvé
        if (!selectedModule) {
            console.error('Selected module not found');
            return; // Sortir de la fonction si aucun module correspondant n'est trouvé
        }

        // Récupérer l'ID du module sélectionné
        const moduleId = selectedModule.id;

        // Si c'est une mise à jour de rôle, récupérer l'ID du module du backend
        let moduleIdRec: number | null = null;
        if (updateRoleId !== null) {
            try {
                const response = await axiosInstance.get(`/module/${moduleId}`);
                moduleIdRec = response.data.id;
            } catch (error) {
                console.error('Error retrieving module ID from backend:', error);
                return; // Sortir de la fonction en cas d'erreur
            }
        }

        // Construire l'objet de rôle à envoyer au backend
        const roleData = {
            id: null,
            libelle: formData['Role'],
            moduleId: moduleIdRec !== null ? moduleIdRec : moduleId,
            actif: formData['Status'] === 'Activated'
        };

        // Envoyer la requête au backend pour ajouter ou mettre à jour le rôle
        try {
            await addRole(roleData);
            // eslint-disable-next-line
            openSnackbar();
            setSnackbarSeverity('success')
            setSnackbarMsg(`Role added successfully`);
            console.log('Role added/updated successfully');
        } catch (error) {
            console.error('Error adding/updating role:', error);
            // eslint-disable-next-line
            openSnackbar();
            setSnackbarSeverity('error')
            setSnackbarMsg(`Failed to add role`);
        }

        // Réinitialiser les états et fermer la popup
        setUpdateRoleId(null);
        setUpdateFormData({});
        closePopup();
    }

    const navigate = useNavigate()
    const handleViewDetails = (id: number) => {
        navigate(`/admin/roles/${id}`);
    };

    const handleDeleteRole = (id: number) => {
        deleteRole(id)
        // eslint-disable-next-line
        openSnackbar();
        setSnackbarSeverity('success')
        setSnackbarMsg(`Role removed successfully`);
    }

    console.log(roles)

    return (
        <>
            {userAuthorities.some(auth => auth.data === 'ROLE_VIEW_ALL' && auth.isGranted) ? (
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
                            }>Roles</Typography>
                            {userAuthorities.some(auth => auth.data === 'ROLE_CREATE' && auth.isGranted) && (<ButtonForm
                                text='Add Role'
                                fields={fields}
                                onSubmit={handleOpenAddPopup} />)}
                            <Popup
                                open={isOpen}
                                onClose={closePopup}
                                fields={fields}
                                onSubmit={handleSubmitRole}
                                initialData={updateFormData}
                            />
                            {/* <IconButton size='small' onClick={refreshEvents}><Refresh /></IconButton> */}
                        </Stack>

                        <DataGrid
                            columns={[
                                ...columns,
                                {
                                    field: 'moduleName',
                                    headerName: 'Module Name',
                                    width: 200,
                                    renderCell: (params: GridCellParams) => (
                                        <span>{params.row.moduleResponse.moduleName}</span>
                                    )
                                },
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
                                            handleDelete={userAuthorities.some(auth => auth.data === 'ROLE_DELETE' && auth.isGranted) && handleDeleteRole} />
                                    )
                                }
                            ]}
                            rows={roles.map((role, index) => ({ ...role, id: role.id }))} // Add unique IDs to each row
                            getRowId={(row) => row.id}
                            sx={{
                                fontFamily: 'Nunito, sans serif'
                            }}
                        />
                    </Box >
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

export default Roles