import React from 'react';
import { Card } from 'antd';

const CurrentBalance = ({ dollars }) => {
    return (
        <Card title="Current Balance" style={{ width: '100%' }}>
            <div className="currentBalance">
                <div>$ {dollars}</div>
            </div>
        </Card>
    );
};

export default CurrentBalance;
