export default function Value({
  label,
  value
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="device-item">
      <span className="device-label">{label}</span>
      <span className="device-value">{value}</span>
    </div>
  );
}