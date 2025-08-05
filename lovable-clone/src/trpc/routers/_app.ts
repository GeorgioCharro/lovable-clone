import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
export const appRouter = createTRPCRouter({
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