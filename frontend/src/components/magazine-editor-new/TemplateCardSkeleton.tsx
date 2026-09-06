export default function TemplateCardSkeleton() {
  return (
    <div>
      <div
        className="rounded-lg border border-[#E7E7E4] bg-[#F0F0EE] animate-pulse"
        style={{ aspectRatio: '210 / 297' }}
      />
      <div className="mt-1.5 h-3 w-3/4 rounded bg-[#F0F0EE] animate-pulse" />
    </div>
  );
}
