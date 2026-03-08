import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json({ devices: [] });
  }

  try {
    const devices = await prisma.device.findMany({
      where: { ownerId: userId },
      select: { id: true, deviceId: true, name: true },
    });

    return Response.json({ devices });
  } catch (err) {
    console.error(err);
    return Response.json({ devices: [] }, { status: 500 });
  }
}