"use client";

import { useState, useOptimistic, startTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MoreVertical, Trash2, ExternalLink, Eye, Search } from "lucide-react";
import { format } from "date-fns";
import {
  deleteApplication,
  updateApplicationStatus,
} from "@/actions/application";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  statusColors,
  statusMessages,
  dateRangeOptions,
  formatJobType,
} from "./constants";
import StatusChangeSelector from "./status-change-selector";

export default function ApplicationsList({ applications }) {
  const router = useRouter();

  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);

  const [optimisticApplications, setOptimisticApplications] = useOptimistic(
    applications,
    (state, { id, status }) =>
      state.map((app) => (app.id === id ? { ...app, status } : app)),
  );

  const handleStatusChange = (applicationId, newStatus) => {
    const previousStatus = optimisticApplications.find(
      (app) => app.id === applicationId,
    )?.status;

    startTransition(async () => {
      // Optimistic update
      setOptimisticApplications({ id: applicationId, status: newStatus });

      try {
        // Server update
        await updateApplicationStatus(applicationId, newStatus);

        toast.success(
          statusMessages[newStatus] || "Status updated successfully",
        );

        router.refresh();
      } catch (error) {
        // Rollback on failure
        setOptimisticApplications({
          id: applicationId,
          status: previousStatus,
        });

        toast.error(error.message || "Failed to update status");
      }
    });
  };

  const handleDelete = async () => {
    if (!applicationToDelete) return;

    try {
      await deleteApplication(applicationToDelete);
      toast.success("Application deleted successfully");
      setDeleteDialogOpen(false);
      setApplicationToDelete(null);
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to delete application");
    }
  };

  const filteredApplications = optimisticApplications.filter((app) => {
    if (filterStatus !== "all" && app.status !== filterStatus) return false;

    if (dateRange !== "all") {
      const appDate = new Date(app.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now - appDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const days = parseInt(dateRange); // 7, 14, 30
      if (diffDays > days) return false;
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const companyMatch = app.companyName.toLowerCase().includes(query);
      const jobTitleMatch = app.jobTitle.toLowerCase().includes(query);
      if (!companyMatch && !jobTitleMatch) return false;
    }

    return true;
  });

  const clearFilters = () => {
    setFilterStatus("all");
    setDateRange("all");
    setSearchQuery("");
    router.push("/applications");
  };

  return (
    <>
      <div className="glass-card rounded-xl p-6 border-primary/20">
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by company or job title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 border-white/10"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px] bg-white/5 backdrop-blur-md border-white/10 hover:border-primary/50 transition-colors text-foreground focus:ring-primary/20">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 backdrop-blur-xl border-white/10">
                <SelectItem
                  value="all"
                  className="focus:bg-white/10 focus:text-primary cursor-pointer transition-colors duration-200"
                >
                  <div className="flex items-center gap-2 text-muted-foreground group-focus:text-primary">
                    <span className="h-2 w-2 rounded-full border border-current opacity-50" />
                    All Statuses
                  </div>
                </SelectItem>
                {Object.keys(statusColors).map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    className="focus:bg-white/10 focus:text-primary cursor-pointer transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${statusColors[status]}`}
                      />
                      <span>{status}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full md:w-[180px] bg-white/5 backdrop-blur-md border-white/10 hover:border-primary/50 transition-colors text-foreground focus:ring-primary/20">
                <SelectValue placeholder="Filter by Days" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 backdrop-blur-xl border-white/10 text-foreground">
                {dateRangeOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="focus:bg-white/10 focus:text-primary cursor-pointer transition-colors duration-200"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(filterStatus !== "all" || dateRange !== "all" || searchQuery) && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-lg overflow-hidden border border-white/10">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="hover:bg-transparent border-white/10">
                <TableHead className="text-muted-foreground">S. No.</TableHead>
                <TableHead className="text-muted-foreground">Company</TableHead>
                <TableHead className="text-muted-foreground">
                  Job Title
                </TableHead>
                <TableHead className="text-muted-foreground">
                  Job Type
                </TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">
                  Job Link
                </TableHead>
                <TableHead className="text-muted-foreground">
                  Date Applied
                </TableHead>
                <TableHead className="text-center text-muted-foreground w-[120px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredApplications.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-12 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="p-4 rounded-full bg-white/5 mb-2">
                        <Eye className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p>No applications found.</p>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting filters or add a new application.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplications.map((app, index) => (
                  <TableRow
                    key={app.id}
                    className="hover:bg-white/5 transition-colors border-white/10 group"
                  >
                    <TableCell className="text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-bold">
                      {app.companyName}
                    </TableCell>
                    <TableCell>{app.jobTitle}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatJobType(app.jobType)}
                    </TableCell>
                    <TableCell>
                      <StatusChangeSelector
                        status={app.status}
                        onStatusChange={(newStatus) =>
                          handleStatusChange(app.id, newStatus)
                        }
                        size="sm"
                      />
                    </TableCell>
                    <TableCell>
                      {app.jobLink ? (
                        <a
                          href={app.jobLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group-hover:underline underline-offset-4"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="hidden lg:inline text-xs">View</span>
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>

                    <TableCell className="text-muted-foreground text-sm">
                      {app.appliedAt ? (
                        format(new Date(app.appliedAt), "MMM dd, yyyy")
                      ) : (
                        <span>—</span>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2 min-w-[170px]">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:text-primary hover:border-primary/50 transition-colors hover:bg-primary/10 gap-2 h-9 px-3 border border-white/10"
                          asChild
                        >
                          <Link href={`/applications/${app.id}`}>
                            <Eye className="h-4 w-4" />
                            <span>Details</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:text-destructive text-muted-foreground hover:border-destructive/50 hover:bg-destructive/10 transition-colors gap-2 h-9 px-3 border border-white/10"
                          onClick={() => {
                            setApplicationToDelete(app.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              application and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
