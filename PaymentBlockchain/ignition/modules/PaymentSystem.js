const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('PaymentSystemModule', (m) => {
    const paymentSystem = m.contract('PaymentSystem');

    return { paymentSystem };
});
