import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { inngest } from '@/inngest/client';
export const appRouter = createTRPCRouter({
    invoke : baseProcedure
        .input(
            z.object({
                text: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            await inngest.send({
                name: "test/hello.world",
                data: {
                    email: input.text,
                },
            });
            return { ok: "success"}
        }),
    hello: baseProcedure
        .input(
            z.object({
                text: z.string(),
            })      
        )
        .query(({ input }) => {
            return {
                greeting: `Hello ${input.text ?? 'world'}`,
            };
        }),
    });

    export type AppRouter = typeof appRouter;