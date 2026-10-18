<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PickupSlot;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PickupSlotController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(PickupSlot::query()->withCount([
            'orders as active_orders_count' => fn ($q) => $q->whereNotIn('status', ['Cancelled', 'Completed']),
        ])->orderBy('id')->paginate(30));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'slot_time' => ['required', 'string', 'max:120'],
            'max_orders' => ['required', 'integer', 'min:1', 'max:1000'],
            'is_open' => ['sometimes', 'boolean'],
        ]);
        return response()->json(PickupSlot::create($validated), 201);
    }

    public function update(Request $request, PickupSlot $pickupSlot): JsonResponse
    {
        $validated = $request->validate([
            'slot_time' => ['required', 'string', 'max:120'],
            'max_orders' => ['required', 'integer', 'min:1', 'max:1000'],
            'is_open' => ['sometimes', 'boolean'],
        ]);

        $activeCount = $pickupSlot->orders()->whereNotIn('status', ['Cancelled', 'Completed'])->count();
        if ($validated['max_orders'] < $activeCount) {
            return response()->json(['message' => "Capacity cannot be lower than the {$activeCount} active orders already reserved."], 422);
        }

        $pickupSlot->update($validated);
        return response()->json($pickupSlot);
    }

    public function destroy(PickupSlot $pickupSlot): JsonResponse
    {
        if ($pickupSlot->orders()->exists()) {
            return response()->json(['message' => 'This pickup slot has order history. Close it instead of deleting it.'], 422);
        }
        $pickupSlot->delete();
        return response()->json(['message' => 'Pickup slot deleted.']);
    }
}
