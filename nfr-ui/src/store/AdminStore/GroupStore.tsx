import { create } from "zustand"
import { axiosInstance } from "../../utils/AxiosInstance"

export type Group = {
    id: number,
    libelle: string,
    actif: boolean
}

export type GroupState = {
    groups: Group[],
    setGroup: (groups: Group[]) => void
    addGroup: (group: Group) => void,
    updateGroup: (id: number, updatedGroup: Group) => void,
    deleteGroup: (id: number) => void,
    getGroups: () => Promise<void>,
}

export const useGroupStore = create<GroupState>((set) => (
    {
        groups: [],
        setGroup: (groups) => {
            set({ groups })
        },
        addGroup: async (group) => {
            try {
                const response = await axiosInstance.post(`/group/`, group)
                const newGroup = response.data
                set((state) => (
                    {
                        groups: [...state.groups, newGroup]
                    }
                ))
                console.log(newGroup)
            }
            catch (error) {

            }
        },
        updateGroup: async (id, updatedGroup) => {
            try {
                const response = await axiosInstance.put(`/group/${id}`, updatedGroup)
                const groupToUpdate = response.data
                set((state) => (
                    {
                        groups: state.groups.map((group) =>
                            group.id === id ? groupToUpdate : group)
                    }
                ))
            }
            catch (error) {

            }
        },
        deleteGroup: async (id) => {
            try {
                await axiosInstance.delete(`/group/${id}`)
                set((state) => (
                    {
                        groups: state.groups.filter((group) => group.id !== id)
                    }
                ))
            }
            catch (error) {
            }
        },
        getGroups: async () => {
            try {
                const response = await axiosInstance.get('/group/all')
                const groups = response.data
                set({ groups })
            } catch (error) {

            }
        }
    }
))

