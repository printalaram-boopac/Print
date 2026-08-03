import Skeleton from 'react-loading-skeleton';

export default function TemplateSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg overflow-hidden border border-gold-200/20 bg-luxury-dark p-3 space-y-3">
          <Skeleton height={220} className="rounded-md" />
          <Skeleton width="35%" height={10} />
          <Skeleton width="80%" height={16} />
          <Skeleton width="45%" height={12} />
        </div>
      ))}
    </div>
  );
}
