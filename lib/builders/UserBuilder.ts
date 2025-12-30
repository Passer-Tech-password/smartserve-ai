import { UserProfile } from "@/lib/users";

export class UserBuilder {
  private user: Partial<UserProfile>;

  constructor() {
    this.user = {
      role: "customer",
      createdAt: new Date(),
    };
  }

  withUid(uid: string): UserBuilder {
    this.user.uid = uid;
    return this;
  }

  withEmail(email: string): UserBuilder {
    this.user.email = email;
    return this;
  }

  withRole(role: "admin" | "agent" | "customer"): UserBuilder {
    this.user.role = role;
    return this;
  }

  withName(name: string): UserBuilder {
    this.user.name = name;
    return this;
  }

  build(): UserProfile {
    if (!this.user.uid) throw new Error("User uid is required");
    if (!this.user.email) throw new Error("User email is required");
    return this.user as UserProfile;
  }
}
