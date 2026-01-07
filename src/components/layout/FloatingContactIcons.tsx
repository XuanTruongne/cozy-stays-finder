import { Phone, MessageCircle, Facebook } from 'lucide-react';

const FloatingContactIcons = () => {
  const phoneNumber = '0819516052';
  const zaloLink = `https://zalo.me/${phoneNumber}`;
  const facebookLink = 'https://facebook.com'; // Thay đổi link Facebook thực tế
  const phoneLink = `tel:${phoneNumber}`;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {/* Zalo */}
      <a
        href={zaloLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
        title="Chat Zalo"
      >
        <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75" />
        <MessageCircle className="w-6 h-6 text-white relative z-10" />
      </a>

      {/* Facebook */}
      <a
        href={facebookLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
        title="Facebook"
      >
        <div className="absolute inset-0 bg-[#4293f5] rounded-full animate-ping opacity-75" />
        <Facebook className="w-6 h-6 text-white relative z-10" />
      </a>

      {/* Phone */}
      <a
        href={phoneLink}
        className="group relative w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
        title="Gọi điện"
      >
        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
        <Phone className="w-6 h-6 text-white relative z-10" />
      </a>
    </div>
  );
};

export default FloatingContactIcons;
