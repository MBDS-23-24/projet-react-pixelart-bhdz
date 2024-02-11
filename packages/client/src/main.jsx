import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {QueryClient, QueryClientProvider} from "react-query";
import {PrimeReactProvider} from "primereact/api";
import "primereact/resources/themes/md-light-indigo/theme.css";
import {BrowserRouter} from "react-router-dom";

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

ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient} contextSharing={true}>
        <PrimeReactProvider>
            <React.StrictMode>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </React.StrictMode>
        </PrimeReactProvider>
    </QueryClientProvider>,
)
