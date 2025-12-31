'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';
import { Customization } from '@/types/customization';

type PaginationNavProps = {
  customization: Customization;
};

export function PaginationNav({ customization }: PaginationNavProps) {
  const [currentPage, setCurrentPage] = useState(5);
  const totalPages = 20;

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range: (number | string)[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift('...');
    }
    if (currentPage + delta < totalPages - 1) {
      range.push('...');
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  const PageButton = ({ page, isCurrent }: { page: number | string; isCurrent?: boolean }) => {
    const isEllipsis = page === '...';

    if (isEllipsis) {
      return (
        <div
          className="w-10 h-10 flex items-center justify-center"
          style={{ color: `${customization.textColor}50` }}
        >
          <MoreHorizontal className="w-4 h-4" />
        </div>
      );
    }

    return (
      <motion.button
        className="relative w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium"
        style={{
          backgroundColor: isCurrent ? customization.primaryColor : 'transparent',
          color: isCurrent ? customization.backgroundColor : customization.textColor,
          boxShadow: isCurrent ? `0 4px 15px ${customization.primaryColor}40` : 'none',
        }}
        onClick={() => setCurrentPage(page as number)}
        whileHover={{
          scale: isCurrent ? 1 : 1.1,
          backgroundColor: isCurrent ? customization.primaryColor : `${customization.primaryColor}20`,
        }}
        whileTap={{ scale: 0.95 }}
      >
        {isCurrent && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
            }}
            layoutId="activePage"
          />
        )}
        <span className="relative z-10">{page}</span>
      </motion.button>
    );
  };

  return (
    <div className="w-full max-w-lg" style={baseStyle}>
      {/* Main Pagination */}
      <motion.nav
        className="flex items-center justify-center gap-1 p-2 rounded-xl border"
        style={{
          backgroundColor: `${customization.backgroundColor}`,
          borderColor: `${customization.primaryColor}20`,
          boxShadow: `0 4px 20px ${customization.primaryColor}10`,
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* First Page */}
        <motion.button
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ color: currentPage === 1 ? `${customization.textColor}30` : customization.textColor }}
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          whileHover={{ scale: currentPage === 1 ? 1 : 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronsLeft className="w-4 h-4" />
        </motion.button>

        {/* Previous */}
        <motion.button
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ color: currentPage === 1 ? `${customization.textColor}30` : customization.textColor }}
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          whileHover={{ scale: currentPage === 1 ? 1 : 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-2">
          {getVisiblePages().map((page, index) => (
            <PageButton
              key={`${page}-${index}`}
              page={page}
              isCurrent={page === currentPage}
            />
          ))}
        </div>

        {/* Next */}
        <motion.button
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ color: currentPage === totalPages ? `${customization.textColor}30` : customization.textColor }}
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          whileHover={{ scale: currentPage === totalPages ? 1 : 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>

        {/* Last Page */}
        <motion.button
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ color: currentPage === totalPages ? `${customization.textColor}30` : customization.textColor }}
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          whileHover={{ scale: currentPage === totalPages ? 1 : 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronsRight className="w-4 h-4" />
        </motion.button>
      </motion.nav>

      {/* Page Info */}
      <motion.div
        className="text-center mt-3 text-sm"
        style={{ color: `${customization.textColor}60` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Page <span style={{ color: customization.primaryColor, fontWeight: 600 }}>{currentPage}</span> of{' '}
        <span style={{ fontWeight: 600 }}>{totalPages}</span>
      </motion.div>

      {/* Compact Version */}
      <motion.div
        className="flex items-center justify-between mt-6 p-3 rounded-lg border"
        style={{
          backgroundColor: `${customization.primaryColor}08`,
          borderColor: `${customization.primaryColor}20`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          style={{
            backgroundColor: customization.backgroundColor,
            color: customization.textColor,
            border: `1px solid ${customization.primaryColor}30`,
          }}
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </motion.button>

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: i + 1 === Math.min(5, currentPage)
                  ? customization.primaryColor
                  : `${customization.primaryColor}30`,
              }}
              whileHover={{ scale: 1.3 }}
            />
          ))}
        </div>

        <motion.button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          style={{
            background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
            color: customization.backgroundColor,
          }}
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          whileHover={{ scale: 1.02, boxShadow: `0 4px 15px ${customization.primaryColor}40` }}
          whileTap={{ scale: 0.98 }}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </motion.div>

      {/* Results Info */}
      <motion.p
        className="text-center mt-4 text-xs opacity-50"
        style={{ color: customization.textColor }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.4 }}
      >
        Showing {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, 200)} of 200 results
      </motion.p>
    </div>
  );
}
