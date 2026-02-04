import { serverTimestamp, FieldValue } from "firebase/firestore";

export interface Ticket {
  customerId: string;
  customerName: string | null;
  issue: string;
  status: "open" | "closed" | "in_progress";
  priority: "low" | "medium" | "high";
  assignedAgentId: string | null;
  createdAt: FieldValue;
  sentiment: string;
  suggestedDepartment: string;
  aiKeywords: string[];
}

export class TicketBuilder {
  private ticket: Partial<Ticket> = {
    status: "open",
    priority: "medium",
    assignedAgentId: null,
    sentiment: "neutral",
    suggestedDepartment: "general",
    aiKeywords: [],
  };

  constructor(customerId: string, issue: string) {
    this.ticket.customerId = customerId;
    this.ticket.issue = issue;
    this.ticket.createdAt = serverTimestamp();
  }

  setCustomerName(name: string | null): TicketBuilder {
    this.ticket.customerName = name;
    return this;
  }

  setSentiment(sentiment: string): TicketBuilder {
    this.ticket.sentiment = sentiment;
    return this;
  }

  setSuggestedDepartment(department: string): TicketBuilder {
    this.ticket.suggestedDepartment = department;
    return this;
  }

  setAiKeywords(keywords: string[]): TicketBuilder {
    this.ticket.aiKeywords = keywords;
    return this;
  }

  build(): Ticket {
    if (!this.ticket.customerId || !this.ticket.issue) {
      throw new Error("Ticket must have customerId and issue");
    }
    return this.ticket as Ticket;
  }
}
