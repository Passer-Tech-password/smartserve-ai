type MessageBubbleProps = {
  text: string;
  isMe: boolean;
  isBot?: boolean;
};

export default function MessageBubble({
  text,
  isMe,
  isBot = false,
}: MessageBubbleProps) {
  return (
    <div className={`flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm leading-relaxed break-words
          ${
            isMe
              ? "bg-indigo-600 text-white rounded-br-sm"
              : isBot
              ? "bg-white dark:bg-gray-700 border dark:border-gray-600 text-gray-800 dark:text-white rounded-bl-sm"
              : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-bl-sm"
          }`}
      >
        {text}
      </div>
    </div>
  );
}
