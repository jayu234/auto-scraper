import 'server-only';

import { getCreditsPack, PackId } from "@/types/billing";
import Stripe from "stripe";
import prisma from "../prisma";

export async function HandleCheckoutSessionCompleted(event: Stripe.Checkout.Session) {
  if(!event.metadata) {
    throw new Error("Missing metadata");
  }

  const { userId, packId } = event.metadata;
  if(!userId) {
    throw new Error("Missing userId");
  }
  if(!packId) {
    throw new Error("Missing packId");
  }

  const purchasedPack = getCreditsPack(packId as PackId);
  if(!purchasedPack) {
    throw new Error("Invalid packId");
  }

  await prisma.userBalance.upsert({
    where: { userId },
    create: {
      userId,
      credits: purchasedPack.credits,
    },
    update: {
      credits: {
        increment: purchasedPack.credits,
      }
    }
  });

  await prisma.userPurchase.create({
    data: {
      userId,
      stripeId: event.id,
      description: `${purchasedPack.name} - ${purchasedPack.credits} credits`,
      amount: event.amount_total!,
      currency: event.currency!,
    }
  });
  
}