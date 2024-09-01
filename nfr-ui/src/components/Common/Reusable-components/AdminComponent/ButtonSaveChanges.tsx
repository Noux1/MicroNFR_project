import { Button } from '@mui/material'
import React from 'react'

interface ButtonSaveChangesProps {
    userAuthorities: { data: string, isGranted: boolean }[],
    updateAuthority: string,
}

const ButtonSaveChanges: React.FC<ButtonSaveChangesProps> = ({ userAuthorities, updateAuthority }) => {
    return (
        <>
            {userAuthorities.some(auth => auth.data === updateAuthority && auth.isGranted) && (
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Save Changes
                </Button>
            )}
        </>
    )
}

export default ButtonSaveChanges