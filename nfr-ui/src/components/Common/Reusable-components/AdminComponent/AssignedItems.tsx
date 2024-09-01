import { Box, Button, FormControl, InputLabel, Select, SelectChangeEvent, Typography } from '@mui/material'
import React from 'react'

interface AssignedItemsProps {
    label: string,
    selectedItemId: number | null,
    removePermission: string,
    assignedItems: string[],
    itemsList: { id: string, libelle: string }[],
    userAuthorities: { data: string, isGranted: boolean }[],
    handleChange: (event: SelectChangeEvent<string> | React.ChangeEvent<{ name?: string; value: unknown }>, type?: 'authority' | 'module' | 'role') => void,
    handleRemove: () => void,
    handleToggle?: (id: number, grant: boolean) => void;
    togglePermissions?: { grant: string; revoke: string },
}

const AssignedItems: React.FC<AssignedItemsProps> = ({ label, removePermission, assignedItems, itemsList, userAuthorities, selectedItemId, handleChange, handleRemove, handleToggle, togglePermissions }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 400 }}>
                <InputLabel shrink htmlFor={`select-Assigned${label}`}>
                    Assigned {label}
                </InputLabel>
                <Select
                    native
                    value={assignedItems[0] || `Assigned ${label}`}
                    onChange={(event) => handleChange(event)}
                    label={`Assigned ${label}`}
                    inputProps={{
                        id: `select-Assigned${label}`,
                    }}
                >
                    <option value={`Assigned ${label}`} >Assigned {label}</option>
                    {itemsList.map((item) => (
                        <option key={item.id} value={item.libelle}>
                            {item.libelle}
                        </option>
                    ))}
                </Select>
            </FormControl>
            <Box>
                {selectedItemId && (
                    <Box>
                        <Typography variant="h6">{assignedItems[0]}</Typography>
                        {userAuthorities.some(auth => auth.data === removePermission && auth.isGranted) && (
                            <Button onClick={handleRemove}>Remove</Button>
                        )}
                        {handleToggle && togglePermissions && (
                            <>
                                {userAuthorities.some(auth => auth.data === togglePermissions.grant && auth.isGranted) && (
                                    <Button onClick={() => handleToggle(selectedItemId, true)}>Grant</Button>
                                )}
                                {userAuthorities.some(auth => auth.data === togglePermissions.revoke && auth.isGranted) && (
                                    <Button onClick={() => handleToggle(selectedItemId, false)}>Revoke</Button>
                                )}
                            </>
                        )}
                    </Box>
                )}
            </Box>
        </Box >
    )
}

export default AssignedItems