import { useEffect } from "react";
import { LoadingScreen } from "~/components/loading-screen";
import { CertificationsDataTable } from "./certifications-datatable";
import { useCertificationsStore } from "~/hooks/use-certifications-store";
import type { CertificationSchema } from "~/types/certification";

export default function CertificationsList() {
  const { certifications, isLoading, getCertifications } =
    useCertificationsStore();

  useEffect(() => {
    // Vérifie si les données sont déjà chargées
    if (certifications.length === 0) {
      getCertifications();
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
            <CertificationsDataTable
              data={certifications as CertificationSchema[]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
