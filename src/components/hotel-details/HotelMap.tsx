import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HotelMapProps {
  address: string;
  ward: string;
}

const HotelMap = ({ address, ward }: HotelMapProps) => {
  const fullAddress = `${address}, ${ward}, Vũng Tàu, Việt Nam`;
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapUrl = GOOGLE_MAPS_API_KEY 
    ? `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(fullAddress)}&zoom=15`
    : null;

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
          {mapUrl ? (
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ vị trí"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <p className="text-sm">Bản đồ không khả dụng</p>
            </div>
          )}
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-sm text-secondary hover:underline"
        >
          <MapPin className="w-4 h-4" />
          Xem trên Google Maps
        </a>
      </CardContent>
    </Card>
  );
};

export default HotelMap;
