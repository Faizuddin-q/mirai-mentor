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
import { MoreVertical, Trash2, ExternalLink, Eye } from "lucide-react";
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

export default function ApplicationsList({ applications }) {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState("all");
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
    if (filterStatus && filterStatus !== "all" && app.status !== filterStatus) return false;
    return true;
  });

  const updateFilters = () => {
    const params = new URLSearchParams();
    if (filterStatus && filterStatus !== "all") params.set("status", filterStatus);
    router.push(`/applications?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilterStatus("all");
    router.push("/applications");
  };

  return (
    <>
      <div className="mb-4 flex gap-2 flex-wrap">
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

        <Button onClick={updateFilters} variant="outline">
          Apply Filters
        </Button>
        {filterStatus !== "all" && (
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
              <TableHead>Status</TableHead>
              <TableHead>Job Link</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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

