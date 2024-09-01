import { ThemeProvider } from "@emotion/react";
import { Box, CircularProgress, CssBaseline, createTheme, useMediaQuery, useTheme } from "@mui/material";
import Navbar from "./components/Common/Common/Navbar";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Common/Common/Footer";
import NotFound from "./pages/Errors/NotFound";
import Reporting from "./pages/Reporting/Reporting";
import Event from "./pages/Auditing/Event";
import Events from "./pages/Auditing/Events";
import Roles from "./pages/Authorization/Roles";
import AuthorityTypes from "./pages/Authorization/AuthorityTypes";
import Authorities from "./pages/Authorization/Authorities";
import Modules from "./pages/Authorization/Modules";
import Users from "./pages/Authorization/Users";
import { useEffect } from "react";
import { useModeStore, useStyleStore } from "./store/CommonStore/StyleStore";
import Sidebar from "./components/Common/Common/Sidebar";
import { useKeycloakStore } from "./store/AuthStore/KeycloakStore";
import Groups from "./pages/Authorization/Groups";
import Notifications from "./pages/Notification/Notifications";
import NotificationPage from './pages/Notification/NotificationPage';
import Home from "./pages/Home/Home";
import UserDetail from "./pages/Authorization/UserDetail";
import GroupDetail from "./pages/Authorization/GroupDetail";
import ModuleDetail from "./pages/Authorization/ModuleDetail";
import AuthorityDetail from "./pages/Authorization/AuthorityDetail";
import AuthorityTypeDetail from "./pages/Authorization/AuthorityTypeDetail";
import RoleDetail from "./pages/Authorization/RoleDetail";
import Unauthorized from "./pages/Errors/Unauthorized";


const lightTheme = createTheme({
    palette: {
        mode: 'light',

    },
    typography: {
        fontFamily: 'Nunito, sans serif'
    }
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#283042'
        }
    },
    typography: {
        fontFamily: 'Nunito, sans serif'
    }
})
function App() {
    const { openSidebar, setOpenSidebar } = useStyleStore();

    const { mode } = useModeStore();

    localStorage.setItem('mode', mode === "light" ? "light" : "dark")

    const { initKeycloak, authenticated } = useKeycloakStore()

    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

    useEffect(() => {
        // Initialize Keycloak and check authentication
        initKeycloak()
    }, [initKeycloak]);

    useEffect(() => {
        setOpenSidebar(!isSmallScreen);
    }, [isSmallScreen, setOpenSidebar]);

    if (!authenticated) {
        return (
            <Box sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <CircularProgress />
            </Box>
        );
    };


    return (
        <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
            <CssBaseline />
            <Box className="font-signature" sx={{ display: 'flex', width: '100%' }}>
                <Box sx={{ width: openSidebar ? '235px' : '50px', transition: 'width 0.3s' }}>
                    <Sidebar />
                </Box>
                <Box sx={{ flexGrow: 1, width: '80%' }}>
                    < Navbar />
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/admin/users' element={<Users />} />
                        <Route path='/admin/users/:id' element={<UserDetail />} />
                        <Route path='/admin/groups' element={<Groups />} />
                        <Route path='/admin/groups/:id' element={<GroupDetail />} />
                        <Route path='/admin/modules' element={<Modules />} />
                        <Route path='/admin/modules/:id' element={<ModuleDetail />} />
                        <Route path='/admin/authorities' element={<Authorities />} />
                        <Route path='/admin/authorities/:id' element={<AuthorityDetail />} />
                        <Route path='/admin/authorityTypes' element={<AuthorityTypes />} />
                        <Route path='/admin/authorityTypes/:id' element={<AuthorityTypeDetail />} />
                        <Route path='/admin/roles' element={<Roles />} />
                        <Route path='/admin/roles/:id' element={<RoleDetail />} />
                        <Route path='/audit/events' element={<Events />} />
                        <Route path='/audit/events/:eventId' element={<Event />} />
                        <Route path='/reporting' element={<Reporting />} />
                        <Route path='/notifications' element={<Notifications />} />
                        <Route path='/notifications/:id' element={<NotificationPage />} />
                        <Route path='*' element={<NotFound />} />
                        <Route path="/unauthorised" errorElement={<Unauthorized />} />
                    </Routes>
                    <Footer />
                </Box>

            </Box >
        </ThemeProvider >
    );
}

export default App;