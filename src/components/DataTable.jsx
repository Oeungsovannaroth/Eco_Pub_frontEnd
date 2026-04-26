function DataTable({ columns, data, actions }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                >
                  {column.label}
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-6 text-center text-sm text-gray-500"
                >
                  No data found.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row._id || row.id} className="border-t">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-3 text-sm text-gray-700"
                    >
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}

                  {actions && (
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {actions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => action.onClick(row)}
                            className={action.className}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;   