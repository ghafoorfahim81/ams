import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import HighlightText from "@/Components/ui/HighlitText";
import { Button } from "@/Components/ui/button";
import { Edit } from "lucide-react";
import DeleteDialog from "@/Components/DeleteDialog";
import CancelDialog from "@/Components/CancelDialog";
import AppPaginator from "./AppPaginator";
import { cn, trans } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function DataTable({
    data,
    columns,
    actions,
    links,
    searchTerm,
    onSort,
    sortBy,
    getRowClassName,
    paginationMeta,
}) {
    // Determine if pagination should be shown
    const showPagination =
        data.length > 0 && // Only show if there are records
        links?.filter((link) => link.url !== null).length > 1; // Only show if there are multiple pages
    const translatedNoRecordsFound = trans("No_Records_Found");
    const rowColor = 'bg-red-400';

    // Calculate starting row number for pagination
    const getRowNumber = (rowIndex) => {
        if (!paginationMeta) return rowIndex + 1;
        const { current_page, per_page } = paginationMeta;
        return (current_page - 1) * per_page + rowIndex + 1;
    };
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => {
                            column.isSortable = column.isSortable ?? true;
                            return (
                                <TableHead
                                    className="rtl:text-right"
                                    key={column.key}
                                >
                                    {!column.isSortable ? (
                                        <div>{column.header}</div>
                                    ) : (
                                        <div
                                            className="flex items-center cursor-pointer"
                                            onClick={() => onSort(column.key)}
                                        >
                                            {column.header}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={cn(
                                                    "w-4 h-4 ml-1",
                                                    sortBy ===
                                                        `-${column.key}` &&
                                                        "rotate-180"
                                                )}
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </TableHead>
                            );
                        })}
                        {actions && (
                            <TableHead className="rtl:text-right">
                                {trans("Action")}
                            </TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length + (actions ? 1 : 0)}
                                className="text-center"
                            >
                                {translatedNoRecordsFound}
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row, rowIndex) => (
                            <TableRow
                                key={rowIndex}
                                className={cn(row.row_highlight_class,row.row_highlight_class )}
                            >
                                {columns.map((column) => (
                                    <TableCell key={column.key}>
                                        {column.isImage ? (
                                            <Avatar>
                                                <AvatarImage
                                                    src={row[column.key]}
                                                />
                                                <AvatarFallback>
                                                    A
                                                </AvatarFallback>
                                            </Avatar>
                                        ) : (
                                            <HighlightText
                                                text={
                                                    column.render
                                                        ? column.render(row, rowIndex)
                                                        : row[column.key]
                                                }
                                                searchTerm={searchTerm}
                                            />
                                        )}
                                    </TableCell>
                                ))}
                                {actions && (
                                    <TableCell  >
                                        {actions.map((action, index) => {
                                            if (
                                                action.type === "delete" &&
                                                action.can
                                            ) {
                                                return (
                                                    <DeleteDialog
                                                        key={index}
                                                        deleteUrl={action.deleteUrl(
                                                            row
                                                        )}
                                                        onSuccess={
                                                            action.onSuccess
                                                        }
                                                    >
                                                        <Button
                                                            variant="icon"
                                                            size="sm"
                                                        >
                                                            {action.icon}
                                                        </Button>
                                                    </DeleteDialog>
                                                );
                                            }
                                            if (
                                                action.type === "cancel" &&
                                                action.can
                                            ) {
                                                const statusValue = (row.status ?? "").toString().toLowerCase();
                                                const isCanceled = statusValue === "canceled" || statusValue === "cancelled";
                                                return (
                                                    <CancelDialog
                                                        key={index}
                                                        onConfirm={() => action.onClick(row)}
                                                    >
                                                        <Button
                                                            variant="icon"
                                                            size="sm"
                                                            disabled={isCanceled}
                                                        >
                                                            {action.icon}
                                                        </Button>
                                                    </CancelDialog>
                                                );
                                            }
                                            if (
                                                action.type === "view" &&
                                                action.can
                                            ) {
                                                return (
                                                    <Button
                                                        key={index}
                                                        variant="icon"
                                                        size="sm"
                                                        onClick={() => action.onClick(row)}
                                                    >
                                                        {action.icon}
                                                    </Button>
                                                );
                                            }
                                            return (
                                                action.can &&
                                                (action.url ? (
                                                    <Link
                                                        key={index}
                                                        href={action.url(row)}
                                                    >
                                                        <Button
                                                            className=""
                                                            size="sm"
                                                            variant="icon"
                                                        >
                                                            {action.icon}
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <Button
                                                        key={index}
                                                        onClick={() =>
                                                            action.onClick(row)
                                                        }
                                                        className=""
                                                        size="sm"
                                                        variant="icon"
                                                    >
                                                        {action.icon}
                                                    </Button>
                                                ))
                                            );
                                        })}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            {showPagination && <AppPaginator links={links} />}
        </>
    );
}
