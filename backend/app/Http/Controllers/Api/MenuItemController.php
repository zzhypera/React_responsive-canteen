<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MenuItemController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = MenuItem::query()->with('category:id,name');

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(fn ($q) => $q->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%"));
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->integer('category_id'));
        }

        if ($request->has('available')) {
            $query->where('is_available', $request->boolean('available'));
        }

        return response()->json($query->orderBy('name')->paginate(12));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateItem($request);
        return response()->json(MenuItem::create($validated)->load('category:id,name'), 201);
    }

    public function update(Request $request, MenuItem $menuItem): JsonResponse
    {
        $menuItem->update($this->validateItem($request));
        return response()->json($menuItem->fresh()->load('category:id,name'));
    }

    public function destroy(MenuItem $menuItem): JsonResponse
    {
        if ($menuItem->orderItems()->exists()) {
            return response()->json(['message' => 'This item belongs to an order. Mark it unavailable instead of deleting it.'], 422);
        }
        $menuItem->delete();
        return response()->json(['message' => 'Menu item deleted.']);
    }

    private function validateItem(Request $request): array
    {
        return $request->validate([
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:2000'],
            'price' => ['required', 'numeric', 'gt:0', 'max:99999999.99'],
            'image_url' => ['nullable', 'url', 'max:2048'],
            'is_available' => ['sometimes', 'boolean'],
        ]);
    }
}
