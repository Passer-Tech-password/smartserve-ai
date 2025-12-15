import { getMessages, sendMessage } from "@/lib/messages";

export default async function MessagesPage({ params }: any) {
  const messages = await getMessages(params.ticketId);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Messages</h1>

      <div className="mt-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className="p-3 bg-gray-100 rounded">
            <p>{msg.text}</p>
            <small>Sender: {msg.senderId}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
