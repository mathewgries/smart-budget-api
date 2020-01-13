import uuid from "uuid";
import * as dynamoDbLib from '../../libs/dynamodb-lib';
import { success, failure } from '../../libs/response-lib';

function formatAccount(data, event) {
    return {
        userId: event.requestContext.identity.cognitoIdentityId,
        accountId: uuid.v1(),
        name: data.name,
        description: data.description,
        balance: data.balance,
        createdAt: Date.now()
    };
}

export async function main(event, context) {
    const data = JSON.parse(event.body);
    const params = {
        TableName: process.env.tableName,
        Item: formatAccount(data, event)
    };

    try {
        await dynamoDbLib.call("put", params);
        return success(params.Item);
    } catch (e) {
        console.log(e);
        return failure({ status: false });
    }
}