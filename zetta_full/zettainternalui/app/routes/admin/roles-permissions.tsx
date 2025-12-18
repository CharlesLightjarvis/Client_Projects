import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Skeleton } from "~/components/ui/skeleton";
import { Checkbox } from "~/components/ui/checkbox";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Shield,
  Users,
  Settings,
  Loader2,
} from "lucide-react";
import { rolesPermissionsApi } from "~/lib/api/roles-permissions-for-roles";
import { RoleFormDialog } from "~/components/roles-permissions/RoleFormDialog";
import { PermissionFormDialog } from "~/components/roles-permissions/PermissionFormDialog";
import {
  getUserFriendlyErrorMessage,
  SUCCESS_MESSAGES,
} from "~/lib/utils/error-handling";
import { toast } from "sonner";
import type {
  Role,
  Permission,
  RoleFormData,
  PermissionFormData,
} from "~/types/roles-permissions";

const RolesPermissions = () => {
  const [activeTab, setActiveTab] = useState("roles");
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [roleFormOpen, setRoleFormOpen] = useState(false);
  const [permissionFormOpen, setPermissionFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null
  );
  const [formLoading, setFormLoading] = useState(false);

  // Role permissions dialog states
  const [rolePermissionsOpen, setRolePermissionsOpen] = useState(false);
  const [managingRole, setManagingRole] = useState<Role | null>(null);
  const [rolePermissionsLoading, setRolePermissionsLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  console.log("roles", roles);

  // Filter data based on search term
  useEffect(() => {
    const filtered = roles.filter(
      (role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (role.description &&
          role.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredRoles(filtered);
  }, [roles, searchTerm]);

  useEffect(() => {
    const filtered = permissions.filter(
      (permission) =>
        permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (permission.description &&
          permission.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    );
    setFilteredPermissions(filtered);
  }, [permissions, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [rolesData, permissionsData] = await Promise.all([
        rolesPermissionsApi.roles.getAll(),
        rolesPermissionsApi.permissions.getAll(),
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (err) {
      setError(getUserFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message: string) => {
    toast.success("Success", { description: message });
    setSuccess(message);
    setTimeout(() => setSuccess(null), 5000);
  };

  const showError = (message: string) => {
    toast.error("Error", { description: message });
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const handleCreateRole = () => {
    setEditingRole(null);
    setRoleFormOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleFormOpen(true);
  };

  const handleCreatePermission = () => {
    setEditingPermission(null);
    setPermissionFormOpen(true);
  };

  const handleEditPermission = (permission: Permission) => {
    setEditingPermission(permission);
    setPermissionFormOpen(true);
  };

  const handleRoleSubmit = async (data: RoleFormData) => {
    try {
      setFormLoading(true);
      if (editingRole) {
        const updatedRole = await rolesPermissionsApi.roles.update(
          editingRole.id,
          data
        );
        setRoles((prev) =>
          prev.map((r) => (r.id === editingRole.id ? updatedRole : r))
        );
        showSuccess(SUCCESS_MESSAGES.ROLE_UPDATED);
      } else {
        await rolesPermissionsApi.roles.create(data);
        showSuccess(SUCCESS_MESSAGES.ROLE_CREATED);

        // Recharger tous les rôles au lieu d'ajouter juste le nouveau
        const allRoles = await rolesPermissionsApi.roles.getAll();
        setRoles(allRoles);
      }
      setRoleFormOpen(false);
    } catch (err) {
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handlePermissionSubmit = async (data: PermissionFormData) => {
    try {
      setFormLoading(true);
      if (editingPermission) {
        const updatedPermission = await rolesPermissionsApi.permissions.update(
          editingPermission.id,
          data
        );
        setPermissions((prev) =>
          prev.map((p) =>
            p.id === editingPermission.id ? updatedPermission : p
          )
        );
        showSuccess(SUCCESS_MESSAGES.PERMISSION_UPDATED);
      } else {
        const newPermission = await rolesPermissionsApi.permissions.create(
          data
        );
        setPermissions((prev) => [...prev, newPermission]);
        showSuccess(SUCCESS_MESSAGES.PERMISSION_CREATED);
      }
      setPermissionFormOpen(false);
    } catch (err) {
      // Let the form component handle the error display
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      await rolesPermissionsApi.roles.delete(roleId);
      setRoles((prev) => prev.filter((r) => r.id !== roleId));
      showSuccess(SUCCESS_MESSAGES.ROLE_DELETED);
    } catch (err) {
      showError(getUserFriendlyErrorMessage(err));
    }
  };

  const handleDeletePermission = async (permissionId: string) => {
    try {
      await rolesPermissionsApi.permissions.delete(permissionId);
      setPermissions((prev) => prev.filter((p) => p.id !== permissionId));
      showSuccess(SUCCESS_MESSAGES.PERMISSION_DELETED);
    } catch (err) {
      showError(getUserFriendlyErrorMessage(err));
    }
  };

  const handleManagePermissions = (role: Role) => {
    setManagingRole(role);
    setRolePermissionsOpen(true);
  };

  const handleAssignPermissions = async (
    roleId: string,
    permissionIds: string[]
  ) => {
    try {
      setRolePermissionsLoading(true);
      await rolesPermissionsApi.rolePermissions.assignPermissions(
        roleId,
        permissionIds
      );

      // Refresh the role data to get updated permissions
      const updatedRole = await rolesPermissionsApi.roles.getById(roleId);
      setRoles((prev) => prev.map((r) => (r.id === roleId ? updatedRole : r)));
      setManagingRole(updatedRole);

      showSuccess(SUCCESS_MESSAGES.PERMISSIONS_ASSIGNED);
    } catch (err) {
      showError(getUserFriendlyErrorMessage(err));
    } finally {
      setRolePermissionsLoading(false);
    }
  };

  const handleRevokePermissions = async (
    roleId: string,
    permissionIds: string[]
  ) => {
    try {
      setRolePermissionsLoading(true);
      await rolesPermissionsApi.rolePermissions.revokePermissions(
        roleId,
        permissionIds
      );

      // Refresh the role data to get updated permissions
      const updatedRole = await rolesPermissionsApi.roles.getById(roleId);
      setRoles((prev) => prev.map((r) => (r.id === roleId ? updatedRole : r)));
      setManagingRole(updatedRole);

      showSuccess(SUCCESS_MESSAGES.PERMISSIONS_REVOKED);
    } catch (err) {
      showError(getUserFriendlyErrorMessage(err));
    } finally {
      setRolePermissionsLoading(false);
    }
  };

  const handleSyncPermissions = async (
    roleId: string,
    permissionIds: string[]
  ) => {
    try {
      setRolePermissionsLoading(true);
      await rolesPermissionsApi.rolePermissions.syncPermissions(
        roleId,
        permissionIds
      );

      // Refresh the role data to get updated permissions
      const updatedRole = await rolesPermissionsApi.roles.getById(roleId);
      setRoles((prev) => prev.map((r) => (r.id === roleId ? updatedRole : r)));
      setManagingRole(updatedRole);

      showSuccess(SUCCESS_MESSAGES.PERMISSIONS_SYNCED);
    } catch (err) {
      showError(getUserFriendlyErrorMessage(err));
    } finally {
      setRolePermissionsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-4 px-4 sm:py-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Role & Permission Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage roles, permissions, and access control
          </p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger
            value="roles"
            className="flex items-center gap-1 sm:gap-2 py-2 px-3 sm:px-4"
          >
            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-sm sm:text-base">Roles</span>
          </TabsTrigger>
          <TabsTrigger
            value="permissions"
            className="flex items-center gap-1 sm:gap-2 py-2 px-3 sm:px-4"
          >
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-sm sm:text-base">Permissions</span>
          </TabsTrigger>
        </TabsList>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            <div className="relative flex-1 max-w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
            <Button
              onClick={handleCreateRole}
              className="flex items-center justify-center gap-2 h-10 px-4 whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create Role</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-1/2" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <div className="flex flex-wrap gap-1">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-14 rounded-full" />
                      </div>
                    </div>
                    <Skeleton className="h-9 w-full rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredRoles.map((role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onEdit={handleEditRole}
                  onDelete={handleDeleteRole}
                  onManagePermissions={handleManagePermissions}
                />
              ))}
            </div>
          )}

          {!loading && filteredRoles.length === 0 && (
            <div className="text-center py-12">
              <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No roles found</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Get started by creating your first role"}
              </p>
            </div>
          )}
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            <div className="relative flex-1 max-w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
            <Button
              onClick={handleCreatePermission}
              className="flex items-center justify-center gap-2 h-10 px-4 whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create Permission</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <div className="flex flex-wrap gap-1">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredPermissions.map((permission) => (
                <PermissionCard
                  key={permission.id}
                  permission={permission}
                  roles={roles}
                  onEdit={handleEditPermission}
                  onDelete={handleDeletePermission}
                />
              ))}
            </div>
          )}

          {!loading && filteredPermissions.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                No permissions found
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Get started by creating your first permission"}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Role Form Dialog */}
      <RoleFormDialog
        open={roleFormOpen}
        onOpenChange={setRoleFormOpen}
        role={editingRole}
        onSubmit={handleRoleSubmit}
        loading={formLoading}
        existingRoles={roles}
      />

      {/* Permission Form Dialog */}
      <PermissionFormDialog
        open={permissionFormOpen}
        onOpenChange={setPermissionFormOpen}
        permission={editingPermission}
        onSubmit={handlePermissionSubmit}
        loading={formLoading}
        existingPermissions={permissions}
      />

      {/* Role Permissions Management Dialog */}
      <RolePermissionsDialog
        open={rolePermissionsOpen}
        onOpenChange={setRolePermissionsOpen}
        role={managingRole}
        allPermissions={permissions}
        onAssign={handleAssignPermissions}
        onRevoke={handleRevokePermissions}
        onSync={handleSyncPermissions}
        loading={rolePermissionsLoading}
      />
    </div>
  );
};

export default RolesPermissions;

// Role Permissions Management Dialog Component
interface RolePermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  allPermissions: Permission[];
  onAssign: (roleId: string, permissionIds: string[]) => Promise<void>;
  onRevoke: (roleId: string, permissionIds: string[]) => Promise<void>;
  onSync: (roleId: string, permissionIds: string[]) => Promise<void>;
  loading: boolean;
}

const RolePermissionsDialog = ({
  open,
  onOpenChange,
  role,
  allPermissions,
  onAssign,
  onRevoke,
  onSync,
  loading,
}: RolePermissionsDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set()
  );
  const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>(
    []
  );

  // Initialize selected permissions when role changes
  useEffect(() => {
    if (role) {
      const rolePermissionIds = new Set(role.permissions.map((p) => p.id));
      setSelectedPermissions(rolePermissionIds);
    } else {
      setSelectedPermissions(new Set());
    }
  }, [role]);

  // Filter permissions based on search term
  useEffect(() => {
    const filtered = allPermissions.filter(
      (permission) =>
        permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (permission.description &&
          permission.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    );
    setFilteredPermissions(filtered);
  }, [allPermissions, searchTerm]);

  if (!role) return null;

  const currentPermissionIds = new Set(role.permissions.map((p) => p.id));
  const permissionsToAssign = Array.from(selectedPermissions).filter(
    (id) => !currentPermissionIds.has(id)
  );
  const permissionsToRevoke = Array.from(currentPermissionIds).filter(
    (id) => !selectedPermissions.has(id)
  );

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(permissionId)) {
        newSet.delete(permissionId);
      } else {
        newSet.add(permissionId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedPermissions(new Set(filteredPermissions.map((p) => p.id)));
  };

  const handleDeselectAll = () => {
    setSelectedPermissions(new Set());
  };

  const handleAssign = async () => {
    if (permissionsToAssign.length > 0) {
      try {
        await onAssign(role.id, permissionsToAssign);
      } catch (error) {
        // Error is already handled by the parent component
        console.error("Failed to assign permissions:", error);
      }
    }
  };

  const handleRevoke = async () => {
    if (permissionsToRevoke.length > 0) {
      try {
        await onRevoke(role.id, permissionsToRevoke);
      } catch (error) {
        // Error is already handled by the parent component
        console.error("Failed to revoke permissions:", error);
      }
    }
  };

  const handleSync = async () => {
    try {
      await onSync(role.id, Array.from(selectedPermissions));
    } catch (error) {
      // Error is already handled by the parent component
      console.error("Failed to sync permissions:", error);
    }
  };

  const handleClose = () => {
    setSearchTerm("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Manage Permissions for "{role.name}"
          </DialogTitle>
          <DialogDescription>
            Select permissions to assign to this role. Changes will be applied
            when you click an action button.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and bulk actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                disabled={loading}
                className="flex-1 sm:flex-none"
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeselectAll}
                disabled={loading}
                className="flex-1 sm:flex-none"
              >
                Deselect All
              </Button>
            </div>
          </div>

          {/* Current permissions summary */}
          <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <span>Current permissions: {role.permissions.length}</span>
            <span>Selected: {selectedPermissions.size}</span>
          </div>

          {/* Permissions list */}
          <ScrollArea className="h-[250px] sm:h-[300px] border rounded-lg">
            <div className="p-4 space-y-3">
              {filteredPermissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm
                    ? "No permissions match your search"
                    : "No permissions available"}
                </div>
              ) : (
                filteredPermissions.map((permission) => {
                  const isSelected = selectedPermissions.has(permission.id);
                  const isCurrentlyAssigned = currentPermissionIds.has(
                    permission.id
                  );

                  return (
                    <div
                      key={permission.id}
                      className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                        isSelected
                          ? "bg-primary/5 border-primary/20"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <Checkbox
                        id={permission.id}
                        checked={isSelected}
                        onCheckedChange={() =>
                          handlePermissionToggle(permission.id)
                        }
                        disabled={loading}
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor={permission.id}
                            className="font-medium cursor-pointer"
                          >
                            {permission.name}
                          </Label>
                          {isCurrentlyAssigned && (
                            <Badge variant="secondary" className="text-xs">
                              Currently Assigned
                            </Badge>
                          )}
                        </div>
                        {permission.description && (
                          <p className="text-sm text-muted-foreground">
                            {permission.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Guard: {permission.guard_name}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 flex-1">
            <Button
              variant="outline"
              onClick={handleAssign}
              disabled={loading || permissionsToAssign.length === 0}
              className="flex-1 sm:flex-none"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                `Assign (${permissionsToAssign.length})`
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleRevoke}
              disabled={loading || permissionsToRevoke.length === 0}
              className="flex-1 sm:flex-none"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Revoking...
                </>
              ) : (
                `Revoke (${permissionsToRevoke.length})`
              )}
            </Button>
            <Button
              onClick={handleSync}
              disabled={loading}
              className="flex-1 sm:flex-none"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                "Sync All"
              )}
            </Button>
          </div>
          <Button variant="ghost" onClick={handleClose} disabled={loading}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
//
// Role Card Component
interface RoleCardProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
  onManagePermissions: (role: Role) => void;
}

const RoleCard = ({
  role,
  onEdit,
  onDelete,
  onManagePermissions,
}: RoleCardProps) => {
  const permissionCount = role.permissions.length;
  const displayPermissions = role.permissions.slice(0, 3);
  const remainingCount = permissionCount - 3;

  return (
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg truncate">
              {role.name}
            </CardTitle>
            {role.description && (
              <CardDescription className="mt-1 text-sm line-clamp-2">
                {role.description}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(role)}
              className="h-8 w-8 p-0"
              title="Edit role"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  title="Delete role"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Role</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete the role "{role.name}"? This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(role.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col">
        <div className="text-xs sm:text-sm text-muted-foreground">
          Guard: <span className="font-medium">{role.guard_name}</span>
        </div>

        <div className="flex-1">
          {permissionCount > 0 ? (
            <div className="space-y-2">
              <div className="text-xs sm:text-sm font-medium">
                Permissions ({permissionCount}):
              </div>
              <div className="flex flex-wrap gap-1">
                {displayPermissions.map((permission) => (
                  <Badge
                    key={permission.id}
                    variant="secondary"
                    className="text-xs truncate max-w-[120px]"
                    title={permission.name}
                  >
                    {permission.name}
                  </Badge>
                ))}
                {remainingCount > 0 && (
                  <Badge variant="outline" className="text-xs">
                    +{remainingCount} more
                  </Badge>
                )}
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No permissions assigned
            </div>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onManagePermissions(role)}
          className="w-full"
        >
          Manage Permissions
        </Button>
      </CardContent>
    </Card>
  );
};

// Permission Card Component
interface PermissionCardProps {
  permission: Permission;
  roles: Role[];
  onEdit: (permission: Permission) => void;
  onDelete: (permissionId: string) => void;
}

const PermissionCard = ({
  permission,
  roles,
  onEdit,
  onDelete,
}: PermissionCardProps) => {
  const rolesWithPermission = roles.filter((role) =>
    role.permissions.some((p) => p.id === permission.id)
  );

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{permission.name}</CardTitle>
            {permission.description && (
              <CardDescription className="mt-1">
                {permission.description}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(permission)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Permission</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete the permission "
                    {permission.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(permission.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Guard: <span className="font-medium">{permission.guard_name}</span>
        </div>

        <div className="text-sm text-muted-foreground">
          Used by:{" "}
          <span className="font-medium">
            {rolesWithPermission.length} role
            {rolesWithPermission.length !== 1 ? "s" : ""}
          </span>
        </div>

        {rolesWithPermission.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {rolesWithPermission.slice(0, 3).map((role) => (
              <Badge key={role.id} variant="outline" className="text-xs">
                {role.name}
              </Badge>
            ))}
            {rolesWithPermission.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{rolesWithPermission.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
