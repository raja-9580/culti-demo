import Image from 'next/image';

export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <Image
      src="/images/akaththi.png"
      alt="Cultivator Logo"
      width={32}
      height={32}
      className={className}
      priority
      unoptimized
    />
  );
}
