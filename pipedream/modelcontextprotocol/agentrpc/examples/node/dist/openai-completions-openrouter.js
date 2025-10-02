"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("openai");
const agentrpc_1 = require("agentrpc");
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
});
const rpc = new agentrpc_1.AgentRPC({ apiSecret: process.env.AGENTRPC_API_SECRET });
const main = async () => {
    const tools = await rpc.OpenAI.getTools();
    const completion = await openai.chat.completions.create({
        model: 'google/gemini-2.0-flash-001',
        messages: [
            {
                role: 'user',
                content: 'What is the weather in Melbourne?',
            },
        ],
        tools,
    });
    const message = completion.choices[0]?.message;
    if (message?.tool_calls) {
        for (const toolCall of message.tool_calls) {
            console.log('Agent is calling Tool', toolCall.function.name);
            const result = await rpc.OpenAI.executeTool(toolCall);
            console.log(result);
        }
    }
};
main();
