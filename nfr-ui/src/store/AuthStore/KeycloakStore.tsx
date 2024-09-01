import create from 'zustand';
import Keycloak from 'keycloak-js';
import { useUserStore } from '../AdminStore/UserStore';

const keycloakConfig: Keycloak.KeycloakConfig = {
    url: 'http://localhost:8088/auth',
    realm: 'Nfr-realm',
    clientId: 'front-client',
};

const keycloak: Keycloak.KeycloakInstance = new Keycloak(keycloakConfig);

interface KeycloakState {
    keycloak: Keycloak.KeycloakInstance;
    token: string | null;
    authenticated: boolean;
    authorities: { data: string; isGranted: boolean }[];
    initKeycloak: () => void;
}

export const useKeycloakStore = create<KeycloakState>((set) => ({
    keycloak,
    token: null,
    authenticated: false,
    authorities: [],
    initKeycloak: () => {
        keycloak.init({ onLoad: 'login-required' }).then(async (auth) => {
            if (auth) {
                set({
                    authenticated: true,
                    token: keycloak.token || null,
                });
                console.log(keycloak.token);

                // Fetch user info and authorities
                try {
                    const userUuid = keycloak.tokenParsed?.sub; // Assuming the user ID is in the token
                    console.log(userUuid);
                    const { getUserByUuid } = useUserStore.getState();
                    const user = await getUserByUuid(userUuid);
                    console.log(user);

                    // Extraire les authorityResponses directement présents dans user
                    const directAuthorities = user.authorityResponses
                        .filter(auth => auth.authorityResponse.actif && auth.authorityResponse.moduleResponse.actif)
                        .map(auth => ({
                            data: auth.authorityResponse.libelle,
                            isGranted: auth.granted,
                        }));
                    console.log(directAuthorities);
                    // Extraire les autorités des rôles
                    const authoritiesFromRoles = user.roleResponses
                        .filter(role => role.actif && role.moduleResponse.actif) // Only consider active roles and modules
                        .flatMap(role => role.authorityResponses
                            .filter(roleAuth => roleAuth.actif && roleAuth.moduleResponse.actif) // Only consider active authorities and modules within roles
                            .map(roleAuth => ({
                                data: roleAuth.libelle,
                                isGranted: true, // Assuming role-based authorities are always granted
                            }))
                        );
                    console.log(authoritiesFromRoles);

                    // Combiner les deux tableaux
                    const combinedAuthorities = [...directAuthorities, ...authoritiesFromRoles];
                    console.log(combinedAuthorities);

                    // Mettre à jour l'état avec les autorités combinées
                    set({ authorities: combinedAuthorities });

                } catch (error) {
                    console.error('Error fetching user authorities:', error);
                }

                keycloak.onTokenExpired = () => {
                    keycloak.updateToken(30).then((refreshed) => {
                        if (refreshed) {
                            set({ token: keycloak.token });
                            console.log(keycloak.token);
                        } else {
                            console.warn('Token not refreshed, login required');
                        }
                    }).catch(() => {
                        console.error('Failed to refresh token');
                    });
                };
            } else {
                keycloak.login();
            }
        }).catch(console.error);
    },
}));
