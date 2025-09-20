<?php

namespace App\Http\Controllers\Document;

use App\Http\Controllers\Controller;
use App\Http\Requests\Document\ActionStoreRequest;
use App\Http\Requests\Document\ActionUpdateRequest;
use App\Models\Document\Action;
use App\Models\Document\Document;
use App\Models\Document\Tracker;
use App\Models\User;
use App\Notifications\AddActionsNotification;
use App\Enums\Status;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class ActionController extends Controller
{
    public function index(Request $request): bool
    {
        return true;
    }

    public function store(ActionStoreRequest $request)
    {
        $action = Action::create($request->validated());
        $document = Document::find($action->document_id);
        $user = User::find($document->created_by);
        $user->notify(new AddActionsNotification($document, $action->created_by));
        broadcast(new \App\Events\AddActions($document, $user, $action->created_by));

        return back()->with('action', $action->toResource());
        //        return response()->json(['action' => new ActionResource($action)]);
    }

    public function show(Request $request, Action $action): \Illuminate\Http\Resources\Json\JsonResource
    {
        return $action->toResource();
    }

    public function update(ActionUpdateRequest $request, Action $action): \App\Http\Resources\Document\ActionResource
    {
        $action->update($request->validated());

        return $action->toResource();
    }

    public function destroy(Request $request, Action $action): Response
    {
        $action->delete();

        return response()->noContent();
    }

    public function approveAction($actionId)
    {
        $action = Action::find($actionId);
        $action->update(['approved_by' => Auth::user()->id, 'approved_at' => now()]);
        $document = Document::find($action->document_id);

        // Update the latest tracker status to completed
        $latestTracker = $document->latestTracker();
        if ($latestTracker) {
            $latestTracker->update(['status' => Status::Completed]);
        }

        $user = User::find($document->created_by);
        $user->notify(new AddActionsNotification($document, $action->created_by));
        broadcast(new \App\Events\AddActions($document, $user, $action->created_by));

        return back()->with('action', $action->toResource());
    }
}
