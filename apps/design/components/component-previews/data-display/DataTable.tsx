'use client';

import { motion } from 'framer-motion';
import { ArrowUpDown, MoreHorizontal, ChevronDown, Search } from 'lucide-react';
import { Customization } from '@/types/customization';

type DataTableProps = {
  customization: Customization;
};

export function DataTable({ customization }: DataTableProps) {
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityHex = Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'date', label: 'Date', sortable: false },
    { key: 'actions', label: '', sortable: false },
  ];

  const data = [
    { id: 1, name: 'John Smith', email: 'john@example.com', status: 'Active', amount: '$1,234.00', date: 'Dec 12, 2024' },
    { id: 2, name: 'Sarah Connor', email: 'sarah@example.com', status: 'Pending', amount: '$892.50', date: 'Dec 11, 2024' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'Active', amount: '$2,150.00', date: 'Dec 10, 2024' },
    { id: 4, name: 'Emma Wilson', email: 'emma@example.com', status: 'Inactive', amount: '$678.25', date: 'Dec 09, 2024' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return '#10b981';
      case 'Pending':
        return '#f59e0b';
      case 'Inactive':
        return '#6b7280';
      default:
        return customization.textColor;
    }
  };

  return (
    <div className="w-full max-w-4xl" style={baseStyle}>
      <motion.div
        className="border overflow-hidden"
        style={{
          backgroundColor: `${customization.backgroundColor}${opacityHex}`,
          borderColor: `${customization.primaryColor}30`,
          borderRadius: `${customization.borderRadius}px`,
          boxShadow: `0 8px 32px ${customization.primaryColor}${Math.round(shadowIntensity * 0.4).toString(16).padStart(2, '0')}`,
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: `${customization.primaryColor}20` }}
        >
          <div>
            <h3 className="font-semibold" style={{ color: customization.textColor }}>
              Recent Transactions
            </h3>
            <p className="text-xs mt-0.5" style={{ color: `${customization.textColor}60` }}>
              Showing 4 of 248 transactions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
              style={{
                borderColor: `${customization.primaryColor}30`,
                backgroundColor: `${customization.primaryColor}10`,
              }}
              whileHover={{ borderColor: customization.primaryColor }}
            >
              <Search className="w-3.5 h-3.5" style={{ color: `${customization.textColor}50` }} />
              <span className="text-xs" style={{ color: `${customization.textColor}50` }}>
                Search...
              </span>
            </motion.div>
            <motion.button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{
                backgroundColor: customization.primaryColor,
                color: customization.backgroundColor,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Filter
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: `${customization.primaryColor}08` }}>
                {columns.map((column, index) => (
                  <motion.th
                    key={column.key}
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: `${customization.textColor}60` }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {column.sortable ? (
                      <motion.button
                        className="flex items-center gap-1.5 hover:opacity-80"
                        whileHover={{ scale: 1.02 }}
                      >
                        {column.label}
                        <ArrowUpDown className="w-3 h-3" />
                      </motion.button>
                    ) : (
                      column.label
                    )}
                  </motion.th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <motion.tr
                  key={row.id}
                  className="border-t transition-colors"
                  style={{ borderColor: `${customization.primaryColor}10` }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + rowIndex * 0.08 }}
                  whileHover={{
                    backgroundColor: `${customization.primaryColor}08`,
                  }}
                >
                  {/* Name cell */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                        style={{
                          background: `linear-gradient(135deg, ${customization.primaryColor}40, ${customization.secondaryColor}40)`,
                          color: customization.primaryColor,
                        }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {row.name.split(' ').map(n => n[0]).join('')}
                      </motion.div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: customization.textColor }}>
                          {row.name}
                        </p>
                        <p className="text-xs" style={{ color: `${customization.textColor}50` }}>
                          {row.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Status cell */}
                  <td className="px-4 py-3">
                    <motion.span
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${getStatusColor(row.status)}15`,
                        color: getStatusColor(row.status),
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: getStatusColor(row.status) }}
                      />
                      {row.status}
                    </motion.span>
                  </td>

                  {/* Amount cell */}
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium" style={{ color: customization.textColor }}>
                      {row.amount}
                    </span>
                  </td>

                  {/* Date cell */}
                  <td className="px-4 py-3">
                    <span className="text-sm" style={{ color: `${customization.textColor}60` }}>
                      {row.date}
                    </span>
                  </td>

                  {/* Actions cell */}
                  <td className="px-4 py-3">
                    <motion.button
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: `${customization.textColor}50` }}
                      whileHover={{
                        backgroundColor: `${customization.primaryColor}15`,
                        color: customization.primaryColor,
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-4 py-3 border-t"
          style={{ borderColor: `${customization.primaryColor}20` }}
        >
          <span className="text-xs" style={{ color: `${customization.textColor}50` }}>
            Page 1 of 25
          </span>
          <div className="flex items-center gap-2">
            <motion.button
              className="px-3 py-1.5 rounded-lg text-xs font-medium border"
              style={{
                borderColor: `${customization.primaryColor}30`,
                color: `${customization.textColor}70`,
              }}
              whileHover={{ borderColor: customization.primaryColor }}
              whileTap={{ scale: 0.98 }}
            >
              Previous
            </motion.button>
            <motion.button
              className="px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{
                backgroundColor: customization.primaryColor,
                color: customization.backgroundColor,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Next
            </motion.button>
          </div>
        </div>
      </motion.div>

      <p className="text-xs opacity-50 text-center mt-3" style={{ color: customization.textColor }}>
        Styled data table with sortable columns
      </p>
    </div>
  );
}
