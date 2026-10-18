<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PickupSlot;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Order::query()->where('user_id', $request->user()->id)->with([
            'items.menuItem:id,name,image_url',
            'pickupSlot:id,slot_time',
        ])->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->string('status')->toString());
        }

        return response()->json($query->paginate(10));
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $query = Order::query()->with([
            'user:id,name,id_number',
            'items.menuItem:id,name,image_url',
            'pickupSlot:id,slot_time',
        ])->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->string('status')->toString());
        }
        if ($request->filled('pickup_date')) {
            $query->whereDate('created_at', $request->string('pickup_date')->toString());
        }

        return response()->json($query->paginate(15));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'pickup_slot_id' => ['required', 'integer', 'exists:pickup_slots,id'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1', 'max:50'],
            'items.*.menu_item_id' => ['required', 'integer', 'distinct', 'exists:menu_items,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:100'],
        ]);

        $order = DB::transaction(function () use ($request, $validated) {
            $slot = PickupSlot::query()->lockForUpdate()->findOrFail($validated['pickup_slot_id']);
            abort_unless($slot->is_open, 422, 'This pickup slot is closed.');

            $activeOrders = Order::query()
                ->where('pickup_slot_id', $slot->id)
                ->whereNotIn('status', ['Cancelled', 'Completed'])
                ->lockForUpdate()
                ->count();

            abort_if($activeOrders >= $slot->max_orders, 422, 'This pickup slot is full. Please choose another time.');

            $ids = collect($validated['items'])->pluck('menu_item_id');
            $items = MenuItem::query()->whereIn('id', $ids)->lockForUpdate()->get()->keyBy('id');

            $total = 0;
            foreach ($validated['items'] as $item) {
                $menuItem = $items->get($item['menu_item_id']);
                abort_unless($menuItem && $menuItem->is_available, 422, 'One or more selected menu items are unavailable.');
                $total += (float) $menuItem->price * $item['quantity'];
            }

            $order = Order::create([
                'user_id' => $request->user()->id,
                'pickup_slot_id' => $slot->id,
                'order_number' => 'CC-' . Str::upper(Str::random(8)),
                'status' => 'Pending',
                'total_amount' => $total,
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                $menuItem = $items->get($item['menu_item_id']);
                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_item_id' => $menuItem->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $menuItem->price,
                ]);
            }

            return $order;
        });

        return response()->json($order->load(['items.menuItem:id,name,image_url', 'pickupSlot:id,slot_time']), 201);
    }

    public function show(Request $request, Order $order): JsonResponse
    {
        abort_unless($request->user()->isAdmin() || $order->user_id === $request->user()->id, 403);
        return response()->json($order->load(['items.menuItem:id,name,image_url', 'pickupSlot:id,slot_time', 'user:id,name,id_number']));
    }

    public function cancel(Request $request, Order $order): JsonResponse
    {
        abort_unless($order->user_id === $request->user()->id, 403);
        abort_unless($order->status === 'Pending', 422, 'Only pending orders may be cancelled.');
        $order->update(['status' => 'Cancelled']);
        return response()->json($order->fresh());
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'])],
        ]);

        $allowed = [
            'Pending' => ['Preparing', 'Cancelled'],
            'Preparing' => ['Ready', 'Cancelled'],
            'Ready' => ['Completed', 'Cancelled'],
            'Completed' => [],
            'Cancelled' => [],
        ];

        abort_unless(in_array($validated['status'], $allowed[$order->status] ?? [], true), 422, 'That order status transition is not allowed.');
        $order->update(['status' => $validated['status']]);
        return response()->json($order->fresh()->load(['items.menuItem:id,name,image_url', 'pickupSlot:id,slot_time', 'user:id,name,id_number']));
    }

    public function destroy(Order $order): JsonResponse
    {
        $order->delete();
        return response()->json(['message' => 'Order deleted.']);
    }
}
