import { Plus, Trash2 } from 'lucide-react';

export interface NestedFormColumn {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'email' | 'date' | 'tel' | 'url';
  required?: boolean;
  placeholder?: string;
}

export interface NestedFormInputProps {
  columns: NestedFormColumn[];
  value: Record<string, any>[];
  onChange: (value: Record<string, any>[]) => void;
  label?: string;
  minRows?: number;
  maxRows?: number;
  addButtonLabel?: string;
  className?: string;
}

export default function NestedFormInput({
  columns,
  value,
  onChange,
  label,
  minRows = 1,
  maxRows,
  addButtonLabel = 'Add Row',
  className = '',
}: NestedFormInputProps) {
  const rows = value || [];
  const canAddRow = maxRows === undefined || rows.length < maxRows;
  const canRemoveRow = rows.length > minRows;

  const handleAddRow = () => {
    if (!canAddRow) return;
    const newRow: Record<string, any> = {};
    columns.forEach((col) => {
      newRow[col.name] = '';
    });
    onChange([...rows, newRow]);
  };

  const handleRemoveRow = (index: number) => {
    if (!canRemoveRow) return;
    onChange(rows.filter((_, i) => i !== index));
  };

  const handleFieldChange = (rowIndex: number, columnName: string, fieldValue: any) => {
    const updated = [...rows];
    updated[rowIndex] = {
      ...updated[rowIndex],
      [columnName]: fieldValue,
    };
    onChange(updated);
  };

  if (rows.length === 0 && minRows > 0) {
    const initialRow: Record<string, any> = {};
    columns.forEach((col) => {
      initialRow[col.name] = '';
    });
    onChange([initialRow]);
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {label && <label className="block text-sm font-medium">{label}</label>}

      {rows.length > 0 ? (
        <div className="space-y-3">
          {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex gap-3 items-end p-4 bg-secondary/40 rounded-lg border border-border"
          >
            <div className="flex-1 grid gap-3" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
              {columns.map((column) => (
                <div key={`${rowIndex}-${column.name}`}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    {column.label}
                    {column.required && <span className="text-destructive ml-1">*</span>}
                  </label>
                  <input
                    type={column.type || 'text'}
                    value={row[column.name] ?? ''}
                    onChange={(e) => handleFieldChange(rowIndex, column.name, e.target.value)}
                    placeholder={column.placeholder}
                    required={column.required}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleRemoveRow(rowIndex)}
              disabled={!canRemoveRow}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Remove row"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border bg-secondary/20 px-4 py-6 text-sm text-muted-foreground">
          No rows added.
        </div>
      )}

      <button
        type="button"
        onClick={handleAddRow}
        disabled={!canAddRow}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
        {addButtonLabel}
      </button>
    </div>
  );
}
