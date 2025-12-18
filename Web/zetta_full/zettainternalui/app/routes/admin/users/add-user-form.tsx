import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { PlusIcon } from "lucide-react";
import { useRolesStore } from "~/hooks/use-roles-store";
import { useUsersStore } from "~/hooks/use-users-store";

export function AddUserForm() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<string | undefined>(undefined);
  const { roles, fetchRoles, isLoading } = useRolesStore();
  const { createUser } = useUsersStore();

  const handleRoleChange = (value: string) => {
    setRole(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(form);
    const userData = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as string,
      phone: (formData.get("phone") as string) || undefined,
      title: (formData.get("title") as string) || undefined,
      bio: (formData.get("bio") as string) || undefined,
    };

    try {
      const message = await createUser(userData);
      form.reset();
      setRole(undefined);
      setOpen(false);

      toast.success("Success", {
        description: message,
      });
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusIcon size={16} />
          <span>Ajouter</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] md:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <form className="w-full" onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-semibold">
              Ajouter un nouvel utilisateur
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour créer un nouvel
              utilisateur.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  className="w-full"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" onValueChange={handleRoleChange} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value="" disabled>
                        Loading roles...
                      </SelectItem>
                    ) : (
                      roles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  className="w-full"
                />
              </div>
            </div>

            {/* Conditional fields for Teacher role */}
            {role === "teacher" && (
              <>
                <div className="w-full">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g. Professor of Mathematics"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biography</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Enter teacher biography..."
                    className="w-full min-h-[100px]"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Créer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
