import { useState } from 'react';
import { formatCOP } from '../utils/formatters';
import type { AmortizationRow } from '../utils/financialMath';

interface AmortizationTableProps {
  schedule: AmortizationRow[];
}

const PAGE_SIZE = 12;

export function AmortizationTable({ schedule }: AmortizationTableProps) {
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(schedule.length / PAGE_SIZE);
  const visibleRows = expanded
    ? schedule.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
    : schedule.slice(0, PAGE_SIZE);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Tabla de Amortización</h2>
          <p className="text-xs text-gray-500 mt-0.5">{schedule.length} cuotas en total</p>
        </div>
        {schedule.length > PAGE_SIZE && (
          <button
            type="button"
            onClick={() => {
              setExpanded(e => !e);
              setPage(0);
            }}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
          >
            {expanded ? 'Colapsar' : 'Ver todo'}
          </button>
        )}
      </div>

      <div className="overflow-x-auto -mx-4 px-4">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 rounded-xl">
              <th className="sticky left-0 bg-gray-50 px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                Mes
              </th>
              <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                Cuota
              </th>
              <th className="px-3 py-2.5 text-right text-xs font-semibold text-amber-600 uppercase tracking-wide whitespace-nowrap">
                Interés
              </th>
              <th className="px-3 py-2.5 text-right text-xs font-semibold text-emerald-600 uppercase tracking-wide whitespace-nowrap">
                Capital
              </th>
              <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                Saldo
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {visibleRows.map(row => (
              <tr key={row.month} className="hover:bg-gray-50 transition-colors">
                <td className="sticky left-0 bg-white hover:bg-gray-50 px-3 py-2.5 font-medium text-gray-700 whitespace-nowrap">
                  {row.month}
                </td>
                <td className="px-3 py-2.5 text-right text-gray-900 font-mono text-xs whitespace-nowrap">
                  {formatCOP(row.payment)}
                </td>
                <td className="px-3 py-2.5 text-right text-amber-700 font-mono text-xs whitespace-nowrap">
                  {formatCOP(row.interest)}
                </td>
                <td className="px-3 py-2.5 text-right text-emerald-700 font-mono text-xs whitespace-nowrap">
                  {formatCOP(row.principal)}
                </td>
                <td className="px-3 py-2.5 text-right text-gray-600 font-mono text-xs whitespace-nowrap">
                  {formatCOP(row.balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination (only when expanded) */}
      {expanded && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            ← Anterior
          </button>
          <span className="text-xs text-gray-500">
            Página {page + 1} de {totalPages}
          </span>
          <button
            type="button"
            disabled={page === totalPages - 1}
            onClick={() => setPage(p => p + 1)}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            Siguiente →
          </button>
        </div>
      )}

      {!expanded && schedule.length > PAGE_SIZE && (
        <p className="mt-3 text-center text-xs text-gray-400">
          Mostrando primeros {PAGE_SIZE} meses · {schedule.length - PAGE_SIZE} meses restantes
        </p>
      )}
    </div>
  );
}
