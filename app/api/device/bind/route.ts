import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { ownerId, deviceId } = await req.json();

  if (!ownerId || !deviceId) {
    return NextResponse.json({ error: "缺少参数" }, { status: 400 });
  }

  const device = await prisma.device.create({
    data: {
      deviceId,
      ownerId,
    },
  });

  return NextResponse.json(device);
}