import React, { useEffect, useState } from 'react';
import { DollarOutlined, SwapOutlined } from '@ant-design/icons';
import { Modal, Input, InputNumber, Radio, Space } from 'antd';
import { useContractWrite, useWaitForTransaction, usePrepareContractWrite } from 'wagmi';
import { sepolia } from 'wagmi/chains';

import ABI from '../abi.json';

const RequestAndPay = ({ requests, getNameAndBalance }) => {
    const [payId, setPayId] = useState();
    const [payModal, setPayModal] = useState(false);
    const [requestModal, setRequestModal] = useState(false);
    const [requestAmount, setRequestAmount] = useState(0);
    const [requestAddress, setRequestAddress] = useState('');
    const [requestMessage, setRequestMessage] = useState('');

    const { config: configPayRequest } = usePrepareContractWrite({
        chainId: sepolia.id,
        address: process.env.REACT_APP_CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'payRequest',
        args: [payId],
        overrides: {
            value: requests['1']?.[payId],
        },
    });

    const { write: writePayRequest, data: payRequestData } = useContractWrite(configPayRequest);

    const { isSuccess: isPayRequestSuccess } = useWaitForTransaction({
        hash: payRequestData?.hash,
    });

    const { config: configCreateRequest } = usePrepareContractWrite({
        chainId: sepolia.id,
        address: process.env.REACT_APP_CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'createRequest',
        args: [requestAddress, requestAmount * 1e18, requestMessage],
    });

    const { write: writeCreateRequest, data: createRequestData } = useContractWrite(configCreateRequest);

    const { isSuccess: isCreateRequestSuccess } = useWaitForTransaction({
        hash: createRequestData?.hash,
    });

    const showPayModal = () => {
        setPayModal(true);
    };
    const hidePayModal = () => {
        setPayModal(false);
        setRequestAmount(0);
        setRequestAddress('');
        setRequestMessage('');
    };

    const showRequestModal = () => {
        setRequestModal(true);
    };
    const hideRequestModal = () => {
        setRequestModal(false);
        setRequestAmount(0);
        setRequestAddress('');
        setRequestMessage('');
    };

    useEffect(() => {
        if (isPayRequestSuccess || isCreateRequestSuccess) {
            console.log('success');
            getNameAndBalance();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPayRequestSuccess, isCreateRequestSuccess]);

    return (
        <>
            <Modal
                title="Confirm Payment"
                open={payModal}
                onOk={() => {
                    if (writePayRequest) {
                        writePayRequest?.();
                        hidePayModal();
                    }
                }}
                onCancel={() => {
                    hidePayModal();
                }}
                okText="Proceed To Pay"
                cancelText="Cancel"
            >
                {requests[0]?.length > 0 && (
                    <Radio.Group defaultValue={0} onChange={(e) => setPayId(e.target.value)} value={payId}>
                        <Space direction="vertical">
                            {requests[0].map((data, index) => (
                                <Radio value={index}>
                                    <div style={{ marginLeft: '20px' }}>
                                        <h2>Sending payment to {requests['3'][index]}</h2>
                                        <h3>Value: {requests['1'][index] / 1e18} SETH</h3>
                                        <p>"{requests['2'][index]}"</p>
                                    </div>
                                </Radio>
                            ))}
                        </Space>
                    </Radio.Group>
                )}
            </Modal>
            <Modal
                title="Request A Payment"
                open={requestModal}
                onOk={() => {
                    if (writeCreateRequest) {
                        writeCreateRequest?.();
                        hideRequestModal();
                    }
                }}
                onCancel={() => {
                    hideRequestModal();
                }}
                okText="Proceed To Request"
                cancelText="Cancel"
            >
                <p>Amount (SETH)</p>
                <InputNumber
                    value={requestAmount}
                    onChange={(val) => setRequestAmount(val)}
                    style={{ width: '100%' }}
                />
                <p>From (address)</p>
                <Input
                    placeholder="0x..."
                    value={requestAddress}
                    onChange={(val) => setRequestAddress(val.target.value)}
                />
                <p>Message</p>
                <Input
                    placeholder="Bill..."
                    value={requestMessage}
                    onChange={(val) => setRequestMessage(val.target.value)}
                />
            </Modal>
            <div className="requestAndPay">
                <div
                    className="quickOption"
                    onClick={() => {
                        if (requests['0']?.length > 0) showPayModal();
                        else alert("You don't have any requests to pay");
                    }}
                >
                    <DollarOutlined style={{ fontSize: '26px' }} />
                    Pay
                    {requests['0']?.length > 0 && <div className="numReqs">{requests['0'].length}</div>}
                </div>
                <div
                    className="quickOption"
                    onClick={() => {
                        showRequestModal();
                    }}
                >
                    <SwapOutlined style={{ fontSize: '26px' }} />
                    Request
                </div>
            </div>
        </>
    );
};

export default RequestAndPay;
