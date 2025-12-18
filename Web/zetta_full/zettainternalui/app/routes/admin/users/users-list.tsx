import { useEffect } from "react";
import { UsersDataTable } from "./users-datatable";
import { useUsersStore } from "~/hooks/use-users-store";
import { LoadingScreen } from "~/components/loading-screen";

export default function UsersList() {
  const { users, isLoading, error, getUsers } = useUsersStore();

  useEffect(() => {
    // Vérifie si les données sont déjà chargées
    if (users.length === 0) {
      getUsers();
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
            <UsersDataTable data={users} />
          </div>
        </div>
      </div>
    </div>
  );
}
