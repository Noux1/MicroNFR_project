import { create } from "zustand"
import axiosInstance from "../../utils/AxiosInstance";
import { Authority } from "./AuthorityStore";


export type Role = {
    id: number;
    libelle: string;
    actif: boolean;
    moduleId: number,
    authorityResponses?: any[]
}

export type RoleState = {
    roles: Role[],
    setRole: (roles: Role[]) => void
    addRole: (roles: Role) => void,
    updateRole: (id: number, updatedRole: Role) => void,
    deleteRole: (id: number) => void,
    getRoles: () => Promise<void>,
    getAuthoritiesRole: (id: number) => Promise<any>
    authoritiesRole: any[]
}

export const useRoleStore = create<RoleState>((set) => (
    {
        roles: [],
        authoritiesRole: [],
        setRole: (roles) => {
            set({ roles: roles })
        },
        addRole: async (role) => {
            try {
                const response = await axiosInstance.post(`/role/`, role)
                const newRole = response.data
                set((state) => (
                    {
                        roles: [...state.roles, newRole]
                    }
                ))
                console.log(newRole)
            }
            catch (error) {

            }
        },
        updateRole: async (id, updatedRole) => {
            try {
                const response = await axiosInstance.put(`/role/${id}`, updatedRole)
                const roleToUpdate = response.data
                set((state) => (
                    {
                        roles: state.roles.map((role) =>
                            role.id === id ? roleToUpdate : role)
                    }
                ))
            }
            catch (error) {

            }
        },
        deleteRole: async (id) => {
            try {
                await axiosInstance.delete(`/role/${id}`)
                set((state) => (
                    {
                        roles: state.roles.filter((role) => role.id !== id)
                    }
                ))
            }
            catch (error) {

            }
        },
        getRoles: async () => {
            try {
                const response = await axiosInstance.get('/role')
                const roles = response.data
                set({ roles })
            } catch (error) {

            }
        },
        getAuthoritiesRole: async (id) => {
            try {
                const response = await axiosInstance.get(`/role/${id}`)
                const auth = response.data.authorityResponses
                set({ authoritiesRole: auth })
                return auth
            } catch (error) {

            }
        }
    }
))

