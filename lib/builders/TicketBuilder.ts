import { Ticket } from "@/lib/tickets";

export class TicketBuilder {
  private ticket: Partial<Ticket>;

  constructor() {
    this.ticket = {
      status: "open",
      createdAt: new Date(),
    };
  }

  withId(id: string): TicketBuilder {
    this.ticket.id = id;
    return this;
  }

  withTitle(title: string): TicketBuilder {
    this.ticket.title = title;
    return this;
  }

  withDescription(description: string): TicketBuilder {
    this.ticket.description = description;
    return this;
  }

  withStatus(status: "open" | "closed"): TicketBuilder {
    this.ticket.status = status;
    return this;
  }

  withCreatedBy(createdBy: string): TicketBuilder {
    this.ticket.createdBy = createdBy;
    return this;
  }

  withCreatedAt(createdAt: any): TicketBuilder {
    this.ticket.createdAt = createdAt;
    return this;
  }

  build(): Ticket {
    if (!this.ticket.title) throw new Error("Ticket title is required");
    if (!this.ticket.createdBy) throw new Error("Ticket createdBy is required");
    return this.ticket as Ticket;
  }
}
