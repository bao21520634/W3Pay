import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Modal, Input } from 'antd';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { sepolia } from 'wagmi/chains';

import seth from '../seth.jpeg';

import ABI from '../abi.json';

const AccountDetails = ({ address, name, balance, getNameAndBalance }) => {
    const [username, setUsername] = useState('');
    const [usernameModal, setUsernameModal] = useState(false);

    const { config: configAddName } = usePrepareContractWrite({
        chainId: sepolia.id,
        address: process.env.REACT_APP_CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'addName',
        args: [username],
    });

    const { write: writeAddName, data: addNameData } = useContractWrite(configAddName);

    const { isSuccess: isAddNameSuccess } = useWaitForTransaction({
        hash: addNameData?.hash,
    });

    const hideUsernameModal = () => {
        setUsernameModal(false);
        setUsername('');
    };

    useEffect(() => {
        if (isAddNameSuccess) {
            console.log('success');
            getNameAndBalance();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAddNameSuccess]);

    return (
        <>
            <Modal
                title="Set Username"
                open={usernameModal}
                onOk={() => {
                    writeAddName?.();
                    hideUsernameModal();
                }}
                onCancel={() => {
                    hideUsernameModal();
                }}
                okText="Confirm"
                cancelText="Cancel"
            >
                <p>Username</p>
                <Input placeholder={name} value={username} onChange={(val) => setUsername(val.target.value)} />
            </Modal>
            <Card title="Account Details" style={{ width: '100%' }}>
                <div className="accountDetailRow">
                    <UserOutlined style={{ color: '#767676', fontSize: '25px' }} />
                    <div>
                        <div className="accountDetailHead"> {name} </div>
                        <div className="accountDetailBody">
                            Address: {address.slice(0, 4)}...{address.slice(38)}
                        </div>
                    </div>
                </div>
                <div className="accountDetailRow">
                    <img src={seth} alt="maticLogo" width={25} />
                    <div>
                        <div className="accountDetailHead"> Native Sepolia SETH Tokens</div>
                        <div className="accountDetailBody">{balance} SETH</div>
                    </div>
                </div>
                <div className="balanceOptions">
                    <div className="extraOption" onClick={() => setUsernameModal(true)}>
                        Set Username
                    </div>
                </div>
            </Card>
        </>
    );
};

export default AccountDetails;
