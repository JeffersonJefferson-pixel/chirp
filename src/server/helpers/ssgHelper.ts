import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import { prisma } from "~/server/db";
import type { GetStaticProps } from "next";

export const generateSSGHelper = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: { prisma: prisma, userId: null },
    transformer: superjson,
  });
