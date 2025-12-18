import { useEffect } from "react";
import { LoadingScreen } from "~/components/loading-screen";
import { useFormationsStore } from "~/hooks/use-formations-store";
import { useUsersStore } from "~/hooks/use-users-store";
import { usePaymentsStore } from "~/hooks/use-payments-store";
import { PaymentsDataTable } from "./payments-datatable";

export default function CategoriesList() {
  const { formations, isLoading, error, getFormations } = useFormationsStore();
  const { getStudents } = useUsersStore();
  const { payments, getPayments } = usePaymentsStore();

  useEffect(() => {
    // Vérifie si les données sont déjà chargées
    getFormations();
    getStudents();
    getPayments();
  }, []); // Dépendance vide pour n'exécuter qu'au montage

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <PaymentsDataTable data={payments} />
          </div>
        </div>
      </div>
    </div>
  );
}
