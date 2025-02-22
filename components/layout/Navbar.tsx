import Image from 'next/image';
import Link from 'next/link';

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Image
              src="/Logo maker project (1).png"
              alt="Humane AI Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-lg font-bold tracking-tight">Humane AI</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('demo')}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Demo
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('why-humane')}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Why Humane
            </button>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <Link
              href="/auth"
              className="btn-primary"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 