import { db } from './db';
import { eq } from 'drizzle-orm';
import { 
  users,
  financialGoals,
  chatSessions,
  chatMessages,
  financialHealthData,
  discussions,
  discussionReplies,
  type User,
  type InsertUser,
  type FinancialGoal,
  type InsertFinancialGoal,
  type ChatSession,
  type InsertChatSession,
  type ChatMessage,
  type InsertChatMessage,
  type FinancialHealthData,
  type InsertFinancialHealthData,
  type Discussion,
  type InsertDiscussion,
  type DiscussionReply,
  type InsertDiscussionReply
} from "@shared/schema";

// Enhanced interface with CRUD methods for all entities
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined>;
  
  // Financial goals operations
  getFinancialGoals(userId: number): Promise<FinancialGoal[]>;
  getFinancialGoal(id: number): Promise<FinancialGoal | undefined>;
  createFinancialGoal(goal: InsertFinancialGoal): Promise<FinancialGoal>;
  updateFinancialGoal(id: number, data: Partial<InsertFinancialGoal>): Promise<FinancialGoal | undefined>;
  deleteFinancialGoal(id: number): Promise<boolean>;
  
  // Chat operations
  getChatSessions(userId: number): Promise<ChatSession[]>;
  getChatSession(id: number): Promise<ChatSession | undefined>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatMessages(sessionId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Financial health data
  getFinancialHealthData(userId: number): Promise<FinancialHealthData | undefined>;
  createFinancialHealthData(data: InsertFinancialHealthData): Promise<FinancialHealthData>;
  updateFinancialHealthData(userId: number, data: Partial<InsertFinancialHealthData>): Promise<FinancialHealthData | undefined>;
  
  // Community discussions
  getDiscussions(): Promise<Discussion[]>;
  getDiscussion(id: number): Promise<Discussion | undefined>;
  createDiscussion(discussion: InsertDiscussion): Promise<Discussion>;
  getDiscussionReplies(discussionId: number): Promise<DiscussionReply[]>;
  createDiscussionReply(reply: InsertDiscussionReply): Promise<DiscussionReply>;
}

export class PostgresStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }
  
  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return result[0];
  }
  
  // Financial goals operations
  async getFinancialGoals(userId: number): Promise<FinancialGoal[]> {
    return await db.select().from(financialGoals).where(eq(financialGoals.userId, userId));
  }
  
  async getFinancialGoal(id: number): Promise<FinancialGoal | undefined> {
    const result = await db.select().from(financialGoals).where(eq(financialGoals.id, id)).limit(1);
    return result[0];
  }
  
  async createFinancialGoal(goal: InsertFinancialGoal): Promise<FinancialGoal> {
    const result = await db.insert(financialGoals).values(goal).returning();
    return result[0];
  }
  
  async updateFinancialGoal(id: number, data: Partial<InsertFinancialGoal>): Promise<FinancialGoal | undefined> {
    const result = await db.update(financialGoals).set(data).where(eq(financialGoals.id, id)).returning();
    return result[0];
  }
  
  async deleteFinancialGoal(id: number): Promise<boolean> {
    const result = await db.delete(financialGoals).where(eq(financialGoals.id, id)).returning();
    return result.length > 0;
  }
  
  // Chat operations
  async getChatSessions(userId: number): Promise<ChatSession[]> {
    return await db.select().from(chatSessions).where(eq(chatSessions.userId, userId));
  }
  
  async getChatSession(id: number): Promise<ChatSession | undefined> {
    const result = await db.select().from(chatSessions).where(eq(chatSessions.id, id)).limit(1);
    return result[0];
  }
  
  async createChatSession(session: InsertChatSession): Promise<ChatSession> {
    const result = await db.insert(chatSessions).values(session).returning();
    return result[0];
  }
  
  async getChatMessages(sessionId: number): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages).where(eq(chatMessages.sessionId, sessionId));
  }
  
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const result = await db.insert(chatMessages).values(message).returning();
    return result[0];
  }
  
  // Financial health data
  async getFinancialHealthData(userId: number): Promise<FinancialHealthData | undefined> {
    const result = await db.select().from(financialHealthData).where(eq(financialHealthData.userId, userId)).limit(1);
    return result[0];
  }
  
  async createFinancialHealthData(data: InsertFinancialHealthData): Promise<FinancialHealthData> {
    const result = await db.insert(financialHealthData).values(data).returning();
    return result[0];
  }
  
  async updateFinancialHealthData(userId: number, data: Partial<InsertFinancialHealthData>): Promise<FinancialHealthData | undefined> {
    const result = await db.update(financialHealthData).set(data).where(eq(financialHealthData.userId, userId)).returning();
    return result[0];
  }
  
  // Community discussions
  async getDiscussions(): Promise<Discussion[]> {
    return await db.select().from(discussions);
  }
  
  async getDiscussion(id: number): Promise<Discussion | undefined> {
    const result = await db.select().from(discussions).where(eq(discussions.id, id)).limit(1);
    return result[0];
  }
  
  async createDiscussion(discussion: InsertDiscussion): Promise<Discussion> {
    const result = await db.insert(discussions).values(discussion).returning();
    return result[0];
  }
  
  async getDiscussionReplies(discussionId: number): Promise<DiscussionReply[]> {
    return await db.select().from(discussionReplies).where(eq(discussionReplies.discussionId, discussionId));
  }
  
  async createDiscussionReply(reply: InsertDiscussionReply): Promise<DiscussionReply> {
    const result = await db.insert(discussionReplies).values(reply).returning();
    return result[0];
  }
}

export const storage = new PostgresStorage();
