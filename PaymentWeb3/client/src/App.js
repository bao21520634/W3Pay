import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Layout, Button } from 'antd';

import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

import CurrentBalance from './components/CurrentBalance';
import RequestAndPay from './components/RequestAndPay';
import AccountDetails from './components/AccountDetails';
import RecentActivity from './components/RecentActivity';

const { Header, Content } = Layout;

const App = ({ chains }) => {
    const [name, setName] = useState('...');
    const [balance, setBalance] = useState('...');
    const [dollars, setDollars] = useState('...');
    const [history, setHistory] = useState(null);
    const [requests, setRequests] = useState({ 1: [0], 0: [] });

    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const { connect } = useConnect({
        connector: new MetaMaskConnector({ chains }),
    });

    const getNameAndBalance = async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/getNameAndBalance`, {
            params: {
                userAddress: address,
            },
        });

        const data = res.data;
        console.log(data);

        if (data.name[1]) {
            setName(data.name[0]);
        }
        setBalance(String(data.balance));
        setDollars(String(data.dollars));
        setHistory(data.history);
        setRequests(data.requests);
    };

    const handleDisconnect = () => {
        disconnect();

        setName('...');
        setBalance('...');
        setDollars('...');
        setHistory(null);
        setRequests({});
    };

    useEffect(() => {
        if (isConnected) getNameAndBalance();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected]);

    return (
        <div className="App">
            <Layout>
                <Header className="header">
                    <div className="headerLeft"></div>
                    {isConnected ? (
                        <Button type={'primary'} onClick={handleDisconnect}>
                            Disconnect Wallet
                        </Button>
                    ) : (
                        <Button
                            type={'primary'}
                            onClick={() => {
                                connect();
                            }}
                        >
                            Connect Wallet
                        </Button>
                    )}
                </Header>
                <Content className="content">
                    {isConnected ? (
                        <>
                            <div className="firstColumn">
                                <CurrentBalance dollars={dollars} />
                                <RequestAndPay requests={requests} getNameAndBalance={getNameAndBalance} />
                                <AccountDetails
                                    address={address}
                                    name={name}
                                    balance={balance}
                                    getNameAndBalance={getNameAndBalance}
                                />
                            </div>
                            <div className="secondColumn">
                                <RecentActivity history={history} />
                            </div>
                        </>
                    ) : (
                        <div>You are not connected to the wallet yet. Please login</div>
                    )}
                </Content>
            </Layout>
        </div>
    );
};

export default App;
