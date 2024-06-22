import { useEffect, useMemo, useState } from 'react'
import { usePopupStore, useSnackbarStore } from '../../store/CommonStore/StyleStore';
import { useAuthorityStore } from '../../store/AdminStore/AuthorityStore';
import { Box, Chip, IconButton, Stack, Typography } from '@mui/material';
import ButtonForm from '../../components/Common/Reusable-components/ButtonForm';
import Popup from '../../components/Common/Reusable-components/Popup';
import { useAuthorityTypeStore } from '../../store/AdminStore/AuthorityTypeStore';
import { useModuleStore } from '../../store/AdminStore/ModuleStore';
import { DataGrid, GridCellParams } from '@mui/x-data-grid';

import axiosInstance from '../../utils/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import SnackBar from '../../components/Common/Reusable-components/SnackBar';
import { useKeycloakStore } from '../../store/AuthStore/KeycloakStore';
import Unauthorized from '../Errors/Unauthorized';


const Authorities = () => {
    const columns = useMemo(() => [
        { field: 'libelle', headerName: 'Authority', width: 200 },

    ], [])

    const { authorities, addAuthority, getAuthorities } = useAuthorityStore()
    const { modules, getModules } = useModuleStore()
    const { authorityTypes, getAuthorityTypes } = useAuthorityTypeStore()
    const { authorities: userAuthorities } = useKeycloakStore()

    useEffect(() => {
        getAuthorities()
        getModules()
        getAuthorityTypes()
    }, [getAuthorities, getModules, getAuthorityTypes])

    const fields = [
        {
            name: 'Authority',
            label: 'Authority',
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
        },
        {
            name: 'Authority Type',
            label: 'Authority Type',
            type: 'list',
            required: true,
            options: authorityTypes.map(authorityType => authorityType.libelle)
        }
    ];
    const { isOpen, openPopup, closePopup } = usePopupStore();
    const [updateFormData, setUpdateFormData] = useState<Record<string, any>>({});
    const [updateAuthorityId, setUpdateAuthorityId] = useState<number | null>(null);
    const { isOpenSnackbar, openSnackbar, closeSnackbar } = useSnackbarStore()
    const [snackbarMsg, setSnackbarMsg] = useState<string>('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    const handleOpenAddPopup = () => {
        setUpdateFormData({}); // Clear any previous initial data
        openPopup();
    };


    const handleSubmitAuthority = async (formData: Record<string, any>) => {
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

        if (!formData['Authority Type']) {
            console.error('Authority Type is not selected');
            return; // Sortir de la fonction si aucun module n'est sélectionné
        }

        // Récupérer le module sélectionné
        const selectedAuthorityType = formData['Authority Type'];
        const selectedAuthType = authorityTypes.find(authorityType => authorityType.libelle === selectedAuthorityType);

        // Vérifier si un module correspondant a été trouvé
        if (!selectedAuthType) {
            console.error('Selected authority type not found');
            return; // Sortir de la fonction si aucun module correspondant n'est trouvé
        }

        // Récupérer l'ID du module sélectionné
        const authorityTypeId = selectedAuthType.id;

        // Si c'est une mise à jour de rôle, récupérer l'ID du module du backend
        let authTypeIdRec: number | null = null;

        if (updateAuthorityId !== null) {
            try {
                const responseModule = await axiosInstance.get(`/module/${moduleId}`);
                moduleIdRec = responseModule.data.id;
                const responseAT = await axiosInstance.get(`/authorityType/${authorityTypeId}`);
                authTypeIdRec = responseAT.data.id;
            } catch (error) {
                console.error('Error retrieving authority type ID from backend:', error);
                return; // Sortir de la fonction en cas d'erreur
            }
        }

        // Construire l'objet de rôle à envoyer au backend
        const authorityData = {
            id: null,
            libelle: formData['Authority'],
            moduleId: moduleIdRec !== null ? moduleIdRec : moduleId,
            authorityTypeId: authTypeIdRec !== null ? authTypeIdRec : authorityTypeId,
            actif: formData['Status'] === 'Activated'
        };

        // Envoyer la requête au backend pour ajouter ou mettre à jour le rôle
        try {

            await addAuthority(authorityData);
            // eslint-disable-next-line
            openSnackbar();
            setSnackbarSeverity('success')
            setSnackbarMsg(`Authority added successfully`);
            console.log('Authority added/updated successfully');
        } catch (error) {
            console.error('Error adding/updating authority:', error);
            // eslint-disable-next-line
            openSnackbar();
            setSnackbarSeverity('error')
            setSnackbarMsg(`Failed to add Authority`);
        }

        // Réinitialiser les états et fermer la popup
        setUpdateAuthorityId(null);
        setUpdateFormData({});
        closePopup();
    }

    const navigate = useNavigate()
    const handleViewDetails = (id: number) => {
        navigate(`/admin/authorities/${id}`);
    };

    return (
        <>
            {userAuthorities.some(auth => auth.data === 'AUTHORITY_VIEW_ALL' && auth.isGranted) ? (
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
                            }>Authotrities</Typography>
                            {userAuthorities.some(auth => auth.data === 'AUTHORITY_CREATE' && auth.isGranted) && (<ButtonForm
                                text='Add authority'
                                fields={fields}
                                onSubmit={handleOpenAddPopup} />)}
                            <Popup
                                open={isOpen}
                                onClose={closePopup}
                                fields={fields}
                                onSubmit={handleSubmitAuthority}
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
                                    field: 'libelleAT',
                                    headerName: 'Authority Type',
                                    width: 200,
                                    renderCell: (params: GridCellParams) => (
                                        <span>{params.row.authorityTypeResponse.libelle}</span>
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
                                    field: 'viewDetails',
                                    headerName: 'View Details',
                                    width: 100,
                                    renderCell: (params: GridCellParams) => (
                                        <IconButton
                                            onClick={() => handleViewDetails(params.row.id)}
                                        >
                                            <Add />
                                        </IconButton>
                                    )
                                }
                            ]}
                            rows={authorities.map((authority, index) => ({ ...authority, id: authority.id }))} // Add unique IDs to each row
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

export default Authorities
