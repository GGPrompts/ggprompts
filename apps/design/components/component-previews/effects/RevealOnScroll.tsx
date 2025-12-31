'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Eye, Sparkles, Zap, Star, ArrowDown } from 'lucide-react';
import { Customization } from '@/types/customization';

type RevealOnScrollProps = {
  customization: Customization;
};

export function RevealOnScroll({ customization }: RevealOnScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const fadeLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div
      ref={containerRef}
      className="w-full max-w-md h-96 overflow-y-auto space-y-6 p-4 rounded-xl border"
      style={{
        ...baseStyle,
        backgroundColor: customization.backgroundColor,
        borderColor: `${customization.primaryColor}20`,
      }}
    >
      {/* Scroll Indicator */}
      <motion.div
        className="text-center py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
          style={{ color: customization.primaryColor }}
        >
          <ArrowDown className="w-5 h-5" />
          <span className="text-xs">Scroll to reveal</span>
        </motion.div>
      </motion.div>

      {/* Fade Up Section */}
      <RevealSection variants={fadeUp} customization={customization}>
        <div
          className="p-4 rounded-lg flex items-center gap-3"
          style={{ backgroundColor: `${customization.primaryColor}15` }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: customization.primaryColor }}
          >
            <Eye className="w-5 h-5" style={{ color: customization.backgroundColor }} />
          </div>
          <div>
            <h4 className="font-semibold" style={{ color: customization.textColor }}>
              Fade Up Effect
            </h4>
            <p className="text-xs opacity-60" style={{ color: customization.textColor }}>
              Element slides up as it appears
            </p>
          </div>
        </div>
      </RevealSection>

      {/* Scale Up Section */}
      <RevealSection variants={scaleUp} customization={customization}>
        <div
          className="p-4 rounded-lg flex items-center gap-3"
          style={{ backgroundColor: `${customization.secondaryColor}15` }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: customization.secondaryColor }}
          >
            <Sparkles className="w-5 h-5" style={{ color: customization.backgroundColor }} />
          </div>
          <div>
            <h4 className="font-semibold" style={{ color: customization.textColor }}>
              Scale Effect
            </h4>
            <p className="text-xs opacity-60" style={{ color: customization.textColor }}>
              Element grows from center
            </p>
          </div>
        </div>
      </RevealSection>

      {/* Fade Left Section */}
      <RevealSection variants={fadeLeft} customization={customization}>
        <div
          className="p-4 rounded-lg flex items-center gap-3"
          style={{
            background: `linear-gradient(135deg, ${customization.primaryColor}20, ${customization.secondaryColor}20)`,
          }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
            }}
          >
            <Zap className="w-5 h-5" style={{ color: customization.backgroundColor }} />
          </div>
          <div>
            <h4 className="font-semibold" style={{ color: customization.textColor }}>
              Slide From Left
            </h4>
            <p className="text-xs opacity-60" style={{ color: customization.textColor }}>
              Element enters from the left
            </p>
          </div>
        </div>
      </RevealSection>

      {/* Staggered Grid */}
      <RevealSection variants={staggerContainer} customization={customization}>
        <div className="grid grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="aspect-square rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: `${customization.primaryColor}${(20 + i * 10).toString(16)}`,
              }}
            >
              <Star
                className="w-6 h-6"
                style={{ color: customization.primaryColor }}
              />
            </motion.div>
          ))}
        </div>
        <p
          className="text-center text-xs mt-2 opacity-60"
          style={{ color: customization.textColor }}
        >
          Staggered animation
        </p>
      </RevealSection>

      {/* Fade Right Section */}
      <RevealSection variants={fadeRight} customization={customization}>
        <div
          className="p-4 rounded-lg text-center"
          style={{
            border: `2px solid ${customization.primaryColor}`,
          }}
        >
          <h4 className="font-semibold mb-2" style={{ color: customization.primaryColor }}>
            Final Reveal!
          </h4>
          <p className="text-xs opacity-60" style={{ color: customization.textColor }}>
            You scrolled to the end
          </p>
        </div>
      </RevealSection>

      {/* Spacer for scrolling */}
      <div className="h-20" />
    </div>
  );
}

// Reusable reveal section wrapper
function RevealSection({
  children,
  variants,
  customization,
}: {
  children: React.ReactNode;
  variants: any;
  customization: Customization;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  );
}
