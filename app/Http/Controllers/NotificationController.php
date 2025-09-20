<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = $request->user()->unreadNotifications()
            ->get()
            ->map(fn ($notification): array => [
                'id' => $notification->id,
                'document_id' => $notification->data['document_id'],
                'message' => $notification->data['message'],
                'title' => $notification->data['title'],
                'type' => class_basename($notification->type),
                'added_by' => $notification->data['added_by'] ?? null,
                'created_at' => \Carbon\Carbon::parse($notification->created_at)->timezone('Asia/Kabul')->diffForHumans(null, \Carbon\CarbonInterface::JUST_NOW),
            ]);

        return response()->json($notifications);
    }

    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json(['message' => 'Notification marked as read']);
    }

    public function unreadCount(Request $request)
    {
        $count = $request->user()->unreadNotifications()->count();

        return response()->json(['unread_count' => $count]);
    }
}
