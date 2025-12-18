import { useEffect, useState } from "react";
import { api } from "~/api";
import { useCertificationsStore } from "~/hooks/use-certifications-store";
import { Button } from "~/components/ui/button";
import { Link, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Book,
  CheckCircle2,
  Clock,
  GraduationCap,
  Trophy,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { motion } from "framer-motion";
import { LoadingScreen } from "~/components/loading-screen";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";

export default function CertificationDetails() {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { selectedCertification, setSelectedCertification } =
    useCertificationsStore();

  useEffect(() => {
    const fetchCertificationDetails = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get(`/api/v1/student/certifications/${id}`);
        console.log(response.data.certification);
        setSelectedCertification(response.data.certification);
      } catch (err: any) {
        console.error("Error fetching certification details:", err);
        setError(
          err.response?.data?.message || "Failed to load certification details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificationDetails();
  }, [id, setSelectedCertification]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="bg-destructive/10 dark:bg-destructive/20 border border-destructive text-destructive px-4 py-3 rounded">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (!selectedCertification) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-10">
          <h1 className="text-2xl font-bold text-foreground">
            Certification introuvable
          </h1>
          <Link to="/student/dashboard/certifications">
            <Button variant="ghost" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux certifications
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Certifications Professionnelles
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Développez vos compétences et boostez votre carrière avec nos
            certifications reconnues
          </p>
        </div>
        <Link to="/student/dashboard/certifications">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux certifications
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Card className="w-full">
            <CardHeader className="space-y-4">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                <div className="h-24 w-24 flex-shrink-0 rounded-xl bg-muted p-4">
                  <img
                    src={selectedCertification.image || "/placeholder.svg"}
                    alt={selectedCertification.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex-grow space-y-4 w-full">
                  <div>
                    <CardTitle className="text-2xl sm:text-3xl mb-2">
                      {selectedCertification.name}
                    </CardTitle>
                    <p className="text-muted-foreground text-base sm:text-lg">
                      {selectedCertification.provider}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-sm">
                        <Clock className="mr-1 h-4 w-4" />
                        {selectedCertification.validity_period} ans
                      </Badge>
                      <Badge variant="secondary" className="text-sm">
                        <Trophy className="mr-1 h-4 w-4" />
                        {selectedCertification.level}
                      </Badge>
                    </div>
                    <Button
                      variant="default"
                      className="w-full sm:w-auto"
                      onClick={() =>
                        navigate(
                          `/student/dashboard/certifications/${id}/certification-mode`
                        )
                      }
                    >
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Passer l'examen de certification
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
                  <TabsTrigger value="overview">Aperçu</TabsTrigger>
                  <TabsTrigger value="skills">Compétences</TabsTrigger>
                  <TabsTrigger value="prerequisites">Prérequis</TabsTrigger>
                  <TabsTrigger value="formation">Formation</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                    {selectedCertification.description}
                  </p>
                </TabsContent>

                <TabsContent value="skills" className="mt-6">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {selectedCertification.skills?.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg"
                      >
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-400" />
                        <span className="text-foreground">{skill}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="prerequisites" className="mt-6">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {selectedCertification.prerequisites?.map(
                      (prereq, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg"
                        >
                          <Book className="h-5 w-5 flex-shrink-0 text-blue-500 dark:text-blue-400" />
                          <span className="text-foreground">{prereq}</span>
                        </div>
                      )
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="formation" className="mt-6">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 flex-shrink-0 text-blue-500 dark:text-blue-400" />
                      <span className="text-foreground">
                        {selectedCertification.formation?.name}
                      </span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
