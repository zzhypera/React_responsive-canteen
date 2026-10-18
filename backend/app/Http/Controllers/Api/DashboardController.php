<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $todayOrders = Order::query()->whereDate('created_at', today());
        $salesToday = (clone $todayOrders)->whereNotIn('status', ['Cancelled'])->sum('total_amount');
        $todayCount = (clone $todayOrders)->count();
        $pendingCount = Order::query()->where('status', 'Pending')->count();

        $bestSeller = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('menu_items', 'menu_items.id', '=', 'order_items.menu_item_id')
            ->where('orders.status', '!=', 'Cancelled')
            ->select('menu_items.id', 'menu_items.name', DB::raw('SUM(order_items.quantity) as quantity_sold'))
            ->groupBy('menu_items.id', 'menu_items.name')
            ->orderByDesc('quantity_sold')
            ->first();

        $busiestSlot = DB::table('orders')
            ->join('pickup_slots', 'pickup_slots.id', '=', 'orders.pickup_slot_id')
            ->whereNotIn('orders.status', ['Cancelled'])
            ->select('pickup_slots.id', 'pickup_slots.slot_time', DB::raw('COUNT(orders.id) as order_count'))
            ->groupBy('pickup_slots.id', 'pickup_slots.slot_time')
            ->orderByDesc('order_count')
            ->first();

        return response()->json([
            'orders_today' => $todayCount,
            'pending_orders' => $pendingCount,
            'sales_today' => (float) $salesToday,
            'menu_items' => MenuItem::query()->count(),
            'available_menu_items' => MenuItem::query()->where('is_available', true)->count(),
            'best_selling_item' => $bestSeller,
            'busiest_pickup_slot' => $busiestSlot,
            'recent_orders' => Order::query()->with(['user:id,name', 'pickupSlot:id,slot_time'])->latest()->limit(8)->get(),
        ]);
    }
}
