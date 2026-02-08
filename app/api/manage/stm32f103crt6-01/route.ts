// app/api/manage/stm32f103c8t6-01/route.ts
import { NextResponse } from "next/server";
import {
  moveDevice,
  pinDevice,
  renameDevice,
  hideDevice,
} from "@/lib/button/deviceActions";

/**
 * POST /api/manage/stm32f103c8t6-01
 * body: { action: "move"|"pin"|"rename"|"hide", device: string, dir?: "up"|"down", label?: string }
 */
export async function POST(req: Request) {
  const body = await req.json();
  const { action, device, dir, label } = body;

  if (!action)
    return NextResponse.json(
      { ok: false, error: "missing action" },
      { status: 400 }
    );

  try {
    // ⚡ 指定 deviceNamespace 为 "stm32f103c8t6"
    const namespace = "stm32f103c8t6";

    switch (action) {
      case "move":
        if (!device || !dir)
          throw new Error("missing device or dir for move action");
        moveDevice(device, dir, namespace);
        break;

      case "pin":
        if (!device) throw new Error("missing device for pin action");
        pinDevice(device, namespace);
        break;

      case "rename":
        if (!device || !label)
          throw new Error("missing device or label for rename action");
        renameDevice(device, label, namespace);
        break;

      case "hide":
        if (!device) throw new Error("missing device for hide action");
        hideDevice(device, namespace);
        break;

      default:
        return NextResponse.json(
          { ok: false, error: "unknown action" },
          { status: 400 }
        );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}
