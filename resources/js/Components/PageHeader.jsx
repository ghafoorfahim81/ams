import { Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import Header from "@/Components/Header";
import { trans } from "@/lib/utils";

export default function PageHeader({
    title,
    route,
    routeText,
    viewRoute,
    editRoute,
    children,
    canCreate = false,
    canEdit = false,
    canView = false,
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex gap-x-4">
                <Header text={title} />
                <div className="flex gap-x-2">{children}</div>
            </div>
            <div className="flex items-center gap-x-4">
                {viewRoute && canView && (
                    <Link href={viewRoute}>
                        <Button variant="outline">{trans("View")}</Button>
                    </Link>
                )}
                {editRoute && canEdit && (
                    <Link href={editRoute}>
                        <Button variant="outline">
                            {trans("Edit", { name: "" })}
                        </Button>
                    </Link>
                )}
                {canCreate && (
                    <Link href={route}>
                        <Button variant="default">{routeText}</Button>
                    </Link>
                )}
            </div>
            <Head title={title} />
        </div>
    );
}
