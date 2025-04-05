import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  financialHealthScore: integer("financial_health_score").default(50),
  portfolioValue: real("portfolio_value").default(0),
});

// Financial goals table schema
export const financialGoals = pgTable("financial_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  targetAmount: real("target_amount").notNull(),
  currentAmount: real("current_amount").default(0),
  targetDate: timestamp("target_date").notNull(),
  category: text("category").notNull(), // retirement, housing, education, travel, other
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Chat sessions table schema
export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Chat messages table schema
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => chatSessions.id),
  role: text("role").notNull(), // user or assistant
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Financial health data table schema
export const financialHealthData = pgTable("financial_health_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  savingsRate: real("savings_rate").notNull(),
  debtToIncome: real("debt_to_income").notNull(),
  emergencyFund: real("emergency_fund").notNull(),
  investmentRate: real("investment_rate").notNull(),
  score: integer("score"),
  recommendations: jsonb("recommendations"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Community discussions table schema
export const discussions = pgTable("discussions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  replyCount: integer("reply_count").default(0),
  viewCount: integer("view_count").default(0),
  status: text("status").default("new").notNull(), // new, active, expert_replied, resolved
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Discussion replies table schema
export const discussionReplies = pgTable("discussion_replies", {
  id: serial("id").primaryKey(),
  discussionId: integer("discussion_id").notNull().references(() => discussions.id),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isExpert: boolean("is_expert").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  email: true,
});

export const insertFinancialGoalSchema = createInsertSchema(financialGoals).pick({
  userId: true,
  name: true,
  targetAmount: true,
  currentAmount: true,
  targetDate: true,
  category: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).pick({
  userId: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  sessionId: true,
  role: true,
  content: true,
});

export const insertFinancialHealthDataSchema = createInsertSchema(financialHealthData).pick({
  userId: true,
  savingsRate: true,
  debtToIncome: true,
  emergencyFund: true,
  investmentRate: true,
  score: true,
  recommendations: true,
});

export const insertDiscussionSchema = createInsertSchema(discussions).pick({
  userId: true,
  title: true,
  content: true,
  status: true,
});

export const insertDiscussionReplySchema = createInsertSchema(discussionReplies).pick({
  discussionId: true,
  userId: true,
  content: true,
  isExpert: true,
});

// Typescript types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertFinancialGoal = z.infer<typeof insertFinancialGoalSchema>;
export type FinancialGoal = typeof financialGoals.$inferSelect;

export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type InsertFinancialHealthData = z.infer<typeof insertFinancialHealthDataSchema>;
export type FinancialHealthData = typeof financialHealthData.$inferSelect;

export type InsertDiscussion = z.infer<typeof insertDiscussionSchema>;
export type Discussion = typeof discussions.$inferSelect;

export type InsertDiscussionReply = z.infer<typeof insertDiscussionReplySchema>;
export type DiscussionReply = typeof discussionReplies.$inferSelect;
