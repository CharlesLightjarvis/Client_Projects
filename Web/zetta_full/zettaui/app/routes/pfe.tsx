import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { LoadingScreen } from "../components/loading-screen";
import api from "../api";

interface PfeData {
  Title: string;
  Subject: string;
  Author: string;
  Encadreur: string;
  jurys: string[];
  Date: string;
  Lieu: string;
}

const PfeComponent = () => {
  const [pfeData, setPfeData] = useState<PfeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPfeData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/pfe");
        setPfeData(response.data);
      } catch (err) {
        console.error("Error fetching PFE data:", err);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchPfeData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 text-lg font-semibold mb-2">
              Erreur
            </div>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!pfeData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header Card */}
        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mb-4">
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800"
              >
                Projet de Fin d'Études
              </Badge>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
              {pfeData.Title}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Subject Card */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl text-blue-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Sujet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{pfeData.Subject}</p>
            </CardContent>
          </Card>

          {/* Author Card */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl text-green-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Étudiant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 font-semibold text-lg">
                {pfeData.Author}
              </p>
            </CardContent>
          </Card>

          {/* Supervisor Card */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl text-purple-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Encadreur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 font-semibold">{pfeData.Encadreur}</p>
            </CardContent>
          </Card>

          {/* Jury Card */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl text-orange-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Jury
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pfeData.jurys.map((jury, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="mr-2 mb-2 px-3 py-1 bg-orange-50 border-orange-200 text-orange-800"
                  >
                    {jury}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info Card */}
        <Card className="mt-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                <span className="text-gray-600 font-medium">
                  Date de soutenance:
                </span>
                <Badge
                  variant="secondary"
                  className="bg-indigo-100 text-indigo-800"
                >
                  {pfeData.Date}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-gray-600 font-medium">Lieu:</span>
                <Badge
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-800"
                >
                  {pfeData.Lieu}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PfeComponent;
