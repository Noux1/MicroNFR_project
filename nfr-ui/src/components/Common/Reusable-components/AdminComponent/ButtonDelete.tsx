import { Delete } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import React from 'react'

const ButtonDelete = ({ id, handleDelete }) => {
    return (
        <IconButton onClick={()=>handleDelete(id)
        }>
            <Delete />
        </IconButton >
    )
}

export default ButtonDelete