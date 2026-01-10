import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HotelMapProps {
  address: string;
  ward: string;
  mapEmbedUrl?: string | null;
}

const HotelMap = ({ address, ward, mapEmbedUrl }: HotelMapProps) => {
  const wardDisplay = ward.toLowerCase().startsWith('phường') ? ward : `Phường ${ward}`;
  const fullAddress = `${address}, ${wardDisplay}, Vũng Tàu, Việt Nam`;

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
          {mapEmbedUrl ? (
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ vị trí"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <p className="text-sm">Chưa có bản đồ</p>
            </div>
          )}
        </div>
        <div className="mt-3">
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
