import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const getUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();
  },
});

export const createUser = mutation({
  args: {
    email: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      ...args,
      username: args.email.split('@')[0], // Default username from email
      followersCount: 0,
      imageUrl: '',
      first_name: '',
      last_name: '',
      bio: '',
      location: '',
      websiteUrl: '',
    });
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    data: v.object({
      email: v.optional(v.string()),
      clerkId: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.userId, args.data);
  },
});

export const deleteUser = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.userId);
  },
});
