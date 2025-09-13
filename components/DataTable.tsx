
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
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
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
              <tr key={rowIndex} className="bg-white border-b hover:bg-gray-50">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4 whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
             {rows.length === 0 && (
                <tr>
                    <td colSpan={headers.length} className="text-center py-8 text-gray-500">
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
                    <p className="font-semibold text-gray-600">{header}</p>
                    <div className="text-gray-800 break-words">{row[headerIndex]}</div>
                  </div>
                );
              })}
              {/* Actions are typically the last item, render them at the bottom of the card */}
              <div className="pt-2 border-t mt-3">
                 {row[headers.length - 1]}
              </div>
            </div>
          </Card>
        ))}
        {rows.length === 0 && (
            <div className="text-center py-8 text-gray-500">
                Nenhum registo encontrado.
            </div>
        )}
      </div>
    </Card>
  );
};

export default DataTable;
