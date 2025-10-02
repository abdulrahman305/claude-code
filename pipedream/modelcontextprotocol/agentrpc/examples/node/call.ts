import { AgentRPC } from 'agentrpc';

const rpc = new AgentRPC({
  apiSecret: process.env.AGENTRPC_API_SECRET!,
});

async function main() {
  console.log('Fetching registered tools...');
  // The python example uses rpc.openai.agents.get_tools()
  // Assuming a similar API for the typescript SDK.
  // This might need adjustment if the method name is different.
  const tools = await rpc.openai.agents.getTools();
  console.log('Found tools:', tools);
}

main().catch(console.error);
