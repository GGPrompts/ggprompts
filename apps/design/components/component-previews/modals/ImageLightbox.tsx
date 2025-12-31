'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Image } from 'lucide-react';
import { Customization } from '@/types/customization';

type ImageLightboxProps = {
  customization: Customization;
};

export function ImageLightbox({ customization }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const backdropOpacity = parseInt(customization.backdropOpacity || '50') || 50;
  const backdropHex = Math.round(backdropOpacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const images = [
    { id: 1, aspect: '16/9' },
    { id: 2, aspect: '4/3' },
    { id: 3, aspect: '1/1' },
  ];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setZoom(1);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoom(1);
  };

  return (
    <div className="w-full max-w-md relative" style={{ ...baseStyle, minHeight: '300px' }}>
      {/* Trigger - thumbnail grid */}
      {!isOpen && (
        <motion.div
          className="absolute inset-4 grid grid-cols-3 gap-2 cursor-pointer"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.02 }}
        >
          {images.map((img, i) => (
            <motion.div
              key={img.id}
              className="rounded-lg flex items-center justify-center border"
              style={{
                backgroundColor: `${customization.primaryColor}15`,
                borderColor: `${customization.primaryColor}30`,
                borderRadius: `${customization.borderRadius}px`,
              }}
              whileHover={{ scale: 1.05 }}
            >
              <Image className="w-6 h-6" style={{ color: `${customization.primaryColor}60` }} />
            </motion.div>
          ))}
          <div
            className="col-span-3 text-center py-2 text-sm"
            style={{ color: customization.primaryColor }}
          >
            Click to open lightbox
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{ backgroundColor: `${customization.backgroundColor}${backdropHex}`, backdropFilter: `blur(${blurAmount}px)` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Lightbox container */}
            <motion.div
              className="absolute inset-2 flex flex-col"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Top bar */}
              <div className="flex items-center justify-between p-3">
                <span className="text-sm" style={{ color: `${customization.textColor}70` }}>
                  {currentIndex + 1} / {images.length}
                </span>
                <div className="flex items-center gap-2">
                  <motion.button
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${customization.textColor}10` }}
                    onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                    whileHover={{ backgroundColor: `${customization.textColor}20` }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ZoomOut className="w-4 h-4" style={{ color: customization.textColor }} />
                  </motion.button>
                  <span className="text-xs px-2" style={{ color: customization.textColor }}>
                    {Math.round(zoom * 100)}%
                  </span>
                  <motion.button
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${customization.textColor}10` }}
                    onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
                    whileHover={{ backgroundColor: `${customization.textColor}20` }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ZoomIn className="w-4 h-4" style={{ color: customization.textColor }} />
                  </motion.button>
                  <motion.button
                    className="p-2 rounded-lg ml-2"
                    style={{ backgroundColor: `${customization.textColor}10` }}
                    onClick={() => setIsOpen(false)}
                    whileHover={{ backgroundColor: `${customization.textColor}20` }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4" style={{ color: customization.textColor }} />
                  </motion.button>
                </div>
              </div>

              {/* Main image area */}
              <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                {/* Navigation arrows */}
                <motion.button
                  className="absolute left-2 p-2 rounded-full z-10"
                  style={{ backgroundColor: `${customization.primaryColor}30` }}
                  onClick={prevImage}
                  whileHover={{ scale: 1.1, backgroundColor: `${customization.primaryColor}50` }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="w-5 h-5" style={{ color: 'white' }} />
                </motion.button>

                {/* Image placeholder */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    className="rounded-lg border flex items-center justify-center"
                    style={{
                      width: `${zoom * 180}px`,
                      height: `${zoom * 120}px`,
                      backgroundColor: `${customization.primaryColor}20`,
                      borderColor: `${customization.primaryColor}40`,
                      borderRadius: `${customization.borderRadius}px`,
                      background: `linear-gradient(135deg, ${customization.primaryColor}20, ${customization.secondaryColor}20)`,
                    }}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Image className="w-10 h-10" style={{ color: `${customization.primaryColor}50` }} />
                  </motion.div>
                </AnimatePresence>

                <motion.button
                  className="absolute right-2 p-2 rounded-full z-10"
                  style={{ backgroundColor: `${customization.primaryColor}30` }}
                  onClick={nextImage}
                  whileHover={{ scale: 1.1, backgroundColor: `${customization.primaryColor}50` }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="w-5 h-5" style={{ color: 'white' }} />
                </motion.button>
              </div>

              {/* Thumbnail strip */}
              <div className="flex items-center justify-center gap-2 p-3">
                {images.map((img, i) => (
                  <motion.button
                    key={img.id}
                    className="w-12 h-12 rounded-lg flex items-center justify-center border-2"
                    style={{
                      backgroundColor: `${customization.primaryColor}15`,
                      borderColor: i === currentIndex ? customization.primaryColor : 'transparent',
                    }}
                    onClick={() => {
                      setCurrentIndex(i);
                      setZoom(1);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Image
                      className="w-5 h-5"
                      style={{
                        color: i === currentIndex
                          ? customization.primaryColor
                          : `${customization.textColor}40`,
                      }}
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
