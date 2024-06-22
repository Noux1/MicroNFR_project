import { create } from 'zustand';
import { axiosInstance } from '../../utils/AxiosInstance';

export type Module = {
    id: number;
    moduleName: string;
    moduleCode: string;
    color: string;
    icon: string;
    uri: string;
    actif: boolean;
};

export type ModuleState = {
    modules: Module[];
    setModule: (modules: Module[]) => void;
    addModule: (module: Module) => Promise<void>;
    updateModule: (id: number, updatedModule: Module) => Promise<void>;
    deleteModule: (id: number) => Promise<void>;
    getModules: () => Promise<void>;
};

export const useModuleStore = create<ModuleState>((set) => ({
    modules: [],
    setModule: (modules) => set({ modules }),
    addModule: async (module) => {
        try {
            const response = await axiosInstance.post('/module', module);
            const newModule = response.data;
            set((state) => ({
                modules: [...state.modules, newModule],
            }));
        } catch (error) {

        }
    },
    updateModule: async (id, updatedModule) => {
        try {
            const response = await axiosInstance.put(`/module/${id}`, updatedModule);
            const moduleToUpdate = response.data;
            set((state) => ({
                modules: state.modules.map((module) =>
                    module.id === id ? moduleToUpdate : module
                ),
            }));
        } catch (error) {

        }
    },
    deleteModule: async (id) => {
        try {
            await axiosInstance.delete(`/module/${id}`);
            set((state) => ({
                modules: state.modules.filter((module) => module.id !== id),
            }));
        } catch (error) {

        }
    },
    getModules: async () => {
        try {
            const response = await axiosInstance.get('/module/all');
            const modules = response.data;
            set({ modules });
        } catch (error) {

        }
    },
}));

