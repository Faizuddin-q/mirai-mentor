"use client";

import { useState } from "react";
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
import { MoreVertical, Trash2, ExternalLink, Eye, Search } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      toast.success("Status updated successfully");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    }
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

  const filteredApplications = applications.filter((app) => {
    // Filter by status
    if (filterStatus && filterStatus !== "all" && app.status !== filterStatus) return false;
    
    // Filter by search query (company name or job title)
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
    setSearchQuery("");
    router.push("/applications");
  };

  return (
    <>
      <div className="mb-4 flex gap-2 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px] max-w-[400px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by company name or job title..."
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
            <SelectItem value="WISHLIST">Wishlist</SelectItem>
            <SelectItem value="APPLIED">Applied</SelectItem>
            <SelectItem value="OA">OA</SelectItem>
            <SelectItem value="INTERVIEW">Interview</SelectItem>
            <SelectItem value="OFFER">Offer</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
          </SelectContent>
        </Select>

        {(filterStatus !== "all" || searchQuery.trim()) && (
          <Button onClick={clearFilters} variant="ghost">
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
                  <TableCell>
                    <Badge variant="outline" className={statusColors[app.status]}>
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatJobType(app.jobType)}</TableCell>
                  <TableCell>
                    {app.jobLink ? (
                      <a
                        href={app.jobLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1 w-fit"
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
                          onClick={() => handleStatusChange(app.id, "APPLIED")}
                        >
                          Mark as Applied
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(app.id, "INTERVIEW")}
                        >
                          Mark as Interview
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(app.id, "REJECTED")}
                        >
                          Mark as Rejected
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(app.id, "OFFER")}
                        >
                          Mark as Offer
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

