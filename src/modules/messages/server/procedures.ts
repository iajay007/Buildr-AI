import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";

export const messagesRouter = createTRPCRouter({
    getMany: protectedProcedure
        .input(
            z.object({
                projectId: z.string().min(1, { message: "Project ID is required" }),
            }),
        )
        .query(async ({ input, ctx }) => {
            const messages = await prisma.message.findMany({
                where: {
                    projectId: input.projectId,
                    project: {
                        userId: ctx.auth.userId,
                    }
                },
                include: {
                    fragment: true,
                },
                orderBy: {
                    updatedAt: "asc",
                },
            });
            return messages;
        }),
    create: protectedProcedure
        .input(
            z.object({
                value: z.string().min(1, { message: "Value is required" })
                    .max(10000, { message: "Value is too long" }),
                projectId: z.string().min(1, { message: "Project ID is required" }),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const existingProject = await prisma.project.findFirst({
                where: {
                    id: input.projectId,
                    userId: ctx.auth.userId,
                },
            });
            if (!existingProject) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" })
            }
            try {
                await consumeCredits();
            }
            catch (error) {
                if (error instanceof Error) {
                    // Real errors (DB issues, auth issues, etc.)
                    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" });
                } else {
                    // rate-limiter-flexible throws a RateLimiterRes object (not an Error) when points are exhausted
                    throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "You have run out of credits" });
                }
            }

            const createdMessage = await prisma.message.create({
                data: {
                    projectId: existingProject.id,
                    content: input.value,
                    role: "USER",
                    type: "RESULT",
                },
            });
            await inngest.send({
                name: "BuildrAgent/run",
                data: {
                    value: input.value,
                    projectId: existingProject.id,
                }
            });
            return createdMessage;
        }),

});