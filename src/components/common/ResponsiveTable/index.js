"use client";
import React from 'react';
import { Table, Empty, Pagination } from 'antd';
import { useIsMobile } from '@/lib/hooks/useBreakpoint';

/**
 * Drop-in replacement for antd <Table>. Renders the normal table on
 * tablet/desktop. On mobile it renders one card per row instead, built
 * from the same `columns` config (title/dataIndex/render), so existing
 * table column definitions don't need to be duplicated.
 *
 * Extra (optional) props beyond antd Table's:
 * - mobileTitleKey: column `key`/`dataIndex` to use as the card header (defaults to first column)
 * - mobileActionsKey: column `key`/`dataIndex` rendered as a full-width action row instead of a label:value line
 * - mobileHiddenKeys: array of column `key`/`dataIndex` to omit entirely on mobile cards
 */
export default function ResponsiveTable({
  columns = [],
  dataSource = [],
  rowKey = 'id',
  loading,
  pagination,
  mobileTitleKey,
  mobileActionsKey = 'actions',
  mobileHiddenKeys = [],
  onRow,
  locale,
  ...rest
}) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={rowKey}
        loading={loading}
        pagination={pagination}
        onRow={onRow}
        locale={locale}
        {...rest}
      />
    );
  }

  const getKey = (col) => col.key ?? col.dataIndex;
  const titleCol = columns.find((c) => getKey(c) === mobileTitleKey) || columns[0];
  const actionsCol = columns.find((c) => getKey(c) === mobileActionsKey);
  const bodyCols = columns.filter((c) => {
    const k = getKey(c);
    return k !== getKey(titleCol) && k !== getKey(actionsCol) && !mobileHiddenKeys.includes(k);
  });

  const renderCell = (col, record, index) => {
    const value = col.dataIndex ? record[col.dataIndex] : undefined;
    return col.render ? col.render(value, record, index) : value ?? '—';
  };

  if (loading) {
    return (
      <div className="rt-card-list">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rt-card" style={{ height: 88, opacity: 0.5 }} />
        ))}
      </div>
    );
  }

  if (!dataSource.length) {
    return (
      <div className="rt-card-empty">
        {locale?.emptyText || <Empty description="No data" />}
      </div>
    );
  }

  const pageSize = pagination?.pageSize;
  const current = pagination?.current || 1;
  const pagedData = pagination
    ? dataSource.slice((current - 1) * pageSize, current * pageSize)
    : dataSource;

  return (
    <div>
      <div className="rt-card-list">
        {pagedData.map((record, index) => {
          const key = typeof rowKey === 'function' ? rowKey(record) : record[rowKey] ?? index;
          const rowProps = onRow ? onRow(record, index) : {};
          return (
            <div key={key} className="rt-card" {...rowProps}>
              {titleCol && (
                <div style={{ marginBottom: 8, fontWeight: 700, fontSize: 14.5, color: 'var(--foreground)' }}>
                  {renderCell(titleCol, record, index)}
                </div>
              )}
              {bodyCols.map((col) => (
                <div className="rt-card-row" key={getKey(col)}>
                  <span className="rt-card-label">{typeof col.title === 'string' ? col.title : col.key}</span>
                  <span className="rt-card-value">{renderCell(col, record, index)}</span>
                </div>
              ))}
              {actionsCol && (
                <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {renderCell(actionsCol, record, index)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {pagination && (
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center' }}>
          <Pagination size="small" {...pagination} />
        </div>
      )}
    </div>
  );
}
