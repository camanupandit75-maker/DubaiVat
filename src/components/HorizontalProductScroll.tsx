import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ProductScreenshot } from './ProductScreenshot';

interface ProductShowcase {
  type: 'dashboard' | 'invoice' | 'receipt' | 'calculator' | 'returns';
  title: string;
  description: string;
}

const products: ProductShowcase[] = [
  {
    type: 'dashboard',
    title: 'VAT Dashboard',
    description: 'Real-time VAT tracking and analytics'
  },
  {
    type: 'invoice',
    title: 'Invoice Generator',
    description: 'FTA-compliant invoices in seconds'
  },
  {
    type: 'receipt',
    title: 'Receipt Scanner',
    description: 'Instant OCR and categorization'
  },
  {
    type: 'calculator',
    title: 'VAT Calculator',
    description: 'Quick VAT calculations on the fly'
  },
  {
    type: 'returns',
    title: 'VAT Returns',
    description: 'Automated VAT return preparation'
  }
];

export const HorizontalProductScroll: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isPaused) return;

    const scrollWidth = scrollContainer.scrollWidth;
    const clientWidth = scrollContainer.clientWidth;
    const maxScroll = scrollWidth / 2;

    let animationFrameId: number;
    let lastTimestamp = 0;

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = timestamp - lastTimestamp;

      const speed = 0.03;
      const newPosition = scrollPosition + (delta * speed);

      if (newPosition >= maxScroll) {
        setScrollPosition(0);
        scrollContainer.scrollLeft = 0;
      } else {
        setScrollPosition(newPosition);
        scrollContainer.scrollLeft = newPosition;
      }

      lastTimestamp = timestamp;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [scrollPosition, isPaused]);

  const doubledProducts = [...products, ...products];

  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-hidden py-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{ scrollBehavior: 'auto' }}
      >
        {doubledProducts.map((product, index) => (
          <motion.div
            key={`${product.type}-${index}`}
            className="flex-shrink-0 group"
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="relative w-[420px]">
              <div className="glass rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-blue-500/20">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none" />

                <div className="relative bg-gradient-to-br from-gray-50 to-white p-2">
                  <div className="relative rounded-xl overflow-hidden shadow-lg">
                    <ProductScreenshot
                      type={product.type}
                      className="w-full h-64 object-cover border-0 rounded-xl shadow-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center px-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
