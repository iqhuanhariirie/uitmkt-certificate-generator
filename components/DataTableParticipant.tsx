"use client";

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    Row,
    CellContext,
    RowSelectionState
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { BulkActions } from '@/components/BulkActions';
import { Participant } from "./ui/participant-columns";
import { DistributeCertificates } from './DistributeCertificates';

interface CellProps<TData> {
    row: Row<TData>;
    onRefresh?: () => Promise<void>;
}

type CustomCellContext<TData, TValue> = CellContext<TData, TValue> & {
    onRefresh?: () => Promise<void>;
};

interface DataTableProps {
    columns: ColumnDef<Participant, any>[];
    data: Participant[];
    onRefresh?: () => Promise<void>;
    eventName: string;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onRefresh,
    eventName
}: DataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    // Modify columns to include onRefresh
    const columnsWithRefresh = columns.map(col => {
        if (col.id === 'actions') {
            return {
                ...col,
                cell: (props: CellContext<Participant, any>) => {
                    const customProps = {
                        ...props,
                        onRefresh
                    };
                    return (col.cell as any)(customProps);
                }
            };
        }
        return col;
    });
    const tableKey = useMemo(() => JSON.stringify(data), [data]);

    const table = useReactTable({
        data,
        columns: columnsWithRefresh,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        state: {
            sorting,
            columnFilters,
            rowSelection
        },
    });

    return (
        <div key={tableKey}>
            <div className="flex items-center justify-between py-4">
                <DistributeCertificates
                    selectedParticipants={table.getSelectedRowModel().rows.map(row => row.original)}
                    eventName={eventName} // Pass this as a prop to DataTable
                    onRefresh={onRefresh}
                />
                <BulkActions table={table} onRefresh={onRefresh} />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}