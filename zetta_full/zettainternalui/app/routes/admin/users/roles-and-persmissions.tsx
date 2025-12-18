"use client";

import { useState } from "react";
import { Info, Search, Plus, Save } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";

export default function RolesPermissionsPage() {
  const [roleName, setRoleName] = useState("Administrateur");
  const [roleDescription, setRoleDescription] = useState(
    "Responsable de la gestion complète du système avec accès à toutes les fonctionnalités."
  );

  // Modules et leurs permissions
  const modules = [
    {
      id: "tableau-de-bord",
      name: "Tableau de Bord",
      description: "Accès aux statistiques et analyses",
      permissions: ["voir", "exporter"],
    },
    {
      id: "utilisateurs",
      name: "Utilisateurs",
      description: "Gestion des comptes utilisateurs",
      permissions: ["créer", "voir", "modifier", "supprimer"],
    },
    {
      id: "roles",
      name: "Rôles",
      description: "Configuration des rôles et permissions",
      permissions: ["créer", "voir", "modifier", "supprimer"],
    },
    {
      id: "clients",
      name: "Clients",
      description: "Gestion des informations clients",
      permissions: ["créer", "voir", "modifier", "supprimer"],
    },
    {
      id: "produits",
      name: "Produits",
      description: "Gestion du catalogue de produits",
      permissions: ["créer", "voir", "modifier", "supprimer"],
    },
    {
      id: "commandes",
      name: "Commandes",
      description: "Traitement des commandes clients",
      permissions: ["créer", "voir", "modifier", "supprimer", "approuver"],
    },
    {
      id: "factures",
      name: "Factures",
      description: "Gestion de la facturation",
      permissions: ["créer", "voir", "modifier", "supprimer", "approuver"],
    },
    {
      id: "rapports",
      name: "Rapports",
      description: "Génération et consultation des rapports",
      permissions: ["créer", "voir", "exporter"],
    },
    {
      id: "parametres",
      name: "Paramètres",
      description: "Configuration du système",
      permissions: ["voir", "modifier"],
    },
  ];

  // État pour stocker les permissions sélectionnées
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<string, string[]>
  >({
    "tableau-de-bord": ["voir", "exporter"],
    utilisateurs: ["créer", "voir", "modifier", "supprimer"],
    roles: ["créer", "voir", "modifier", "supprimer"],
    clients: ["créer", "voir", "modifier", "supprimer"],
    produits: ["créer", "voir", "modifier", "supprimer"],
    commandes: ["créer", "voir", "modifier", "supprimer", "approuver"],
    factures: ["créer", "voir", "modifier", "supprimer", "approuver"],
    rapports: ["créer", "voir", "exporter"],
    parametres: ["voir", "modifier"],
  });

  // État pour la recherche
  const [searchTerm, setSearchTerm] = useState("");

  // Fonction pour gérer les changements de permissions
  const handlePermissionChange = (
    moduleId: string,
    permission: string,
    checked: boolean
  ) => {
    setSelectedPermissions((prev) => {
      const updatedPermissions = { ...prev };

      if (checked) {
        updatedPermissions[moduleId] = [...(prev[moduleId] || []), permission];
      } else {
        updatedPermissions[moduleId] = (prev[moduleId] || []).filter(
          (p) => p !== permission
        );
      }

      return updatedPermissions;
    });
  };

  // Fonction pour sélectionner/désélectionner toutes les permissions d'un module
  const handleSelectAllModulePermissions = (
    moduleId: string,
    checked: boolean
  ) => {
    setSelectedPermissions((prev) => {
      const updatedPermissions = { ...prev };
      const module = modules.find((m) => m.id === moduleId);

      if (module) {
        updatedPermissions[moduleId] = checked ? [...module.permissions] : [];
      }

      return updatedPermissions;
    });
  };

  // Filtrer les modules en fonction de la recherche
  const filteredModules = modules.filter(
    (module) =>
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour sauvegarder les modifications
  const handleSave = () => {
    // Ici, vous implémenteriez la logique pour sauvegarder les modifications
    console.log("Rôle sauvegardé:", {
      name: roleName,
      description: roleDescription,
      permissions: selectedPermissions,
    });
    // Afficher une notification de succès, etc.
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Gestion des Rôles et Permissions
          </h1>
          <p className="text-muted-foreground">
            Définissez les rôles et leurs accès au système
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Rôle
          </Button>
        </div>
      </div>

      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="edit">Modifier le Rôle</TabsTrigger>
          <TabsTrigger value="list">Liste des Rôles</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>Informations du Rôle</CardTitle>
              <CardDescription>
                Définissez les détails et les permissions pour ce rôle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="role-name" className="text-sm font-medium">
                      Nom du Rôle
                    </label>
                    <Input
                      id="role-name"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      placeholder="Ex: Administrateur, Gestionnaire, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="role-description"
                      className="text-sm font-medium flex items-center gap-1"
                    >
                      Description
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-80">
                              Décrivez brièvement les responsabilités et le
                              niveau d'accès de ce rôle.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <Input
                      id="role-description"
                      value={roleDescription}
                      onChange={(e) => setRoleDescription(e.target.value)}
                      placeholder="Description des responsabilités du rôle"
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Permissions</h3>
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher un module..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredModules.map((module) => (
                      <Card key={module.id} className="border shadow-sm">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">
                                {module.name}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {module.description}
                              </CardDescription>
                            </div>
                            <div className="flex items-center h-5">
                              <Checkbox
                                id={`select-all-${module.id}`}
                                checked={
                                  selectedPermissions[module.id]?.length ===
                                  module.permissions.length
                                }
                                onCheckedChange={(checked) =>
                                  handleSelectAllModulePermissions(
                                    module.id,
                                    checked === true
                                  )
                                }
                              />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            {module.permissions.map((permission) => (
                              <div
                                key={`${module.id}-${permission}`}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`${module.id}-${permission}`}
                                  checked={selectedPermissions[
                                    module.id
                                  ]?.includes(permission)}
                                  onCheckedChange={(checked) =>
                                    handlePermissionChange(
                                      module.id,
                                      permission,
                                      checked === true
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`${module.id}-${permission}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                                >
                                  {permission}
                                </label>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <Button variant="outline">Annuler</Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer les modifications
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Rôles Existants</CardTitle>
              <CardDescription>
                Liste des rôles configurés dans le système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    name: "Administrateur",
                    description: "Accès complet au système",
                    users: 3,
                  },
                  {
                    id: 2,
                    name: "Gestionnaire",
                    description: "Gestion des opérations quotidiennes",
                    users: 8,
                  },
                  {
                    id: 3,
                    name: "Comptable",
                    description: "Accès aux finances et factures",
                    users: 4,
                  },
                  {
                    id: 4,
                    name: "Agent Commercial",
                    description: "Gestion des clients et commandes",
                    users: 12,
                  },
                  {
                    id: 5,
                    name: "Support Client",
                    description: "Assistance aux clients",
                    users: 6,
                  },
                ].map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{role.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {role.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{role.users} utilisateurs</Badge>
                      <Button variant="ghost" size="sm">
                        Modifier
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
