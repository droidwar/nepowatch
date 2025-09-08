interface TikTokVideoProps {
  url: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

function extractTikTokId(url: string): string {
  // Example: https://www.tiktok.com/@user/video/1234567890123456789
  const match = url.match(/\/video\/(\d+)/);
  return match ? match[1] : "";
}

export default function TikTokVideo({ url, className = "", size = 'medium' }: TikTokVideoProps) {
  const sizeConfig = {
    small: { maxWidth: '250px', height: '550' },
    medium: { maxWidth: '300px', height: '650' },
    large: { maxWidth: '325px', height: '700' }
  };

  const config = sizeConfig[size];
  const tikTokId = extractTikTokId(url);

  if (!tikTokId) {
    return (
      <div className={`flex justify-center items-center bg-gray-100 rounded-lg ${className}`} style={{ height: config.height, maxWidth: config.maxWidth }}>
        <p className="text-gray-500 text-sm">Invalid TikTok URL</p>
      </div>
    );
  }

  return (
    <div className={`flex justify-center my-4 ${className}`}>
      <div className="w-full" style={{ maxWidth: config.maxWidth }}>
        <iframe
          src={`https://www.tiktok.com/embed/${tikTokId}`}
          width="100%"
          height={config.height}
          allow="encrypted-media"
          allowFullScreen
          className="rounded-lg border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
}