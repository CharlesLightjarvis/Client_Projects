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

export default function TeacherNotifications() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          // onClick={markAllAsRead}
          aria-label="Notifications"
        >
          <BellIcon size={16} aria-hidden="true" />
          {/* {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )} */}
        </Button>
      </DropdownMenuTrigger>
      {/* <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2 border-b">
          <span className="text-sm font-medium">Notifications</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSound}
            className="h-8 w-8"
            aria-label={soundEnabled ? "Désactiver le son" : "Activer le son"}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </Button>
        </div>
        Teacher Notifications
      </DropdownMenuContent> */}
    </DropdownMenu>
  );
}
