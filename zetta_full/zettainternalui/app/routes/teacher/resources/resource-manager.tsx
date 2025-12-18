"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Loader2,
  FileText,
  Trash2,
  Pencil,
  Plus,
  FolderOpen,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "~/api";

interface Lesson {
  id: string;
  name: string;
}

interface Resource {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  type: string;
  size: number;
  created_at: string;
}

const ResourceManager: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  // Form state
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  // Fetch lessons
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await api.get("/api/v1/admin/lessons");
        setLessons(response.data.lessons);
        if (response.data.lessons.length > 0) {
          setSelectedLesson(response.data.lessons[0].id);
        }
      } catch (error) {
        toast.success("Failed to fetch lessons");
      }
    };

    fetchLessons();
  }, []);

  // Fetch resources when lesson changes
  useEffect(() => {
    if (selectedLesson) {
      fetchResources();
    }
  }, [selectedLesson]);

  const fetchResources = async () => {
    if (!selectedLesson) return;

    setLoading(true);
    try {
      const response = await api.get(
        `/api/v1/teacher/resources/lessons/${selectedLesson}`
      );
      setResources(response.data.resources);
    } catch (error) {
      toast("Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  };

  const handleLessonChange = (value: string) => {
    setSelectedLesson(value);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFile(null);
    setEditingResource(null);
  };

  const openCreateForm = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEditForm = (resource: Resource) => {
    setEditingResource(resource);
    setTitle(resource.title);
    setDescription(resource.description || "");
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLesson) {
      toast("Please select a lesson");
      return;
    }

    if (
      editingResource &&
      !file &&
      title === editingResource.title &&
      description === (editingResource.description || "")
    ) {
      toast("No changes were made to the resource");
      setFormOpen(false);
      return;
    }

    const formData = new FormData();

    if (editingResource) {
      // Update existing resource
      formData.append("title", title);
      formData.append("description", description);
      if (file) {
        formData.append("file", file);
      }

      setUploading(true);
      try {
        await api.post(
          `/api/v1/teacher/resources/${editingResource.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success("Resource updated successfully");
        fetchResources();
        setFormOpen(false);
        resetForm();
      } catch (error) {
        toast("Failed to update resource");
      } finally {
        setUploading(false);
      }
    } else {
      // Create new resource
      if (!file) {
        toast("Please select a PDF file");
        return;
      }

      formData.append("lesson_id", selectedLesson);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", file);

      setUploading(true);
      try {
        await api.post("/api/v1/teacher/resources", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Resource created successfully");
        fetchResources();
        setFormOpen(false);
        resetForm();
      } catch (error) {
        toast("Failed to create resource");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) {
      return;
    }

    try {
      await api.delete(`/api/v1/teacher/resources/${id}`);
      toast.success("Resource deleted successfully");
      fetchResources();
    } catch (error) {
      toast("Failed to delete resource");
    }
  };

  const formatFileSize = (sizeInKB: number) => {
    if (sizeInKB < 1024) {
      return `${Math.round(sizeInKB)} KB`;
    } else {
      return `${(sizeInKB / 1024).toFixed(2)} MB`;
    }
  };

  return (
    <Card className="w-full shadow-md border-muted">
      <CardHeader className="bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              Lesson Resources
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              Manage PDF resources for your lessons
            </CardDescription>
          </div>
          <Button onClick={openCreateForm} size="sm" className="gap-1">
            <Plus className="h-4 w-4" /> Add Resource
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="w-full sm:w-72">
            <Label
              htmlFor="lesson-select"
              className="text-sm font-medium mb-1.5 block"
            >
              Select Lesson
            </Label>
            <Select
              value={selectedLesson || ""}
              onValueChange={handleLessonChange}
            >
              <SelectTrigger id="lesson-select" className="w-full">
                <SelectValue placeholder="Select a lesson" />
              </SelectTrigger>
              <SelectContent>
                {lessons.map((lesson) => (
                  <SelectItem key={lesson.id} value={lesson.id}>
                    {lesson.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchResources}
            disabled={!selectedLesson || loading}
            className="sm:mb-0.5"
          >
            <FolderOpen className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">
              Loading resources...
            </p>
          </div>
        ) : resources.length === 0 ? (
          <div className="bg-muted/30 rounded-lg flex flex-col items-center justify-center py-12 px-4">
            <FileText className="h-12 w-12 text-muted-foreground/60 mb-3" />
            <h3 className="text-lg font-medium mb-1">No resources found</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              {selectedLesson
                ? "This lesson doesn't have any resources yet. Click 'Add Resource' to upload a PDF."
                : "Please select a lesson to view its resources."}
            </p>
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-medium">Title</TableHead>
                  <TableHead className="font-medium">Description</TableHead>
                  <TableHead className="font-medium w-24">Size</TableHead>
                  <TableHead className="font-medium text-right w-32">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.map((resource) => (
                  <TableRow key={resource.id} className="group">
                    <TableCell className="font-medium">
                      {resource.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {resource.description || "-"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatFileSize(resource.size)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() =>
                            window.open(resource.file_url, "_blank")
                          }
                          title="View PDF"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => openEditForm(resource)}
                          title="Edit resource"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground "
                          onClick={() => handleDelete(resource.id)}
                          title="Delete resource"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingResource ? "Edit Resource" : "Add New Resource"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {editingResource
                ? "Update the resource details below"
                : "Upload a PDF resource for this lesson"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter resource title"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this resource"
                  className="resize-none"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file" className="text-sm font-medium">
                  {editingResource ? "Replace PDF file" : "PDF File"}
                  {editingResource && (
                    <span className="text-muted-foreground font-normal">
                      {" "}
                      (optional)
                    </span>
                  )}
                </Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf"
                  className="w-full cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                  required={!editingResource}
                />
                {editingResource && (
                  <p className="text-xs text-muted-foreground">
                    {file
                      ? `Selected: ${file.name} (${formatFileSize(
                          file.size / 1024
                        )})`
                      : "Leave empty to keep the current file"}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="flex justify-between sm:justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingResource ? "Update Resource" : "Upload Resource"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ResourceManager;
