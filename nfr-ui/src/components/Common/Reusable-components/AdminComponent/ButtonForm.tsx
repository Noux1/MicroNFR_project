import { Button } from '@mui/material'
import React from 'react'
// import { FormField } from './FormAdd'
import { usePopupStore } from '../../../../store/CommonStore/StyleStore';


interface ButtonFormProps {
    text: string,
    // fields: FormField[]
    // onSubmit: (formData: any) => void;
}

const ButtonForm: React.FC<ButtonFormProps> = ({ text }) => {
    const { openPopup } = usePopupStore()
    return (
        <>
            <Button color='primary' variant='contained' onClick={openPopup} sx={{ marginY: 2 }}>{text}</Button >
        </>
    )
}

export default ButtonForm