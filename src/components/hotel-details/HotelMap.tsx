import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HotelMapProps {
  address: string;
  ward: string;
}

const HotelMap = ({ address, ward }: HotelMapProps) => {
  const fullAddress = `${address}, ${ward}, Vũng Tàu, Việt Nam`;
  
  // Use OpenStreetMap embed (free, no API key required)
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=107.05,10.30,107.12,10.40&layer=mapnik&marker=10.35,107.08`;
  const searchUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(fullAddress)}`;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="w-5 h-5 text-secondary" />
          Vị trí
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{fullAddress}</p>
        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            title="Bản đồ vị trí"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          <a
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-secondary hover:underline"
          >
            <MapPin className="w-4 h-4" />
            Xem trên OpenStreetMap
          </a>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-secondary hover:underline"
          >
            <MapPin className="w-4 h-4" />
            Xem trên Google Maps
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelMap;
