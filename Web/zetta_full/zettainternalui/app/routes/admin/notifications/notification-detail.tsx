"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  Clock,
  Euro,
  BookOpen,
  GraduationCap,
  Mail,
  Phone,
  User,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { formatDistanceToNow, parse } from "date-fns";
import { fr } from "date-fns/locale";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import type { FormationInterest } from "~/types/formation-interest";
import { useInterestsNotifications } from "~/hooks/use-interests-notifications";
import { toast } from "sonner";

interface NotificationDetailProps {
  notification: FormationInterest;
  onAccept: (notification: FormationInterest) => void;
  onReject: (notification: FormationInterest) => void;
}

export function NotificationDetail({
  notification,
  onAccept,
  onReject,
}: NotificationDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotification, setEditedNotification] = useState(notification);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initials = notification.fullName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  const handleInputChange = (field: string, value: string) => {
    setEditedNotification({
      ...editedNotification,
      [field]: value,
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    // Ici vous pouvez ajouter la logique pour sauvegarder les modifications
  };

  const handleAccept = async () => {
    setIsSubmitting(true);
    try {
      const { approveInterest } = useInterestsNotifications.getState();
      const response = await approveInterest(notification.id);

      if (response.success) {
        onAccept(notification);
        toast.success(
          response.message || "La demande a été approuvée avec succès"
        );
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'approbation de la demande"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const created = new Date(dateString + " UTC");
    const now = new Date();
    const diffTime = now.getTime() - created.getTime();
    const diffMinutes = Math.round(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let timeAgoText;
    if (diffMinutes < 1) {
      timeAgoText = "à l'instant";
    } else if (diffMinutes < 60) {
      timeAgoText = `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
    } else if (diffHours < 24) {
      timeAgoText = `${diffHours} heure${diffHours > 1 ? "s" : ""}`;
    } else {
      timeAgoText = `${diffDays} jour${diffDays > 1 ? "s" : ""}`;
    }

    return `Il y a de cela ${timeAgoText}`;
  };

  const getStatus = (status: string | undefined) => {
    switch (status) {
      case "pending":
        return (
          <span className="text-amber-500 dark:text-amber-400 font-medium">
            En attente
          </span>
        );
      case "approved":
        return (
          <span className="text-green-500 dark:text-green-400 font-medium">
            Acceptée
          </span>
        );
      case "rejected":
        return (
          <span className="text-red-500 dark:text-red-400 font-medium">
            Refusée
          </span>
        );
      default:
        return (
          <span className="text-amber-500 dark:text-amber-400 font-medium">
            En attente
          </span>
        );
    }
  };

  const isApproved = notification.status === "approved";

  return (
    <div className="space-y-6 max-w-full">
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="h-16 w-16 border border-border">
          <AvatarFallback className="bg-primary/10 text-primary text-xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-foreground truncate">
            {notification.fullName}
          </h2>
          {notification.created_at && (
            <p className="text-sm text-muted-foreground">
              {getTimeAgo(notification.created_at)}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-foreground">
          Informations du contact
        </h3>
        {!isApproved && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="text-primary"
          >
            {isEditing ? "Annuler" : "Modifier"}
          </Button>
        )}
      </div>

      {isEditing && !isApproved ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <Input
              id="fullName"
              value={editedNotification.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={editedNotification.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={editedNotification.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={editedNotification.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              rows={4}
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            Enregistrer les modifications
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="w-full overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex items-start gap-2">
                  <dt className="text-sm font-medium text-muted-foreground min-w-[80px]">
                    Nom
                  </dt>
                  <dd className="text-sm text-foreground break-words">
                    {notification.fullName}
                  </dd>
                </div>
                <div className="flex items-start gap-2">
                  <dt className="text-sm font-medium text-muted-foreground min-w-[80px]">
                    Email
                  </dt>
                  <dd className="text-sm text-foreground flex items-center gap-1 break-all">
                    <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    {notification.email}
                  </dd>
                </div>
                <div className="flex items-start gap-2">
                  <dt className="text-sm font-medium text-muted-foreground min-w-[80px]">
                    Téléphone
                  </dt>
                  <dd className="text-sm text-foreground flex items-center gap-1 break-all">
                    <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    {notification.phone}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="w-full overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground whitespace-pre-line break-words">
                {notification.message}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Separator />

      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">
          Formation demandée
        </h3>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="break-words">
              {notification.formation.name}
            </CardTitle>
            <CardDescription className="break-words">
              {notification.formation.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">
                    Durée
                  </p>
                  <p className="text-sm text-foreground break-words">
                    {notification.formation.duration} heures
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">
                    Niveau
                  </p>
                  <p className="text-sm text-foreground break-words">
                    {notification.formation.level}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">
                    Statut
                  </p>
                  <p className="text-sm break-words">
                    {getStatus(notification.status)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Euro className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">
                    Prix
                  </p>
                  <p className="text-sm text-foreground font-medium break-words">
                    {notification.formation.price.toLocaleString("fr-FR")} DT
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {!isEditing && !isApproved && (
        <div className="flex justify-end gap-2 mt-6 flex-wrap">
          <Button
            variant="outline"
            onClick={() => onReject(notification)}
            className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/50 border-red-200 dark:border-red-900"
          >
            Refuser la demande
          </Button>
          <Button
            onClick={handleAccept}
            disabled={isSubmitting}
            className="bg-green-600 dark:bg-green-600 hover:bg-green-700 dark:hover:bg-green-700 text-white"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Traitement en cours...
              </>
            ) : (
              "Accepter la demande"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
