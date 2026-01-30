import { Newsletter } from "@/components/Newsletter";

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <div className="max-w-4xl mx-auto px-4">
        <Newsletter />
      </div>
    </>
  );
}
