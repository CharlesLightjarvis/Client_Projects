import type { Route } from "./+types/notification-page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Notifications" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

import { useEffect, useState } from "react";
import { Bell, Check, X, Search } from "lucide-react";
import { NotificationList } from "~/routes/admin/notifications/notification-list";
import { NotificationDetail } from "~/routes/admin/notifications/notification-detail";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Input } from "~/components/ui/input";
import { useInterestsNotifications } from "~/hooks/use-interests-notifications";
import type { FormationInterest } from "~/types/formation-interest";

export default function NotificationPage() {
  const {
    interests,
    fetchInterests,
    isLoading,
    selectedNotification,
    setSelectedNotification,
    markAsRead, // Nouveau
    readNotifications, // Nouveau
  } = useInterestsNotifications();

  const [unreadCount, setUnreadCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter notifications based on search query and active tab
  const filteredNotifications = interests.filter((notification) => {
    const matchesSearch =
      notification.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.formation.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "approved")
      return matchesSearch && notification.status === "approved";
    if (activeTab === "pending")
      return matchesSearch && notification.status === "pending";
    return matchesSearch;
  });

  const handleNotificationClick = (notification: FormationInterest) => {
    // Marquer comme lu seulement si ce n'est pas déjà fait
    if (!readNotifications.includes(notification.id)) {
      markAsRead(notification.id);
    }

    // Normaliser la structure de la notification
    const normalizedNotification = {
      id: notification.id,
      fullName: notification.fullName || notification?.fullName,
      email: notification.email || notification?.email,
      phone: notification.phone || notification?.phone,
      message: notification.message || notification?.message,
      status: notification.status || notification?.status || "pending",
      created_at: notification.created_at || notification?.created_at,
      updated_at: notification.updated_at || notification?.updated_at,
      formation: {
        ...notification.formation,
        ...(notification?.formation || {}),
      },
    };

    setSelectedNotification(normalizedNotification);

    if (unreadCount > 0) {
      setUnreadCount((prev) => prev - 1);
    }
  };

  const handleAccept = async (notification: FormationInterest) => {
    try {
      const { approveInterest } = useInterestsNotifications.getState();
      const response = await approveInterest(notification.id);

      if (response.success) {
        // Mettre à jour la notification sélectionnée avec le nouveau statut
        setSelectedNotification(null);
        // Forcer un rafraîchissement des données
        await fetchInterests();
      }
    } catch (error) {
      console.error("Error approving interest:", error);
    }
  };

  const handleReject = (notification: FormationInterest) => {
    //
  };

  const handleClose = () => {
    setSelectedNotification(null);
  };

  useEffect(() => {
    fetchInterests();
  }, [fetchInterests]);

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-y-auto">
      <main className="container mx-auto px-4 py-6 max-w-7xl flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-100px)] border">
              <div className="p-4 border-b flex-shrink-0">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-9 bg-muted"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Tabs
                  defaultValue="all"
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:data-[state=active]:bg-primary/20 dark:data-[state=active]:text-primary"
                    >
                      Toutes
                    </TabsTrigger>
                    <TabsTrigger
                      value="pending"
                      className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-600 dark:data-[state=active]:bg-amber-500/20 dark:data-[state=active]:text-amber-400"
                    >
                      En attente
                    </TabsTrigger>
                    <TabsTrigger
                      value="approved"
                      className="data-[state=active]:bg-green-50 data-[state=active]:text-green-600 dark:data-[state=active]:bg-green-500/20 dark:data-[state=active]:text-green-400"
                    >
                      Acceptées
                    </TabsTrigger>
                  </TabsList>

                  <div
                    className="overflow-auto"
                    style={{ height: "calc(100vh - 230px)" }}
                  >
                    <TabsContent value="all" className="p-0 m-0 h-full">
                      <NotificationList
                        notifications={filteredNotifications}
                        onNotificationClick={handleNotificationClick}
                        selectedNotification={selectedNotification}
                        readNotifications={readNotifications}
                      />
                    </TabsContent>

                    <TabsContent value="pending" className="p-0 m-0 h-full">
                      <NotificationList
                        notifications={filteredNotifications.filter(
                          (n) => n.status === "pending"
                        )}
                        onNotificationClick={handleNotificationClick}
                        selectedNotification={selectedNotification}
                        readNotifications={readNotifications}
                      />
                    </TabsContent>

                    <TabsContent value="approved" className="p-0 m-0 h-full">
                      <NotificationList
                        notifications={filteredNotifications.filter(
                          (n) => n.status === "approved"
                        )}
                        onNotificationClick={handleNotificationClick}
                        selectedNotification={selectedNotification}
                        readNotifications={readNotifications}
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl shadow-sm h-[calc(100vh-100px)] flex flex-col border">
              {selectedNotification ? (
                <>
                  <div className="flex justify-between items-center p-4 border-b flex-shrink-0">
                    <h2 className="text-xl font-semibold text-foreground">
                      Détails de la demande
                    </h2>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleClose}>
                        Fermer
                      </Button>
                    </div>
                  </div>
                  <div
                    className="p-4 overflow-y-auto"
                    style={{ height: "calc(100vh - 170px)" }}
                  >
                    <NotificationDetail
                      notification={selectedNotification}
                      onAccept={handleAccept}
                      onReject={handleReject}
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center text-muted-foreground">
                  <div className="bg-muted p-6 rounded-full mb-4">
                    <Bell className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-foreground">
                    Aucune notification sélectionnée
                  </h3>
                  <p className="max-w-md">
                    Sélectionnez une notification dans la liste pour voir les
                    détails et gérer la demande
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
