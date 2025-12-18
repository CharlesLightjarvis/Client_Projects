"use client";

import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";
import type { FormationInterest } from "~/types/formation-interest";

interface NotificationListProps {
  notifications: FormationInterest[];
  onNotificationClick: (notification: FormationInterest) => void;
  selectedNotification: FormationInterest | null;
  readNotifications: string[]; // Nouveau
}

export function NotificationList({
  notifications,
  onNotificationClick,
  selectedNotification,
  readNotifications,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground h-full flex items-center justify-center">
        <div>
          <p className="mb-2 font-medium">Aucune notification</p>
          <p className="text-sm">Les nouvelles demandes apparaîtront ici</p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border h-full">
      {notifications.map((notification) => {
        const isSelected =
          selectedNotification?.id === notification.id &&
          selectedNotification?.formation.id === notification.formation.id;
        const status = notification.status;
        const initials = notification.fullName
          .split(" ")
          .map((name) => name[0])
          .join("")
          .toUpperCase();
        const isRead = readNotifications.includes(notification.id);

        return (
          <div
            key={`${notification.id}-${notification.formation.id}`}
            className={cn(
              "p-4 cursor-pointer hover:bg-muted transition-colors relative",
              isSelected && "bg-muted border-l-4 border-primary",
              !isRead && "bg-primary/5" // Nouveau: style pour non lue
            )}
            onClick={() => onNotificationClick(notification)}
          >
            {!isRead && (
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
            )}
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 border flex-shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium truncate text-foreground">
                    {notification.fullName}
                  </h3>
                  <div className="flex-shrink-0 ml-2">
                    {status === "pending" && (
                      <Badge
                        variant="outline"
                        className="bg-orange-500/10 text-orange-500 border-orange-500/20"
                      >
                        En attente
                      </Badge>
                    )}
                    {status === "approved" && (
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-500 border-green-500/20"
                      >
                        Acceptée
                      </Badge>
                    )}
                    {status === "rejected" && (
                      <Badge
                        variant="outline"
                        className="bg-red-500/10 text-red-500 border-red-500/20"
                      >
                        Refusée
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {notification.formation.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {notification.created_at &&
                    new Date(notification.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
