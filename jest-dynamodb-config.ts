module.exports = {
    tables: [{
        TableName: 'signups',
        KeySchema: [
            {            
                AttributeName: 'ID',
                KeyType: 'HASH'
            }
        ],
        AttributeDefinitions: [
            {
                AttributeName: 'ID',
                AttributeType: 'S'
            }
        ],
        BillingMode: 'PAY_PER_REQUEST'
    }]
}