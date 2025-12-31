'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, ArrowRight, Zap } from 'lucide-react';
import { Customization } from '@/types/customization';

type MultiColumnFooterProps = {
  customization: Customization;
};

export function MultiColumnFooter({ customization }: MultiColumnFooterProps) {
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const footerColumns = [
    {
      title: 'Product',
      links: ['Features', 'Pricing', 'Integrations', 'Changelog', 'Roadmap'],
    },
    {
      title: 'Company',
      links: ['About', 'Blog', 'Careers', 'Press', 'Partners'],
    },
    {
      title: 'Resources',
      links: ['Documentation', 'Help Center', 'Community', 'Templates', 'Webinars'],
    },
    {
      title: 'Legal',
      links: ['Privacy', 'Terms', 'Security', 'Cookies', 'Licenses'],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full max-w-4xl" style={baseStyle}>
      <motion.footer
        className="relative overflow-hidden rounded-xl border"
        style={{
          backgroundColor: customization.backgroundColor,
          borderColor: `${customization.primaryColor}20`,
        }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Background decoration */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{
            background: `radial-gradient(circle, ${customization.primaryColor}, transparent)`,
          }}
        />

        <div className="relative z-10 p-8">
          {/* Top section with logo and newsletter */}
          <motion.div
            className="flex justify-between items-start pb-8 border-b"
            style={{ borderColor: `${customization.primaryColor}15` }}
            variants={itemVariants}
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                  }}
                >
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg" style={{ color: customization.textColor }}>
                  Acme Inc
                </span>
              </div>
              <p className="text-sm max-w-xs" style={{ color: `${customization.textColor}70` }}>
                Building the future of digital experiences. Join thousands of teams using our platform.
              </p>
            </div>

            <div className="text-right">
              <h4 className="font-semibold mb-2" style={{ color: customization.textColor }}>
                Subscribe to newsletter
              </h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-3 py-2 text-sm rounded-lg border bg-transparent w-48 outline-none focus:border-opacity-100 transition-colors"
                  style={{
                    borderColor: `${customization.primaryColor}30`,
                    color: customization.textColor,
                  }}
                />
                <motion.button
                  className="px-4 py-2 text-sm font-medium text-white rounded-lg flex items-center gap-1"
                  style={{
                    background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Subscribe
                  <ArrowRight className="w-3 h-3" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Link columns */}
          <div className="grid grid-cols-4 gap-8 py-8">
            {footerColumns.map((column, colIndex) => (
              <motion.div key={column.title} variants={itemVariants}>
                <h4
                  className="font-semibold text-sm mb-4 uppercase tracking-wider"
                  style={{ color: customization.primaryColor }}
                >
                  {column.title}
                </h4>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <motion.li key={link}>
                      <motion.a
                        href="#"
                        className="text-sm transition-colors"
                        style={{ color: `${customization.textColor}70` }}
                        whileHover={{ color: customization.primaryColor, x: 3 }}
                      >
                        {link}
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Bottom section */}
          <motion.div
            className="flex justify-between items-center pt-6 border-t"
            style={{ borderColor: `${customization.primaryColor}15` }}
            variants={itemVariants}
          >
            <div className="flex items-center gap-6 text-sm" style={{ color: `${customization.textColor}60` }}>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hello@acme.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
            <p className="text-sm" style={{ color: `${customization.textColor}50` }}>
              &copy; 2024 Acme Inc. All rights reserved.
            </p>
          </motion.div>
        </div>
      </motion.footer>

      <div className="mt-3 text-center">
        <p className="text-sm font-medium" style={{ color: customization.primaryColor }}>
          Multi-Column Footer
        </p>
        <p className="text-xs opacity-50 mt-1" style={{ color: customization.textColor }}>
          Comprehensive footer with link columns and newsletter
        </p>
      </div>
    </div>
  );
}
