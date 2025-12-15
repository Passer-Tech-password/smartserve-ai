import ChatBox from "@/components/ChatBox";

export default function AgentChatPage() {
  return (
    <div className="h-screen flex flex-col">
      <header className="p-4 bg-gray-900 text-white font-bold">
        Agent Live Chat
      </header>

      <ChatBox chatId="default-chat" />
    </div>
  );
}
