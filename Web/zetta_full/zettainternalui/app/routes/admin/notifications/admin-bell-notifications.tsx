import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { BellIcon, VolumeX, Volume2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { XIcon } from "lucide-react";
import { useInterestsNotifications } from "~/hooks/use-interests-notifications";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import type { FormationInterest } from "~/types/formation-interest";

export default function AdminNotifications() {
  const navigate = useNavigate();
  const getUnreadNotifications = useInterestsNotifications(
    (state) => state.getUnreadNotifications
  );
  const unreadCount = useInterestsNotifications((state) => state.unreadCount);
  const markAsRead = useInterestsNotifications((state) => state.markAsRead);
  const soundEnabled = useInterestsNotifications((state) => state.soundEnabled);
  const toggleSound = useInterestsNotifications((state) => state.toggleSound);
  const setSelectedNotification = useInterestsNotifications(
    (state) => state.setSelectedNotification
  );
  const fetchInterests = useInterestsNotifications(
    (state) => state.fetchInterests
  );

  // Récupérer les notifications non lues
  const unreadNotifications = getUnreadNotifications();

  const handleNotificationClick = async (notification: FormationInterest) => {
    markAsRead(notification.id);
    setSelectedNotification(notification);
    navigate("/admin/dashboard/notifications");
    await fetchInterests();
  };

  useEffect(() => {
    fetchInterests();
  }, [fetchInterests]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <BellIcon size={16} />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 left-full -translate-x-1/2"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2 border-b">
          <span className="text-sm font-medium">Notifications</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              toggleSound();
            }}
            className="h-8 w-8"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </Button>
        </div>

        {unreadNotifications.length === 0 ? (
          <div className="p-4 text-center text-sm">Aucune notification</div>
        ) : (
          unreadNotifications.map((notif) => (
            <DropdownMenuItem
              key={notif.id}
              className="relative p-4"
              onClick={() => handleNotificationClick(notif)}
            >
              <div className="space-y-1">
                <div className="font-medium">{notif.fullName}</div>
                <div className="text-sm text-muted-foreground">
                  Intéressé par: {notif.formation.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {notif.email} • {notif.phone}
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
