// app/components/device/DeviceActions.tsx
"use client";

import Button from "../ui/Button";
import { isDeviceOnline } from "@/lib/deviceStatus";

type Props = {
  device: string;
  ts?: number;

  onRename?: (label: string) => void;
  onDelete?: () => void;

  onPin?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onHistory?: () => void;
};

export default function DeviceActions({
  device,
  ts,

  onRename,
  onDelete,
  onPin,
  onMoveUp,
  onMoveDown,
  onHistory,
}: Props) {
  function handleRename() {
    const label = prompt(`输入新标签（${device}）：`);
    if (!label) return;
    onRename?.(label);
  }

  function handleDelete() {
    if (ts && isDeviceOnline(ts, { kind: "air" })) {
      alert("该设备当前在线，不能删除（仅允许清理离线设备）");
      return;
    }

    if (!confirm(`确认从前端隐藏设备 ${device}？\n（不会删除历史数据）`)) {
      return;
    }

    onDelete?.();
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {/* 排序 */}
      {(onMoveUp || onMoveDown || onPin) && (
        <>
          {onMoveUp && (
            <Button size="sm" variant="ghost" onClick={onMoveUp}>
              ⬆️ 上移
            </Button>
          )}

          {onMoveDown && (
            <Button size="sm" variant="ghost" onClick={onMoveDown}>
              ⬇️ 下移
            </Button>
          )}

          {onPin && (
            <Button size="sm" variant="ghost" onClick={onPin}>
              ⭐ 置顶
            </Button>
          )}
        </>
      )}

      {onHistory && (
        <Button size="sm" variant="ghost" onClick={onHistory}>
          📈 历史
        </Button>
      )}

      {/* 编辑 */}
      {onRename && (
        <Button size="sm" variant="ghost" onClick={handleRename}>
          ✏️ 改名
        </Button>
      )}

      {onDelete && (
        <Button size="sm" variant="danger" onClick={handleDelete}>
          删除
        </Button>
      )}
    </div>
  );
}
