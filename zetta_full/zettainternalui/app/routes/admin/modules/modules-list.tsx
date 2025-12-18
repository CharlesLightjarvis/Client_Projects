import { useEffect } from "react";
import { ModulesDataTable } from "./modules-datatable";
import { LoadingScreen } from "~/components/loading-screen";
import { useModulesStore } from "~/hooks/use-modules-store";

export default function ModulesList() {
  const { modules, isLoading, error, getModules } = useModulesStore();

  useEffect(() => {
    // Vérifie si les données sont déjà chargées
    getModules();
  }, []); // Dépendance vide pour n'exécuter qu'au montage

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <ModulesDataTable data={modules} />
          </div>
        </div>
      </div>
    </div>
  );
}
