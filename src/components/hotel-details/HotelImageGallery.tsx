import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HotelImageGalleryProps {
  images: string[];
  hotelName: string;
}

const HotelImageGallery = ({ images, hotelName }: HotelImageGalleryProps) => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  if (images.length === 0) {
    return (
      <div className="h-[300px] md:h-[400px] bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Không có hình ảnh</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 h-[300px] md:h-[400px]">
      {/* Main Image */}
      <div className="col-span-4 md:col-span-2 relative group">
        <img
          src={images[currentImage]}
          alt={hotelName}
          className="w-full h-full object-cover rounded-lg"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Grid */}
      <div className="hidden md:grid col-span-2 grid-cols-2 gap-2">
        {images.slice(1, 5).map((image, index) => (
          <div
            key={index}
            className="relative cursor-pointer group/thumb"
            onClick={() => setCurrentImage(index + 1)}
          >
            <img
              src={image}
              alt={`${hotelName} ${index + 2}`}
              className="w-full h-full object-cover rounded-lg"
            />
            {index === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">+{images.length - 5} ảnh</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelImageGallery;
