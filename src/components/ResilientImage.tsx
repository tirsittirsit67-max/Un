import {useState} from 'react';
import {Building2} from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function ResilientImage({src, alt, className = '', fallbackLabel}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-slate-100 text-slate-500 border border-slate-200 p-6 text-center ${className}`}
      >
        <Building2 className="h-8 w-8 text-[#005A9C] mb-2" />
        <span className="text-sm font-medium text-slate-700">{fallbackLabel || alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
