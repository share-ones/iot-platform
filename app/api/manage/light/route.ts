//C:\Users\one\Documents\neww\app\api\manage\air\route.ts
import { NextResponse } from "next/server";
import { moveDevice, pinDevice, renameDevice, hideDevice } from "@/lib/button/deviceActions";

export async function POST(req: Request) {
  const body = await req.json();
  const { action, device, dir, label } = body;

  if (!action) return NextResponse.json({ ok: false, error: "missing action" }, { status: 400 });

  try {
    switch (action) {
      case "move":
        if (!device || !dir) throw new Error("missing device or dir");
        moveDevice(device, dir);
        break;

      case "pin":
        if (!device) throw new Error("missing device");
        pinDevice(device);
        break;

      case "rename":
        if (!device || !label) throw new Error("missing device or label");
        renameDevice(device, label);
        break;

      case "hide":
        if (!device) throw new Error("missing device");
        hideDevice(device);
        break;

      default:
        return NextResponse.json({ ok: false, error: "unknown action" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}
