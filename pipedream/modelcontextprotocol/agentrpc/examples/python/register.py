import os
import asyncio
from agentrpc import AgentRPC

async def main():
    rpc = AgentRPC(
        api_secret=os.environ.get("AGENTRPC_API_SECRET", ""),
    )

    # Define the handler function for the tool
    def get_python_weather(location: str) -> dict:
        print(f"Python function called for location: {location}")
        return {
            "location": location,
            "temperature": "sunny",
            "precipitation": "none",
        }

    # Register the tool with AgentRPC
    # Note: The schema definition here is a standard JSON schema dictionary.
    # The SDK will handle the conversion to the required format.
    rpc.register(
        name="getPythonWeather",
        description="Return weather information from a Python function",
        schema={"type": "object", "properties": {"location": {"type": "string"}}},
        handler=get_python_weather,
    )

    print("Starting Python listener...")
    await rpc.listen()

if __name__ == "__main__":
    print("Python AgentRPC server starting...")
    asyncio.run(main())
