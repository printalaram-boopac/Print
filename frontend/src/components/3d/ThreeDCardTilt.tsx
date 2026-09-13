import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface ThreeDCardTiltProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glareEffect?: boolean;
  depth?: number;
}

export default function ThreeDCardTilt({
  children,
  className = '',
  maxTilt = 12,
  glareEffect = true,
  depth = 30,
}: ThreeDCardTiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Mouse coordinates from center (-0.5 .. 0.5)
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);

  const springX = useSpring(mvX, { stiffness: 200, damping: 20 });
  const springY = useSpring(mvY, { stiffness: 200, damping: 20 });

  // 3D rotations based on cursor
  const rotateX = useTransform(springY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Foil Glare gradient positioning
  const glareX = useTransform(springX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(springY, [-0.5, 0.5], ['0%', '100%']);
  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]: string[]) =>
      `radial-gradient(circle at ${x} ${y}, rgba(255, 235, 175, 0.35) 0%, rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0) 65%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mvX.set(x);
    mvY.set(y);
  };

  const handleMouseLeave = () => {
    mvX.set(0);
    mvY.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`perspective-1000 select-none ${className}`}
      style={{ perspective: 1200 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative w-full h-full"
      >
        {children}

        {/* Dynamic Gold Sheen / Glare Overlay */}
        {glareEffect && (
          <motion.div
            style={{
              background: glareBackground,
              transform: `translateZ(${depth}px)`,
            }}
            className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
          />
        )}
      </motion.div>
    </div>
  );
}
