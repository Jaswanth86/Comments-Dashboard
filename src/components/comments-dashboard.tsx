"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Comment } from '@/types';
import { usePersistentState } from '@/hooks/use-persistent-state';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from './ui/skeleton';

type SortableKey = 'postId' | 'name' | 'email';
type SortDirection = 'ascending' | 'descending';
interface SortConfig {
  key: SortableKey;
  direction: SortDirection;
}

interface CommentsDashboardProps {
  comments: Comment[];
}

export function CommentsDashboard({ comments }: CommentsDashboardProps) {
  const [searchTerm, setSearchTerm] = usePersistentState<string>('comments_searchTerm', '');
  const [sortConfig, setSortConfig] = usePersistentState<SortConfig | null>('comments_sortConfig', null);
  const [currentPage, setCurrentPage] = usePersistentState<number>('comments_currentPage', 1);
  const [pageSize, setPageSize] = usePersistentState<number>('comments_pageSize', 10);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSort = useCallback((key: SortableKey) => {
    if (sortConfig?.key === key) {
      if (sortConfig.direction === 'ascending') {
        setSortConfig({ key, direction: 'descending' });
      } else {
        setSortConfig(null);
      }
    } else {
      setSortConfig({ key, direction: 'ascending' });
    }
  }, [sortConfig, setSortConfig]);

  const filteredComments = useMemo(() => {
    if (!searchTerm) return comments;
    const lowercasedFilter = searchTerm.toLowerCase();
    return comments.filter(comment =>
      comment.name.toLowerCase().includes(lowercasedFilter) ||
      comment.email.toLowerCase().includes(lowercasedFilter) ||
      comment.body.toLowerCase().includes(lowercasedFilter)
    );
  }, [comments, searchTerm]);

  const sortedComments = useMemo(() => {
    let sortableItems = [...filteredComments];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredComments, sortConfig]);

  const totalPages = Math.ceil(sortedComments.length / pageSize);
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages > 0 ? totalPages : 1));

  const paginatedComments = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return sortedComments.slice(startIndex, startIndex + pageSize);
  }, [sortedComments, safeCurrentPage, pageSize]);
  
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages, setCurrentPage]);

  const getSortIcon = (key: SortableKey) => {
    if (sortConfig?.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    if (sortConfig.direction === 'ascending') {
      return <ArrowUp className="ml-2 h-4 w-4 text-primary" />;
    }
    return <ArrowDown className="ml-2 h-4 w-4 text-primary" />;
  };

  if (!isClient) {
    return (
        <Card className="shadow-lg w-full">
            <CardContent className="p-4 md:p-6">
                <div className="flex justify-between mb-6">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-40" />
                </div>
                <div className="rounded-md border">
                    <Skeleton className="h-[600px] w-full" />
                </div>
                 <div className="flex items-center justify-between mt-6">
                    <Skeleton className="h-6 w-48" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="shadow-lg w-full animate-in fade-in-50 duration-500">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, email, or comment..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">
                  <Button variant="ghost" onClick={() => handleSort('postId')}>
                    Post ID {getSortIcon('postId')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('name')}>
                    Name {getSortIcon('name')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('email')}>
                    Email {getSortIcon('email')}
                  </Button>
                </TableHead>
                <TableHead>Comment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedComments.length > 0 ? (
                paginatedComments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell className="text-center">{comment.postId}</TableCell>
                    <TableCell className="font-medium">{comment.name}</TableCell>
                    <TableCell>{comment.email}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{comment.body}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {paginatedComments.length > 0 ? (safeCurrentPage - 1) * pageSize + 1 : 0} to {Math.min(safeCurrentPage * pageSize, sortedComments.length)} of {sortedComments.length} entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(safeCurrentPage - 1)}
              disabled={safeCurrentPage <= 1}
            >
              Previous
            </Button>
            <span className="text-sm font-medium whitespace-nowrap">
              Page {safeCurrentPage} of {totalPages > 0 ? totalPages : 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(safeCurrentPage + 1)}
              disabled={safeCurrentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
