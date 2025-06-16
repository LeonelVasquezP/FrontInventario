import React from 'react';
import '../../assets/TablaDatos.css';


type Props<T> = {
  columnas: { key: keyof T | string; label: string; render?: (fila: T) => React.ReactNode }[];
  datos: T[];
};

function TablaDatos<T>({ columnas, datos }: Props<T>) {
  return (
    <table className="table table-hover shadow-sm bg-white rounded">
      <thead className="table-light">
        <tr>
          {columnas.map(col => (
            <th key={String(col.key)}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {datos.length > 0 ? (
          datos.map((fila, i) => (
            <tr key={i}>
              {columnas.map(col => (
                <td key={String(col.key)}>
                  {col.render ? col.render(fila) : String((fila as any)[col.key])}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columnas.length} className="text-center text-muted">
              No hay datos disponibles.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default TablaDatos;
