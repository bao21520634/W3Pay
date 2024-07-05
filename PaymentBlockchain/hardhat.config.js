require('@nomicfoundation/hardhat-toolbox');
require('@nomicfoundation/hardhat-verify');

const dotenv = require('dotenv');

dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: '0.8.24',
    networks: {
        sepolia: {
            url: process.env.ETHERUM_SEPOLIA,
            accounts: [process.env.PRIVATE_KEY],
        },
    },
    etherscan: {
        apiKey: {
            sepolia: process.env.API_KEY,
        },
    },
};
