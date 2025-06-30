import React from "react";

type Column<T> = {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
};

type ReusableTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  className?: string;
};

export function ReusableTable<T extends object>({
  columns,
  data,
  className = "",
}: ReusableTableProps<T>) {
  return (
    <div className={`overflow-x-auto rounded-lg bg-white ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            {columns.map((col: Column<T>, idx: number) => (
              <th
                key={idx}
                className={`px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 ${
                  col?.className ?? ""
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, ridx) => (
            <tr key={ridx} className="border hover:bg-gray-50">
              {columns?.map((col: Column<T>, cidx: number) => (
                <td
                  key={cidx}
                  className={`px-4 py-3 text-sm ${col.className ?? ""}`}
                >
                  {typeof col.accessor === "function"
                    ? col.accessor(row)
                    : (row[col.accessor] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// this is an example usage of your table in which ever component you are using it

// adjust the import path as needed

type User = {
  id: number;
  name: string;
  email: string;
  active: boolean;
};

const columns = [
  {
    header: "ID",
    accessor: "id",
    className: "w-12",
  },
  {
    header: "Name",
    accessor: "name",
  },
  {
    header: "Email",
    accessor: (row: User) => <a href={`mailto:${row.email}`}>{row.email}</a>,
  },
  {
    header: "Status",
    accessor: (row: User) => (
      <span style={{ color: row.active ? "green" : "red" }}>
        {row.active ? "Active" : "Inactive"}
      </span>
    ),
  },
];

const data = [
  { id: 1, name: "Alice", email: "alice@email.com", active: true },
  { id: 2, name: "Bob", email: "bob@email.com", active: false },
];

export default function ExampleTable() {
  return <ReusableTable<User> columns={columns} data={data} />;
}