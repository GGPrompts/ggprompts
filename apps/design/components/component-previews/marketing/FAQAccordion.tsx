'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Customization } from '@/types/customization';

type FAQAccordionProps = {
  customization: Customization;
};

export function FAQAccordion({ customization }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const gradientAngle = parseInt(customization.gradientAngle) || 135;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const faqs = [
    {
      question: 'How do I get started?',
      answer:
        'Getting started is easy! Simply sign up for a free account, and you\'ll have access to all our basic features. Follow our quick-start guide to set up your first project in minutes.',
    },
    {
      question: 'Is there a free trial available?',
      answer:
        'Yes! We offer a 14-day free trial on all our premium plans. No credit card required. You can explore all features and upgrade at any time.',
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer:
        'Absolutely. You can cancel your subscription at any time with no cancellation fees. Your access will continue until the end of your current billing period.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and wire transfers for Enterprise plans. All payments are processed securely.',
    },
  ];

  return (
    <div className="w-full max-w-lg" style={baseStyle}>
      <motion.div
        className="relative p-6 overflow-hidden"
        style={{
          background: customization.backgroundColor,
          borderRadius: `${Number(customization.borderRadius) * 2}px`,
          border: `1px solid ${customization.primaryColor}20`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header */}
        <motion.div
          className="flex items-center gap-3 mb-5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className="p-2 rounded-lg"
            style={{
              background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}20, ${customization.secondaryColor}20)`,
            }}
          >
            <HelpCircle className="w-5 h-5" style={{ color: customization.primaryColor }} />
          </div>
          <div>
            <h3 className="font-bold" style={{ color: customization.textColor }}>
              Frequently Asked Questions
            </h3>
            <p className="text-xs" style={{ color: `${customization.textColor}50` }}>
              Find answers to common questions
            </p>
          </div>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: `${customization.primaryColor}05`,
                border: `1px solid ${
                  openIndex === index ? `${customization.primaryColor}40` : `${customization.primaryColor}10`
                }`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <motion.button
                className="w-full flex items-center justify-between p-4 text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                whileHover={{
                  backgroundColor: `${customization.primaryColor}10`,
                }}
              >
                <span
                  className="text-sm font-medium pr-4"
                  style={{ color: customization.textColor }}
                >
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown
                    className="w-4 h-4"
                    style={{
                      color:
                        openIndex === index
                          ? customization.primaryColor
                          : `${customization.textColor}50`,
                    }}
                  />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      className="px-4 pb-4 text-sm leading-relaxed"
                      style={{ color: `${customization.textColor}70` }}
                    >
                      {/* Decorative line */}
                      <div
                        className="w-full h-px mb-3"
                        style={{
                          background: `linear-gradient(90deg, ${customization.primaryColor}30, transparent)`,
                        }}
                      />
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          className="mt-5 p-4 rounded-xl flex items-center justify-between"
          style={{
            background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}10, ${customization.secondaryColor}10)`,
            border: `1px solid ${customization.primaryColor}20`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5" style={{ color: customization.primaryColor }} />
            <div>
              <p className="text-xs font-medium" style={{ color: customization.textColor }}>
                Still have questions?
              </p>
              <p className="text-xs" style={{ color: `${customization.textColor}50` }}>
                Our team is here to help
              </p>
            </div>
          </div>
          <motion.button
            className="px-4 py-2 rounded-lg text-xs font-medium"
            style={{
              background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
              color: 'white',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
