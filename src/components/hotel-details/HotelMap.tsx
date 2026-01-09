import { useEffect, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HotelMapProps {
  address: string;
  ward: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

const HotelMap = ({ address, ward }: HotelMapProps) => {
  const fullAddress = `${address}, Phường ${ward}, Vũng Tàu, Việt Nam`;
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Default coordinates for Vung Tau center
  const defaultCoords: Coordinates = { lat: 10.346, lng: 107.084 };

  useEffect(() => {
    const geocodeAddress = async () => {
      setIsLoading(true);
      
      try {
        // Use Nominatim (OpenStreetMap's free geocoding service)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`,
          {
            headers: {
              'User-Agent': 'VungTauStay/1.0'
            }
          }
        );
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          setCoordinates({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          });
        } else {
          // If exact address not found, try searching with just ward and city
          const fallbackResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(`Phường ${ward}, Vũng Tàu, Việt Nam`)}&limit=1`,
            {
              headers: {
                'User-Agent': 'VungTauStay/1.0'
              }
            }
          );
          
          const fallbackData = await fallbackResponse.json();
          
          if (fallbackData && fallbackData.length > 0) {
            setCoordinates({
              lat: parseFloat(fallbackData[0].lat),
              lng: parseFloat(fallbackData[0].lon)
            });
          } else {
            setCoordinates(defaultCoords);
          }
        }
      } catch (err) {
        console.error('Geocoding error:', err);
        setCoordinates(defaultCoords);
      } finally {
        setIsLoading(false);
      }
    };

    geocodeAddress();
  }, [address, ward, fullAddress]);

  const mapCenter = coordinates || defaultCoords;
  
  // Create OpenStreetMap embed URL with marker
  const bbox = `${mapCenter.lng - 0.005},${mapCenter.lat - 0.003},${mapCenter.lng + 0.005},${mapCenter.lat + 0.003}`;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${mapCenter.lat},${mapCenter.lng}`;

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
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <p className="text-sm">Đang tải bản đồ...</p>
            </div>
          ) : (
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              title="Bản đồ vị trí"
            />
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          <a
            href={`https://www.openstreetmap.org/?mlat=${mapCenter.lat}&mlon=${mapCenter.lng}#map=17/${mapCenter.lat}/${mapCenter.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-secondary hover:underline"
          >
            <MapPin className="w-4 h-4" />
            Xem trên OpenStreetMap
          </a>
          <a
            href={`https://www.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}`}
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
