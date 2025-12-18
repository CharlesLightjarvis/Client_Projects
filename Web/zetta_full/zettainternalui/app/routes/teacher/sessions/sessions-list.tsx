import { useEffect } from "react";
import { TeacherSessionsDataTable } from "./sessions-datatable";
import { LoadingScreen } from "~/components/loading-screen";
import { useSessionsStore } from "~/hooks/use-sessions-store";

export default function SessionsList() {
  const { sessions, isLoading, error, getTeacherSessions } = useSessionsStore();

  useEffect(() => {
    // Vérifie si les données sont déjà chargées
    if (sessions.length === 0) {
      getTeacherSessions();
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
            <TeacherSessionsDataTable data={sessions} />
          </div>
        </div>
      </div>
    </div>
  );
}
