'use client'

import React from 'react';
import { motion } from 'framer-motion';

interface TableColumn<T> {
  key: keyof T;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  striped?: boolean;
  hoverable?: boolean;
  className?: string;
  sortBy?: keyof T;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: keyof T, order: 'asc' | 'desc') => void;
}

function Table<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  striped = true,
  hoverable = true,
  className = '',
  sortBy,
  sortOrder,
  onSort
}: TableProps<T>) {
  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable || !onSort) return;
    
    const newOrder = sortBy === column.key && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(column.key, newOrder);
  };

  const getSortIcon = (column: TableColumn<T>) => {
    if (!column.sortable) return null;
    
    if (sortBy === column.key) {
      return sortOrder === 'asc' ? '↑' : '↓';
    }
    return '↕';
  };

  if (loading) {
    return (
      <div className={`w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
        <div className="flex h-64 items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-gray-600">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <span className="text-gray-400">{getSortIcon(column)}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <motion.tr
                  key={rowIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: rowIndex * 0.05 }}
                  className={`${
                    striped && rowIndex % 2 === 1 ? 'bg-gray-50' : 'bg-white'
                  } ${
                    hoverable ? 'hover:bg-gray-100' : ''
                  } ${
                    onRowClick ? 'cursor-pointer' : ''
                  } transition-colors duration-150`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : String(row[column.key] ?? '')}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
export type { TableColumn, TableProps };