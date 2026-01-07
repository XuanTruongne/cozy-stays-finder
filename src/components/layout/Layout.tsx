import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import FloatingContactIcons from './FloatingContactIcons';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatingContactIcons />
    </div>
  );
};

export default Layout;
