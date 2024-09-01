import axios from 'axios';
import { useKeycloakStore } from '../store/AuthStore/KeycloakStore';

const createAxiosInstance = (baseURL) => {
    const instance = axios.create({
        baseURL: baseURL,
    });

    instance.interceptors.request.use(
        (config) => {
            const { token } = useKeycloakStore.getState();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const { keycloak } = useKeycloakStore.getState();

            if (error.response.status === 401 && !error.config._retry) {
                error.config._retry = true;
                try {
                    await keycloak.updateToken(30);
                    const { token } = useKeycloakStore.getState();
                    if (token) {
                        error.config.headers.Authorization = `Bearer ${token}`;
                        return axios(error.config);
                    }
                } catch (err) {
                    keycloak.login();
                }
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

// Create instances for different base URLs
export const axiosInstance = createAxiosInstance('http://localhost:7777/ms-admin/api/v1');
export const axiosInstance2 = createAxiosInstance('http://localhost:3030');
export const axiosInstance3 = createAxiosInstance('http://localhost:7777/ms-audit');




export default axiosInstance;
