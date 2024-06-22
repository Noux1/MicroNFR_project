import { create } from 'zustand';
import { axiosInstance } from '../../utils/AxiosInstance';

export type AuthorityType = {
    id: number;
    libelle: string;
    actif: boolean;

};

type AuthorityTypeState = {
    authorityTypes: AuthorityType[];
    setAuthorityType: (authorityTypes: AuthorityType[]) => void;
    addAuthorityType: (authorityType: AuthorityType) => Promise<void>;
    updateAuthorityType: (id: number, updatedAuthorityType: AuthorityType) => Promise<void>;
    deleteAuthorityType: (id: number) => Promise<void>;
    getAuthorityTypes: () => void
};

export const useAuthorityTypeStore = create<AuthorityTypeState>((set) => ({
    authorityTypes: [],
    setAuthorityType: (authorityTypes) => {
        set({ authorityTypes });
    },

    addAuthorityType: async (authorityType) => {
        try {
            const response = await axiosInstance.post('/authorityType', authorityType);
            const newAuthorityType = response.data;
            set((state) => ({
                authorityTypes: [...state.authorityTypes, newAuthorityType]
            }));
        } catch (error) {

        }
    },

    updateAuthorityType: async (id, updatedAuthorityType) => {
        try {
            const response = await axiosInstance.put(`/authorityType/${id}`, updatedAuthorityType);
            const updatedType = response.data;
            set((state) => ({
                authorityTypes: state.authorityTypes.map((authorityType) =>
                    authorityType.id === id ? updatedType : authorityType
                )
            }));
        } catch (error) {

        }
    },

    deleteAuthorityType: async (id) => {
        try {
            await axiosInstance.delete(`/authorityType/${id}`);
            set((state) => ({
                authorityTypes: state.authorityTypes.filter((authorityType) => authorityType.id !== id)
            }));
        } catch (error) {

        }
    },
    getAuthorityTypes: async () => {
        try {
            const response = await axiosInstance.get('/authorityType')
            const authorityTypes = response.data
            set({ authorityTypes })
        } catch (error) {

        }
    }
}));
