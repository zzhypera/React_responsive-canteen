<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Category::query()->withCount('menuItems')->orderBy('name')->paginate(20));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate(['name' => ['required', 'string', 'max:100', 'unique:categories,name']]);
        return response()->json(Category::create($validated), 201);
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        $validated = $request->validate(['name' => ['required', 'string', 'max:100', Rule::unique('categories', 'name')->ignore($category->id)]]);
        $category->update($validated);
        return response()->json($category);
    }

    public function destroy(Category $category): JsonResponse
    {
        if ($category->menuItems()->exists()) {
            return response()->json(['message' => 'Move or delete this category’s menu items before deleting the category.'], 422);
        }
        $category->delete();
        return response()->json(['message' => 'Category deleted.']);
    }
}
