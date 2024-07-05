import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { configureChains, WagmiConfig, createClient } from 'wagmi';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { sepolia } from '@wagmi/chains';

const { chains, provider, webSocketProvider } = configureChains(
    [sepolia],
    [alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_API_KEY }), publicProvider()],
);

const client = createClient({
    autoConnect: true,
    provider,
    webSocketProvider,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <WagmiConfig client={client}>
            <App chains={chains} />
        </WagmiConfig>
    </React.StrictMode>,
);
