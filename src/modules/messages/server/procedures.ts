import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z} from "zod";
export const messagesRouter = createTRPCRouter({
    getMany: baseProcedure
    .query( async () =>{
        const messages = await prisma.message.findMany({
            orderBy:{
                updatedAt: "asc"
            },
            include: {
                fragment: true,
            }
        });
        return messages;
    }),
    create: baseProcedure
    .input(
        z.object({
            value: z.string().min(1, {message: "Value cannot be empty"})
            .max(1000, { message: "Value cannot be longer than 1000 characters" }),
            projectId: z.string().min(1, { message: "Project ID cannot be empty" }),

}),
 )
 .mutation(async ({ input }) => {
    const createdMessage =await prisma.message.create({
        data: {
            projectId: input.projectId,
            content: input.value,
            role: "USER",
            type: "RESULT",
        }

    });
    await inngest.send({
        name:"code-agent/run",
        data: {
            value: input.value,
            projectId: input.projectId,
        }
    })
    return createdMessage;
 })
});
