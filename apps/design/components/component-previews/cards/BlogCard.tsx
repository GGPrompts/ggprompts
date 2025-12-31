'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Clock, BookOpen, Heart, MessageCircle, Share2, Bookmark, ArrowRight } from 'lucide-react';
import { Customization } from '@/types/customization';

type BlogCardProps = {
  customization: Customization;
  textContent?: Record<string, string>;
};

export function BlogCard({ customization, textContent }: BlogCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const excerptLines = parseInt(customization.excerptLines) || 3;
  const showAuthor = customization.showAuthor !== 'false';
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;

  const title = textContent?.title ?? 'Getting Started with AI';
  const excerpt = textContent?.excerpt ?? 'Learn how to leverage AI tools to boost your productivity and build amazing products.';
  const author = textContent?.author ?? 'Sarah Miller';

  // Convert percentage to hex for opacity values
  const borderOpacityHex = Math.round(glassOpacity * 1.3 * 2.55).toString(16).padStart(2, '0');
  const gradientOpacityHex = Math.round(glassOpacity * 2.7 * 2.55).toString(16).padStart(2, '0');
  const categoryBgOpacityHex = Math.round(glassOpacity * 6 * 2.55).toString(16).padStart(2, '0');
  const bookmarkBgOpacityHex = Math.round(glassOpacity * 5.3 * 2.55).toString(16).padStart(2, '0');
  const bookmarkBorderOpacityHex = Math.round(glassOpacity * 2 * 2.55).toString(16).padStart(2, '0');
  const timeBgOpacityHex = Math.round(glassOpacity * 5.3 * 2.55).toString(16).padStart(2, '0');
  const metaTextOpacityHex = Math.round(glassOpacity * 4.7 * 2.55).toString(16).padStart(2, '0');
  const tagBgOpacityHex = Math.round(glassOpacity * 1 * 2.55).toString(16).padStart(2, '0');
  const dividerOpacityHex = Math.round(glassOpacity * 1 * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  return (
    <motion.article
      className="w-full max-w-md overflow-hidden border group"
      style={{
        ...baseStyle,
        backgroundColor: customization.backgroundColor,
        borderColor: `${customization.primaryColor}${borderOpacityHex}`,
        borderRadius: `${customization.borderRadius}px`,
        color: customization.textColor,
        boxShadow: `0 15px 40px ${customization.primaryColor}${Math.round(shadowIntensity * 0.25).toString(16).padStart(2, '0')}`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Featured Image */}
      <div className="relative h-52 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${customization.primaryColor}${gradientOpacityHex}, ${customization.secondaryColor}${gradientOpacityHex})`,
          }}
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Animated decorative shapes */}
        <motion.div
          className="absolute top-10 right-10 w-20 h-20 rounded-full"
          style={{ backgroundColor: `${customization.primaryColor}${gradientOpacityHex}` }}
          animate={{
            y: isHovered ? -10 : 0,
            scale: isHovered ? 1.1 : 1,
          }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-14 h-14 rounded-lg rotate-45"
          style={{ backgroundColor: `${customization.secondaryColor}${gradientOpacityHex}` }}
          animate={{
            rotate: isHovered ? 90 : 45,
            scale: isHovered ? 1.1 : 1,
          }}
        />

        {/* Category Badge */}
        <motion.div
          className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm"
          style={{
            backgroundColor: `${customization.primaryColor}${categoryBgOpacityHex}`,
            color: customization.backgroundColor,
            backdropFilter: `blur(${blurAmount}px)`,
          }}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          Technology
        </motion.div>

        {/* Bookmark Button */}
        <motion.button
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm"
          style={{
            backgroundColor: `${customization.backgroundColor}${bookmarkBgOpacityHex}`,
            border: `1px solid ${customization.primaryColor}${bookmarkBorderOpacityHex}`,
            backdropFilter: `blur(${blurAmount}px)`,
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsBookmarked(!isBookmarked)}
        >
          <Bookmark
            className="w-4 h-4"
            style={{
              color: isBookmarked ? customization.primaryColor : customization.textColor,
              fill: isBookmarked ? customization.primaryColor : 'transparent',
            }}
          />
        </motion.button>

        {/* Reading Time */}
        <div
          className="absolute bottom-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs backdrop-blur-sm"
          style={{
            backgroundColor: `${customization.backgroundColor}${timeBgOpacityHex}`,
            backdropFilter: `blur(${blurAmount}px)`,
          }}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>8 min read</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs mb-3" style={{ color: `${customization.textColor}${metaTextOpacityHex}` }}>
          <span>November 28, 2024</span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            2,450 views
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold mb-3 leading-tight">
          <motion.span
            className="bg-gradient-to-r bg-clip-text"
            style={{
              backgroundImage: isHovered
                ? `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`
                : 'none',
              WebkitTextFillColor: isHovered ? 'transparent' : customization.textColor,
            }}
          >
            {title}
          </motion.span>
        </h2>

        {/* Excerpt */}
        <p
          className="text-sm opacity-70 leading-relaxed mb-4"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: excerptLines,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {['AI', 'Development', 'Future Tech'].map((tag, i) => (
            <motion.span
              key={tag}
              className="px-2.5 py-1 text-xs rounded-full"
              style={{
                backgroundColor: `${customization.primaryColor}${tagBgOpacityHex}`,
                color: customization.primaryColor,
              }}
              whileHover={{
                backgroundColor: customization.primaryColor,
                color: customization.backgroundColor,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              #{tag}
            </motion.span>
          ))}
        </div>

        {/* Author & Actions Divider */}
        <div
          className="pt-4 border-t"
          style={{ borderColor: `${customization.primaryColor}${dividerOpacityHex}` }}
        >
          <div className="flex items-center justify-between">
            {/* Author */}
            {showAuthor && (
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                    color: customization.backgroundColor,
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  SJ
                </motion.div>
                <div>
                  <p className="text-sm font-semibold">{author}</p>
                  <p className="text-xs opacity-60">Tech Writer</p>
                </div>
              </div>
            )}

            {/* Social Actions */}
            <div className={`flex items-center gap-1 ${!showAuthor ? 'ml-auto' : ''}`}>
              {[
                { icon: Heart, count: 234 },
                { icon: MessageCircle, count: 18 },
                { icon: Share2, count: null },
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={i}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs"
                    style={{ color: `${customization.textColor}${metaTextOpacityHex}` }}
                    whileHover={{
                      backgroundColor: `${customization.primaryColor}${tagBgOpacityHex}`,
                      color: customization.primaryColor,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                    {action.count && <span>{action.count}</span>}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Read More Link */}
        <motion.a
          href="#"
          className="flex items-center gap-2 mt-4 text-sm font-semibold"
          style={{ color: customization.primaryColor }}
          whileHover={{ x: 5 }}
        >
          Read Full Article
          <motion.span
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.span>
        </motion.a>
      </div>
    </motion.article>
  );
}
