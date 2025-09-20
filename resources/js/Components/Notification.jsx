import React, { useEffect, useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import axios from "axios";
import Echo from "laravel-echo";
import { Bell } from "lucide-react";
import { trans } from "@/lib/utils.js";
import { Skeleton } from "@/Components/ui/skeleton";
import i18n from "i18next";
export default function Notification() {
    const [showingNotification, setShowingNotification] = useState(false);
    const isRTL = document.dir === "rtl";
    const lang = i18n.language;
    const { auth } = usePage().props;
    const [notifications, setNotifications] = useState([]);
    const translatedDocument = trans("doc:Document");
    const translatedOverdue = trans("doc:Overdue_By");
    const translatedDay = trans("doc:Day");
    const translatedViewAll = trans("doc:View_All");
    const translatedMarkAsRead = trans("doc:Mark_As_Read");
    const translatedNoNotifications = trans("doc:No_Notifications");
    const translatedNotification = trans("doc:Notifications");
    const translatedSentToYou = trans("doc:Sent_To_You");
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const translatedBy = trans("doc:By");

    const toggleNotifications = () => {
        setShowingNotification((prev) => !prev);

        if (!showingNotification) {
            fetchNotifications();
        }
    };

    useEffect(() => {
        const trackerChannel = window.Echo.private(
            `receive-tracker.${auth.user.id}`
        );
        const overdueChannel = window.Echo.private(
            `document-overdue.${auth.user.id}`
        );
        const addActionsChannel = window.Echo.private(
            `add-actions.${auth.user.id}`
        );

        trackerChannel.listen("ReceiveTracker", (event) => {
            if (auth.user.id === event.user_id) {
                setUnreadCount((prev) => prev + 1);
                playNotificationSound();
            }
        });

        overdueChannel.listen("DocumentOverdue", (event) => {
            if (auth.user.id === event.user_id) {
                setUnreadCount((prev) => prev + 1);
                // setNotifications((prev) => [...prev, event]);
                playNotificationSound();
            }
        });
        addActionsChannel.listen("AddActions", (event) => {
            if (auth.user.id === event.user_id) {
                setUnreadCount((prev) => prev + 1);
                playNotificationSound();
            }
        });

        return () => {
            window.Echo.leave(`receive-tracker.${auth.user.id}`);
            window.Echo.leave(`document-overdue.${auth.user.id}`);
            window.Echo.leave(`add-actions.${auth.user.id}`);
        };
    }, [auth.user.id]);

    const playNotificationSound = () => {
        const audio = new Audio("/notification/sound.wav");
        audio.play().catch((e) => {
            console.error("Failed to play sound:", e);
        });
    };

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/notifications");
            setLoading(false);
            setNotifications(response.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const handleNotificationClick = async (notification) => {
        if (notification.id) {
            if (notification.document_id) {
                router.visit(route("documents.show", notification.document_id));
            }
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get("/notifications/unread-count");
            setUnreadCount(response.data.unread_count);
        } catch (error) {
            console.error("Error fetching unread count:", error);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(() => {
            fetchUnreadCount();
        }, 60000); // Fetch unread count every minute
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {
        try {
            await axios.post(`/notifications/${id}/read`);
            setNotifications(notifications.filter((n) => n.id !== id));
            setUnreadCount((prev) => prev - 1);
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    return (
        <div className="relative inline-block">
            <button
                type="button"
                onClick={toggleNotifications}
                className="relative inline-flex items-center justify-center p-1 text-gray-300 bg-gray-700 rounded-full hover:bg-gray-800"
            >
                <Bell />
                <span className="sr-only">Notifications</span>
                <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full -top-1 -end-1">
                    {unreadCount}
                </div>
            </button>

            {showingNotification && (
                <div
                    id="dropdownNotification"
                    className={`absolute ${
                        isRTL ? "left-0" : "right-0"
                    } top-full mt-2 z-20 min-w-[20rem] max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-800 dark:divide-gray-700`}
                >
                    <div className="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-700 dark:text-white">
                        {translatedNotification}
                    </div>
                    {!loading && (
                        <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                    {translatedNoNotifications}.
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <div
                                            className={`w-full ${
                                                isRTL ? "pr-3" : "pl-3"
                                            }`}
                                        >
                                            <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                                                <div
                                                    onClick={() =>
                                                        handleNotificationClick(
                                                            notification
                                                        )
                                                    }
                                                    className="text-gray-500 text-sm mb-1.5 dark:text-gray-400 cursor-pointer"
                                                >
                                                    {notification.type ===
                                                        "TrackerReceivedNotification" && (
                                                        <p>
                                                            {translatedDocument}{" "}
                                                            <b>
                                                                {
                                                                    notification.title
                                                                }
                                                            </b>{" "}
                                                            {
                                                                translatedSentToYou
                                                            }
                                                            .
                                                        </p>
                                                    )}
                                                    {notification.type ===
                                                        "DocumentOverdue" &&
                                                        isRTL && (
                                                            <p>
                                                                {
                                                                    translatedDocument
                                                                }{" "}
                                                                <b>
                                                                    {
                                                                        notification.title
                                                                    }
                                                                </b>
                                                                <span className="text-red-400">
                                                                    {" "}
                                                                    {notification.message.match(
                                                                        /\d+/
                                                                    ) || []}
                                                                </span>{" "}
                                                                {translatedDay}{" "}
                                                                {
                                                                    translatedOverdue
                                                                }
                                                                .
                                                            </p>
                                                        )}
                                                    {notification.type ===
                                                        "DocumentOverdue" &&
                                                        !isRTL && (
                                                            <p>
                                                                {
                                                                    translatedDocument
                                                                }{" "}
                                                                <b>
                                                                    {
                                                                        notification.title
                                                                    }
                                                                </b>{" "}
                                                                &nbsp;
                                                                {
                                                                    translatedOverdue
                                                                }{" "}
                                                                <span className="text-red-400">
                                                                    {" "}
                                                                    {notification.message.match(
                                                                        /\d+/
                                                                    ) || []}
                                                                </span>{" "}
                                                                {translatedDay}{" "}
                                                                .
                                                            </p>
                                                        )}
                                                    {notification.type ===
                                                        "AddActionsNotification" &&
                                                        lang === "fa" && (
                                                            <p>
                                                                اجرات بالای سند{" "}
                                                                <b>
                                                                    {
                                                                        notification.title
                                                                    }
                                                                </b>{" "}
                                                                &nbsp; توسط{" "}
                                                                <span>
                                                                    {
                                                                        notification?.added_by
                                                                    }
                                                                </span>{" "}
                                                                انجام شد .
                                                            </p>
                                                        )}
                                                    {notification.type ===
                                                        "AddActionsNotification" &&
                                                        lang === "ps" && (
                                                            <p>
                                                                د{" "}
                                                                <b>
                                                                    {
                                                                        notification.title
                                                                    }
                                                                </b>{" "}
                                                                {
                                                                    translatedDocument
                                                                }
                                                                <span>
                                                                    باندی د{" "}
                                                                </span>
                                                                <span>
                                                                    {
                                                                        notification?.added_by
                                                                    }
                                                                </span>{" "}
                                                                په واسطه اجرات
                                                                ترسره سول .
                                                            </p>
                                                        )}
                                                    {notification.type ===
                                                        "AddActionsNotification" &&
                                                        lang === "en" && (
                                                            <p>
                                                                {
                                                                    notification.message
                                                                }{" "}
                                                                <b>
                                                                    {
                                                                        notification.title
                                                                    }
                                                                </b>{" "}
                                                                &nbsp;
                                                                {
                                                                    translatedBy
                                                                }{" "}
                                                                <span>
                                                                    {
                                                                        notification?.added_by
                                                                    }
                                                                </span>
                                                                .
                                                            </p>
                                                        )}
                                                </div>
                                            </div>
                                            <div className="text-xs text-blue-600 dark:text-blue-500">
                                                {notification.created_at}
                                            </div>
                                            <button
                                                onClick={() =>
                                                    markAsRead(notification.id)
                                                }
                                                className="text-xs text-blue-600 dark:text-blue-500 hover:underline"
                                            >
                                                {translatedMarkAsRead}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                    {loading && (
                        <div>
                            <div className="flex items-center p-4 space-x-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[80px]" />
                                    <Skeleton className="h-4 w-[80px]" />
                                </div>
                            </div>
                            <div className="flex items-center p-4 space-x-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[80px]" />
                                    <Skeleton className="h-4 w-[80px]" />
                                </div>
                            </div>
                        </div>
                    )}
                    {notifications.length > 0 && (
                        <a
                            href="#"
                            className="block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                        >
                            <div className="inline-flex items-center justify-center">
                                <svg
                                    className="w-4 h-4 text-gray-500 me-2 dark:text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 14"
                                >
                                    <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                                </svg>
                                {translatedViewAll}
                            </div>
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}
