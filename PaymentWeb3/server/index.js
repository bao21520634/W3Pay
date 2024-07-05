const express = require('express');
const Moralis = require('moralis').default;
const app = express();
const cors = require('cors');
require('dotenv').config();

const convertHistoryArray = require('./utils/convertHistoryArray');

const port = 8000;
const ABI = require('./abi.json');

app.use(cors());
app.use(express.json());

app.get('/getNameAndBalance', async (req, res) => {
    const { userAddress } = req.query;

    const firstResponse = await Moralis.EvmApi.utils.runContractFunction({
        chain: process.env.CHAIN_ID,
        address: process.env.CONTRACT_ADDRESS,
        functionName: 'getMyName',
        abi: ABI,
        params: { _user: userAddress },
    });

    const jsonResponseName = firstResponse.raw;

    const secondResponse = await Moralis.EvmApi.balance.getNativeBalance({
        chain: process.env.CHAIN_ID,
        address: userAddress,
    });

    const jsonResponseBalance = (secondResponse.raw.balance / 1e18).toFixed(2);

    const thirdResponse = await Moralis.EvmApi.token.getTokenPrice({
        address: process.env.TOKEN_CONTRACT_ADDRESS,
    });

    const jsonResponseDollars = (thirdResponse.raw.usdPrice * jsonResponseBalance).toFixed(2);

    const fourthResponse = await Moralis.EvmApi.utils.runContractFunction({
        chain: process.env.CHAIN_ID,
        address: process.env.CONTRACT_ADDRESS,
        functionName: 'getMyHistory',
        abi: ABI,
        params: { _user: userAddress },
    });

    const jsonResponseHistory = convertHistoryArray(fourthResponse.raw);

    const fifthResponse = await Moralis.EvmApi.utils.runContractFunction({
        chain: process.env.CHAIN_ID,
        address: process.env.CONTRACT_ADDRESS,
        functionName: 'getMyRequests',
        abi: ABI,
        params: { _user: userAddress },
    });

    const jsonResponseRequests = fifthResponse.raw;

    const jsonResponse = {
        name: jsonResponseName,
        balance: jsonResponseBalance,
        dollars: jsonResponseDollars,
        history: jsonResponseHistory,
        requests: jsonResponseRequests,
    };

    return res.status(200).json(jsonResponse);
});

Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
}).then(() => {
    app.listen(port, () => {
        console.log(`Listening for API Calls`);
    });
});
