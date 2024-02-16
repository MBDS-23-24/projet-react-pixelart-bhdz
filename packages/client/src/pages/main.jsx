import { createRoot } from 'react-dom/client';
import {QueryClient, QueryClientProvider} from "react-query";
import {BrowserRouter} from "react-router-dom";
import {UserProvider} from "../provider/UserContext.jsx";
import App from './App.jsx';
import './index.scss';
import '@mantine/core/styles.css';
import {createTheme, MantineProvider} from "@mantine/core";
import '@mantine/notifications/styles.css';

// Configuration du QueryClient
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
        },
        mutations: {
            retry: false,
        }
    },
});

// Configuration du thème Mantine
const theme = createTheme({
    colorScheme: 'light',
    primaryColor: 'blue',
    fontFamily: 'Inter, sans-serif',
    lineHeight: 1.6,
    fontFamilyMonospace: 'Fira Code, monospace',
    headings: {
        fontFamily: 'Inter, sans-serif',
    },
    defaultColorScheme: 'light',
    fontWeights: {
        normal: 400,
        bold: 700,
    },
});

createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient} contextSharing={true}>
        <MantineProvider theme={theme}>
            <UserProvider>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </UserProvider>
        </MantineProvider>
    </QueryClientProvider>,
);