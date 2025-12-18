import { useEffect } from "react";
import { FormationsDataTable } from "./formations-datatable";
import { LoadingScreen } from "~/components/loading-screen";
import { useFormationsStore } from "~/hooks/use-formations-store";

export default function FormationsList() {
  const { formations, isLoading, error, getFormations } = useFormationsStore();

  useEffect(() => {
    // Vérifie si les données sont déjà chargées
    if (formations.length === 0) {
      getFormations();
    }
  }, []); // Dépendance vide pour n'exécuter qu'au montage

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <FormationsDataTable data={formations} />
          </div>
        </div>
      </div>
    </div>
  );
}
