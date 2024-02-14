import {StrictMode} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {QueryClient, QueryClientProvider} from "react-query";
import {BrowserRouter} from "react-router-dom";
import {UserProvider} from "../provider/UserContext.jsx";
import './index.css'
import '@mantine/core/styles.css';
import {createTheme, MantineProvider,} from "@mantine/core";
import '@mantine/notifications/styles.css';

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
})

const theme = createTheme({
    primaryColor: 'blue',
    fontFamily: 'Inter, sans-serif',
    lineHeight: 1.6,
    fontFamilyMonospace: 'Fira Code, monospace',
    headings: {
        fontFamily: 'Inter, sans-serif',
    },
    fontWeights: {
        normal: 400,
        bold: 700,
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient} contextSharing={true}>
        <MantineProvider theme={theme}>
            <UserProvider>
                <StrictMode>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </StrictMode>
            </UserProvider>
        </MantineProvider>
    </QueryClientProvider>,
)
