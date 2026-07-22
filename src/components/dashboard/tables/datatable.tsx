'use client'

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { SongPagination } from './songpagination';
import { useRouter, useSearchParams } from 'next/navigation';
import { SongWithTags } from '@/db/schema';

interface DataTableProps {
    columns: ColumnDef<SongWithTags, unknown>[],
    data: SongWithTags[],
    pageCount: number,
};

export function DataTable({
    columns,
    data,
    pageCount,
}: DataTableProps) {
    const router = useRouter();
    const table = useReactTable<SongWithTags>({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualFiltering: true,
    });
    const searchParams = useSearchParams();

    return (
        <div className="overflow-hidden">
            <Table className="table-fixed w-full">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id} style={{ width: header.getSize() }}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                    </TableHead>
                                )
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
                                onClick={() => router.push(`/dashboard/songs/${row.original.id}`)}
                                className="h-6 cursor-pointer hover:bg-muted/50"
                            >
                                {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    )
                                )}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                {searchParams.get('q')
                                    ? 'No results.'
                                    : 'No songs yet. Add one from the songs page!'
                                }
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div >
    )
}