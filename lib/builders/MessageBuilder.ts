import { Message } from "@/lib/types";

export class MessageBuilder {
  private message: Partial<Message>;

  constructor() {
    this.message = {
      createdAt: new Date(),
    };
  }

  withId(id: string): MessageBuilder {
    this.message.id = id;
    return this;
  }

  withText(text: string): MessageBuilder {
    this.message.text = text;
    return this;
  }

  withSenderId(senderId: string): MessageBuilder {
    this.message.senderId = senderId;
    return this;
  }

  withCreatedAt(createdAt: any): MessageBuilder {
    this.message.createdAt = createdAt;
    return this;
  }

  build(): Message {
    if (!this.message.id) throw new Error("Message id is required");
    if (!this.message.text) throw new Error("Message text is required");
    if (!this.message.senderId) throw new Error("Message senderId is required");
    return this.message as Message;
  }
}
