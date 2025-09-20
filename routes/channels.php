<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', fn ($user, $id): bool => (int) $user->id === (int) $id);

Broadcast::channel('document-overdue.{id}', fn ($user, $id): bool => (int) $user->id === (int) $id);

Broadcast::channel('receive-tracker.{id}', fn ($user, $id): bool => (int) $user->id === (int) $id);

Broadcast::channel('add-actions.{id}', fn ($user, $id): bool => (int) $user->id === (int) $id);
