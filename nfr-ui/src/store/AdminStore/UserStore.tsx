import { create } from "zustand";
import { setupSocket } from "../../socketFunctions";
import { axiosInstance } from "../../utils/AxiosInstance";
const socket = setupSocket();


export type User = {
    id: number;
    uuid?: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    actif: boolean;
    groupId: number,
    password?: string;
    temporary?: boolean;
    emailVerified?: boolean;
    requiredActions?: string[] | null;
    authorityResponses?: any[];
    moduleResponses?: any[];
    roleResponses?: any[]
    groupResponse?: any
}

export type UserState = {
    users: User[],
    user: User,
    setUsers: (users: User[]) => void,
    setUser: (user: User) => void,
    addUser: (user: User) => void,
    updateUser: (id: number, updatedUser: User) => void,
    deleteUser: (id: number) => void,
    getUsers: () => Promise<void>,
    getUserByUuid: (uuid: string) => Promise<User>,
    getUser: (id: number) => Promise<User>
    getAuthoritiesUser: (id: number) => Promise<any>
    authoritiesUser: any[]
    modulesUser: any[]
    rolesUser: any[]
}

const initialUser: User = {
    id: 0,
    uuid: "",
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    actif: false,
    groupId: 0
};

export const useUserStore = create<UserState>((set) => (
    {
        users: [],
        user: initialUser,
        authoritiesUser: [],
        modulesUser: [],
        rolesUser: [],
        setUsers: (users) => {
            set({ users: users })
        },
        setUser: (user) => {
            set({ user: user })
        },
        addUser: async (user) => {
            try {
                const response = await axiosInstance.post(`/user`, user);
                const newUser = response.data;
                set((state) => (
                    {
                        users: [...state.users, newUser]
                    }
                ));
                console.log(newUser);
            }
            catch (error) {

            }
        },
        updateUser: async (id, updatedUser) => {
            try {
                const response = await axiosInstance.put(`/user/${id}`, updatedUser);
                const userToUpdate = response.data;
                set((state) => (
                    {
                        users: state.users.map((user) =>
                            user.id === id ? userToUpdate : user)
                    }
                ));
            }
            catch (error) {

            }
        },
        deleteUser: async (id) => {
            try {
                await axiosInstance.delete(`/user/${id}`);
                set((state) => (
                    {
                        users: state.users.filter((user) => user.id !== id)
                    }
                ));
            }
            catch (error) {

            }
        },
        getUsers: async () => {
            try {
                const response = await axiosInstance.get('/user');
                const users = response.data;
                set({ users: users });
            } catch (error) {

            }
        },
        getUserByUuid: async (uuid: string) => {
            try {
                const response = await axiosInstance.get(`/user/uuid/${uuid}`);
                const user = response.data;
                set({ user: user });
                return user;  // Return the user data
            } catch (error) {

            }
            
        },
        getUser: async (id: number) => {
            try {
                const response = await axiosInstance.get(`/user/${id}`)
                const user = response.data
                const authoritiesUser = response.data.authorityResponses
                const modulesUser = response.data.moduleResponses
                const rolesUser = response.data.roleResponses
                set({ authoritiesUser: authoritiesUser, modulesUser: modulesUser, rolesUser: rolesUser })
                return user
            } catch (error) {


            }
        },
        getAuthoritiesUser: async (id: number) => {
            try {
                const response = await axiosInstance.get(`/user/${id}`)
                const auth = response.data.authorityResponses
                return auth
            } catch (error) {
            }
        }
    }

));
