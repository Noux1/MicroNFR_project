import React from "react";
import { create } from "zustand";

type StyleState = {
    openSidebar: boolean,
    setOpenSidebar: (open: boolean) => void
}

export const useStyleStore = create<StyleState>((set) => ({
    openSidebar: true,
    setOpenSidebar: (open) => set({ openSidebar: open })
}));

type ModeState = {
    mode: 'dark' | 'light',
    setMode: () => void
}

export const useModeStore = create<ModeState>((set) => (

    {
        mode: (localStorage.getItem('mode') || "light") as 'light' | 'dark',
        setMode: () => {
            set((state) => (
                {
                    mode: state.mode === "light" ? "dark" : "light",

                }
            ))
        }
    }
)
)

type PopupState = {
    isOpen: boolean
    openPopup: () => void
    closePopup: () => void
}

export const usePopupStore = create<PopupState>((set) => (
    {
        isOpen: false,
        openPopup: () => set({ isOpen: true }),
        closePopup: () => set({ isOpen: false })
    }
))

type PopupEditUserState = {
    isOpenEdit: boolean
    openPopupEdit: () => void
    closePopupEdit: () => void
}

export const usePopupEditUserStore = create<PopupEditUserState>((set) => (
    {
        isOpenEdit: false,
        openPopupEdit: () => set({ isOpenEdit: true }),
        closePopupEdit: () => set({ isOpenEdit: false })
    }
))

type SnackbarState = {
    isOpenSnackbar: boolean
    openSnackbar: () => void
    closeSnackbar: () => void
}

export const useSnackbarStore = create<SnackbarState>((set) => (
    {
        isOpenSnackbar: false,
        openSnackbar: () => set({ isOpenSnackbar: true }),
        closeSnackbar: () => set({ isOpenSnackbar: false })
    }
))

type SearchState = {
    search: string
    onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void
}
export const useSearchStore = create<SearchState>((set) => (
    {
        search: '',
        onSearch: (event) => set({ search: event.target.value })
    }
))