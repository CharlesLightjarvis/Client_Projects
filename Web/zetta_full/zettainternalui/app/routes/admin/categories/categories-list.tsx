import { useEffect } from "react";
import { CategoriesDataTable } from "./categories-datatable";
import { LoadingScreen } from "~/components/loading-screen";
import { useCategoriesStore } from "~/hooks/use-categories-store";

export default function CategoriesList() {
  const { categories, isLoading, error, getCategories } = useCategoriesStore();

  useEffect(() => {
    // Vérifie si les données sont déjà chargées
    if (categories.length === 0) {
      getCategories();
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
            <CategoriesDataTable data={categories} />
          </div>
        </div>
      </div>
    </div>
  );
}
