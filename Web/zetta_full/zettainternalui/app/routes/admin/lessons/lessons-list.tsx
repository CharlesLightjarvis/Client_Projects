import { useEffect } from "react";
import { LoadingScreen } from "~/components/loading-screen";
import { LessonsDataTable } from "./lessons-datatable";
import { useLessonsStore } from "~/hooks/use-lessons-store";

export default function LessonsList() {
  const { lessons, isLoading, error, getLessons } = useLessonsStore();

  useEffect(() => {
    // Vérifie si les données sont déjà chargées
    getLessons();
  }, [getLessons]); // Dépendance vide pour n'exécuter qu'au montage

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <LessonsDataTable data={lessons} />
          </div>
        </div>
      </div>
    </div>
  );
}
