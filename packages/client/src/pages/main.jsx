import { createRoot } from 'react-dom/client';
import {QueryClient, QueryClientProvider} from "react-query";
import {BrowserRouter} from "react-router-dom";
import {UserProvider} from "../provider/UserContext.jsx";
import App from './App.jsx';
import './index.scss';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import {createTheme, MantineProvider} from "@mantine/core";
import '@mantine/notifications/styles.css';
import {ModalsProvider} from "@mantine/modals";

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

createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient} contextSharing={true}>
        <MantineProvider theme={theme}>
           <ModalsProvider>
               <UserProvider>
                   <BrowserRouter>
                       <App/>
                   </BrowserRouter>
               </UserProvider>
           </ModalsProvider>
        </MantineProvider>
    </QueryClientProvider>,
);