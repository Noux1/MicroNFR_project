import {
    create
} from "zustand";
import { AuthorityType } from "./AuthorityTypeStore";
import axiosInstance from "../../utils/AxiosInstance";



export type Authority = {
    id: number,
    libelle: string,
    actif: boolean,
    authorityTypeId: number,
    moduleId: number
    authorityTypeResponse?: AuthorityType
}
export type AuthorityState = {
    authorities: Authority[],
    setAuthority: (authorities: Authority[]) => void
    addAuthority: (authority: Authority) => void,
    updateAuthority: (id: number, updatedAuthority: Authority) => void,
    deleteAuthority: (id: number) => void,
    getAuthorities: () => Promise<void>
}

export const useAuthorityStore = create<AuthorityState>((set) => (
    {
        authorities: [],
        setAuthority: (authorities) => {
            set({ authorities: authorities })
        },
        addAuthority: async (authority) => {
            try {
                const response = await axiosInstance.post(`/authority`, authority)
                const newAuthority = response.data
                set((state) => (
                    {
                        authorities: [...state.authorities, newAuthority]
                    }
                ))
                console.log(newAuthority)
            }
            catch (error) {

            }
        },
        updateAuthority: async (id, updatedAuthority) => {
            try {
                const response = await axiosInstance.put(`/authority/${id}`, updatedAuthority)
                const authorityToUpdate = response.data
                set((state) => (
                    {
                        authorities: state.authorities.map((authority) =>
                            authority.id === id ? authorityToUpdate : authority)
                    }
                ))
            }
            catch (error) {

            }
        },
        deleteAuthority: async (id) => {
            try {
                await axiosInstance.delete(`/authority/${id}`)
                set((state) => (
                    {
                        authorities: state.authorities.filter((authority) => authority.id !== id)
                    }
                ))
            }
            catch (error) {

            }
        },
        getAuthorities: async () => {
            try {
                const response = axiosInstance.get('/authority')
                const authorities = (await response).data
                set({ authorities })
            } catch (error) {

            }
        }
    }
))

