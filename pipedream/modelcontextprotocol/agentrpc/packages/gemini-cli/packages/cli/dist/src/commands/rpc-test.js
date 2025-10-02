import { JSONRPCClient } from 'json-rpc-2.0';
import fetch from 'node-fetch';
export const rpcTestCommand = {
    command: 'rpc-test',
    describe: 'Run a test of the JSON-RPC client',
    handler: async () => {
        console.log('Running JSON-RPC test...');
        const client = new JSONRPCClient((jsonRPCRequest) => fetch('http://localhost:3010/v1/test-uuid', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(jsonRPCRequest),
        }).then((response) => {
            if (response.status === 200) {
                // Use client.receive when you received a JSON-RPC response.
                return response
                    .json()
                    .then((jsonRPCResponse) => client.receive(jsonRPCResponse));
            }
            else if (response.status === 204) {
                // No content
                return;
            }
            return;
        }));
        try {
            const result = await client.request('initialize', {
                capabilities: {},
                clientInfo: { name: 'gemini-cli-test' },
                workspaceFolders: [],
                trace: 'off',
            });
            console.log('RPC Result:', result);
        }
        catch (error) {
            console.error('RPC Error:', error);
        }
    },
};
//# sourceMappingURL=rpc-test.js.map