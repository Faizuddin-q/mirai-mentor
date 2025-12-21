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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2, ExternalLink, Eye, Search, Check, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { deleteApplication, updateApplicationStatus } from "@/actions/application";
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

const statusColors = {
  WISHLIST: "bg-gray-500",
  APPLIED: "bg-blue-500",
  OA: "bg-purple-500",
  INTERVIEW: "bg-yellow-500",
  OFFER: "bg-green-500",
  REJECTED: "bg-red-500",
  WITHDRAWN: "bg-gray-400",
};

const dateRangeOptions = [
  { value: "all", label: "All Time" },
  { value: "7", label: "Last 7 Days" },
  { value: "14", label: "Last 14 Days" },
  { value: "30", label: "Last 30 Days" },
];

const statusMessages = {
  WISHLIST: "Added to your wishlist!",
  APPLIED: "Application sent! Good luck!",
  OA: "Online Assessment received! You got this!",
  INTERVIEW: "Interview scheduled! Go get them!",
  OFFER: "Offer received! Congratulations!",
  REJECTED: "Keep going! The right one is out there.",
  WITHDRAWN: "Application withdrawn. On to the next!",
};

export const formatJobType = (jobType) => {
  const jobTypeMap = {
    FULL_TIME: "Full Time",
    INTERN: "Intern",
    REMOTE: "Remote",
    HYBRID: "Hybrid",
    CONTRACT: "Contract",
  };
  return jobTypeMap[jobType] || jobType;
};

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
      state.map((app) =>
        app.id === id ? { ...app, status } : app
      )
  );

  const handleStatusChange = (applicationId, newStatus) => {
    const previousStatus = optimisticApplications.find(
      (app) => app.id === applicationId
    )?.status;

    startTransition(async () => {
    // Optimistic update
      setOptimisticApplications({ id: applicationId, status: newStatus });

      try {
      // Server update
        await updateApplicationStatus(applicationId, newStatus);

        toast.success(
          statusMessages[newStatus] || "Status updated successfully"
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
      <div className="mb-4 flex gap-2 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px] max-w-[400px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by company or job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.keys(statusColors).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Days" />
          </SelectTrigger>
          <SelectContent>
            {dateRangeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(filterStatus !== "all" ||
          dateRange !== "all" ||
          searchQuery) && (
          <Button variant="ghost" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Job Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Job Link</TableHead>
              <TableHead>Date Applied</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No applications found. Add your first application to get started.
                </TableCell>
              </TableRow>
            ) : (
              filteredApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.companyName}</TableCell>
                  <TableCell>{app.jobTitle}</TableCell>
                  <TableCell>{formatJobType(app.jobType)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Badge
                          variant="outline"
                          className={`${statusColors[app.status]} cursor-pointer flex w-fit items-center gap-1`}
                        >
                          {app.status}
                          <ChevronDown className="h-3 w-3" />
                        </Badge>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {Object.keys(statusColors).map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => handleStatusChange(app.id, status)}
                            className={status === app.status ? "bg-primary" : ""}
                          >
                            <span className={`w-2 h-2 rounded-full mr-2 ${statusColors[status]}`} />
                            {status}
                            {status === app.status && (
                              <Check className="ml-auto h-4 w-4" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    {app.jobLink ? (
                      <a
                        href={app.jobLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Job Link
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>

                  <TableCell>
                    {app.appliedAt ? (
                      format(new Date(app.appliedAt), "MMM dd, yyyy")
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/applications/${app.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            More Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setApplicationToDelete(app.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              application and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

