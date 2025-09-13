
import React from 'react';
import { Card } from './ui/Card';

interface DataTableProps {
  headers: string[];
  rows: (string | React.ReactNode)[][];
  title: string;
}

const DataTable: React.FC<DataTableProps> = ({ headers, rows, title }) => {
  return (
    <Card>
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
          <thead className="text-xs text-slate-600 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-700/50">
            <tr>
              {headers.map((header, index) => (
                <th key={index} scope="col" className="px-6 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4 whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
             {rows.length === 0 && (
                <tr>
                    <td colSpan={headers.length} className="text-center py-8 text-slate-500 dark:text-slate-400">
                        Nenhum registo encontrado.
                    </td>
                </tr>
             )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden p-4 space-y-4">
        {rows.map((row, rowIndex) => (
          <Card key={rowIndex} className="shadow-md">
            <div className="p-4 space-y-3">
              {headers.map((header, headerIndex) => {
                // Don't render an empty row for the "Ações" header in card view, handle it separately.
                if (header.toLowerCase() === 'ações') return null;
                
                return (
                  <div key={headerIndex} className="text-sm">
                    <p className="font-semibold text-slate-600 dark:text-slate-300">{header}</p>
                    <div className="text-slate-800 dark:text-slate-100 break-words">{row[headerIndex]}</div>
                  </div>
                );
              })}
              {/* Actions are typically the last item, render them at the bottom of the card */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 mt-3">
                 {row[headers.length - 1]}
              </div>
            </div>
          </Card>
        ))}
        {rows.length === 0 && (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                Nenhum registo encontrado.
            </div>
        )}
      </div>
    </Card>
  );
};

export default DataTable;