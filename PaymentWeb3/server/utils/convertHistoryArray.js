function convertHistoryArray(arr) {
    return arr
        .map((transaction, index) => ({
            key: (arr.length + 1 - index).toString(),
            type: transaction[0],
            amount: transaction[1] / 1e18,
            message: transaction[2],
            address: `${transaction[3].slice(0, 4)}...${transaction[3].slice(38)}`,
            subject: transaction[4],
        }))
        .reverse();
}

module.exports = convertHistoryArray;
