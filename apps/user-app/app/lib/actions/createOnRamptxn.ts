"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function createOnRampTransaction(amount: number, provider: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user?.id) {
        return {
            message: "Unauthenticated request",
        }
    }
    const token = Math.random().toString();
    const userId = session?.user.id;
    if(!userId) {
        return {
            message: "User not logged in"
        }
    }
    await prisma.onRampTransaction.create({
        data: {
            userId: Number(userId),
            amount: amount,
            status: "Processing",
            startTime: new Date(),
            provider: provider,
            token: token
        }
    });

    return {
        message: "OnRamp Transaction created successfully",
    }
}