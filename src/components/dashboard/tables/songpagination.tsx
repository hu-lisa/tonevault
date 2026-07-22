'use client';

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function SongPagination({ pageCount }: { pageCount: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page') ?? 1);
    const router = useRouter();

    function setPage(page: number) {
        console.log(`current page: ${currentPage}`);
        const params = new URLSearchParams(searchParams);
        params.set('page', String(page));
        router.replace(`${pathname}?${params}`);
    }

    return (
        <Pagination className="justify-end">
            <PaginationContent>

                <PaginationItem>
                    <PaginationPrevious
                        aria-disabled={currentPage <= 1}
                        tabIndex={currentPage <= 1 ? -1 : undefined}
                        className={
                            currentPage <= 1 ? "pointer-events-none opacity-50" : undefined
                        }
                        onClick={(e) => {
                            e.preventDefault();
                            setPage(currentPage - 1);
                        }}
                    />
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink
                        isActive={currentPage === 1}
                        onClick={(e) => {
                            e.preventDefault();
                            setPage(1);
                        }}
                    >1</PaginationLink>
                </PaginationItem>

                {currentPage > 3 &&
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                }

                {currentPage - 1 > 1 &&
                    <PaginationItem>
                        <PaginationLink
                            onClick={(e) => {
                                e.preventDefault();
                                setPage(currentPage - 1);
                            }}
                        >
                            {currentPage - 1}
                        </PaginationLink>
                    </PaginationItem>
                }

                {currentPage > 1 && currentPage < pageCount &&
                    <PaginationItem>
                        <PaginationLink
                            isActive
                            onClick={(e) => {
                                e.preventDefault();
                                setPage(currentPage);
                            }}
                        >
                            {currentPage}
                        </PaginationLink>
                    </PaginationItem>
                }

                {currentPage + 1 < pageCount &&
                    <PaginationItem>
                        <PaginationLink
                            onClick={(e) => {
                                e.preventDefault();
                                setPage(currentPage + 1);
                            }}
                        >
                            {currentPage + 1}
                        </PaginationLink>
                    </PaginationItem>
                }

                {currentPage + 2 < pageCount &&
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                }

                {pageCount > 1 &&
                    <PaginationItem>
                        <PaginationLink
                            isActive={currentPage === pageCount}
                            onClick={(e) => {
                                e.preventDefault();
                                setPage(pageCount);
                            }}
                        >
                            {pageCount}
                        </PaginationLink>
                    </PaginationItem>
                }


                <PaginationItem>
                    <PaginationNext
                        aria-disabled={currentPage >= pageCount}
                        tabIndex={currentPage >= pageCount ? -1 : undefined}
                        className={
                            currentPage >= pageCount ? "pointer-events-none opacity-50" : undefined
                        }
                        onClick={(e) => {
                            e.preventDefault();
                            setPage(currentPage + 1);
                        }}
                    />
                </PaginationItem>

            </PaginationContent>
        </Pagination>
    )
}