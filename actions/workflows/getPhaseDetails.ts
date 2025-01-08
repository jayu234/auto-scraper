'use server';

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetPhaseDetails(phaseId: string){
  const { userId } = await auth();
  if(!userId) {
    throw new Error('Unauthenticated!');
  };

  const phaseDetails = await prisma.executionPhase.findUnique({
    where: {
      id: phaseId,
      execution: {
        userId,
      }
    },
    include: {
      logs: {
        orderBy: {
          timestamp: 'asc'
        }
      }
    }
  });

  if(!phaseDetails) {
    throw new Error('Phase details not found');
  }
  
  return phaseDetails;
}