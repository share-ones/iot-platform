export default function Section({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="Universal">
      <section className="border rounded-xl p-4 bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-3">{title}</h2>
        {children}
      </section>
    </div>
  );
}
