<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\PickupSlot;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@canteen.local'],
            ['name' => 'Canteen Administrator', 'id_number' => null, 'password' => Hash::make('admin123'), 'role' => 'admin'],
        );

        $student = User::updateOrCreate(
            ['email' => 'student@campus.local'],
            ['name' => 'Campus Student', 'id_number' => 'STUDENT-DEMO-001', 'password' => Hash::make('student123'), 'role' => 'student'],
        );

        $secondStudent = User::updateOrCreate(
            ['email' => 'student2@campus.local'],
            ['name' => 'Campus Student Two', 'id_number' => 'STUDENT-DEMO-002', 'password' => Hash::make('student123'), 'role' => 'student'],
        );

        $catalog = [
            'Meals' => [
                ['Chicken Rice Meal', 'Grilled chicken, steamed rice, and house sauce.', 85, 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85'],
                ['Spaghetti Meal', 'Sweet-style spaghetti with cheese and savory sauce.', 75, 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?auto=format&fit=crop&w=900&q=85'],
                ['Veggie Wrap', 'A healthy wrap filled with fresh vegetables and hummus.', 55, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=85'],
                ['Caesar Salad', 'Crisp greens with Caesar dressing and croutons.', 60, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=900&q=85'],
                ['Sinigang na Baboy', 'Traditional Filipino sour soup with pork and vegetables.', 80, 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85'],
            ],
            'Snacks' => [
                ['Campus Burger', 'Beef patty, lettuce, tomato, cheese, and special sauce.', 65, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85'],
                ['French Fries', 'Crispy golden fries with a light seasoning.', 40, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85'],
                ['Grilled Cheese Sandwich', 'Toasted sandwich with melted cheese and a side of chips.', 50, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=85'],
            ],
            'Drinks' => [
                ['Iced Coffee', 'Cold brewed coffee with creamy milk and ice.', 45, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=85'],
                ['Fruit Tea', 'Refreshing iced tea with fruit flavors.', 50, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=85'],
                ['Lemonade', 'Fresh lemonade with a hint of mint.', 35, 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=900&q=85'],
                ['Mango Smoothie', 'Creamy mango smoothie made with fresh mangoes.', 55, 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=900&q=85'],
                ['Iced Matcha Latte', 'Chilled matcha latte made with green tea powder and milk.', 60, 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=85'],
            ],
            'Breakfast' => [
                ['Pancake Stack', 'Soft pancakes served with syrup and butter.', 60, 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=85'],
            ],
            'Desserts' => [
                ['Chocolate Brownie', 'Rich chocolate brownie with a soft center.', 45, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85'],
                ['Halo-Halo', 'Filipino dessert with crushed ice, sweet beans, fruits, and milk.', 70, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=85'],
                ['Mango Float', 'Creamy mango dessert, served chilled.', 65, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=85'],
            ],
        ];

        foreach ($catalog as $categoryName => $items) {
            $category = Category::firstOrCreate(['name' => $categoryName]);
            foreach ($items as [$name, $description, $price, $imageUrl]) {
                MenuItem::updateOrCreate(
                    ['name' => $name],
                    ['category_id' => $category->id, 'description' => $description, 'price' => $price, 'image_url' => $imageUrl, 'is_available' => true],
                );
            }
        }

        foreach ([
            '10:00 AM – 10:30 AM',
            '10:30 AM – 11:00 AM',
            '11:00 AM – 11:30 AM',
            '11:30 AM – 12:00 PM',
            '12:00 PM – 12:30 PM',
        ] as $time) {
            PickupSlot::firstOrCreate(['slot_time' => $time], ['max_orders' => 12, 'is_open' => true]);
        }

        $pickupSlots = PickupSlot::query()->orderBy('id')->get()->values();
        $menuItemsByName = MenuItem::query()->get()->keyBy('name');

        $sampleOrders = [
            [
                'order_number' => 'DEMO-1001',
                'user' => $student,
                'pickup_slot' => $pickupSlots[0],
                'status' => 'Completed',
                'notes' => 'Please include an extra serving of sauce.',
                'placed_at' => now()->subDay(),
                'items' => ['Chicken Rice Meal' => 1, 'Iced Coffee' => 1],
            ],
            [
                'order_number' => 'DEMO-1002',
                'user' => $secondStudent,
                'pickup_slot' => $pickupSlots[1],
                'status' => 'Ready',
                'notes' => null,
                'placed_at' => now()->subMinutes(35),
                'items' => ['Campus Burger' => 1, 'French Fries' => 1, 'Lemonade' => 1],
            ],
            [
                'order_number' => 'DEMO-1003',
                'user' => $student,
                'pickup_slot' => $pickupSlots[2],
                'status' => 'Preparing',
                'notes' => 'No cutlery needed.',
                'placed_at' => now()->subMinutes(20),
                'items' => ['Spaghetti Meal' => 1, 'Fruit Tea' => 1, 'Chocolate Brownie' => 1],
            ],
            [
                'order_number' => 'DEMO-1004',
                'user' => $secondStudent,
                'pickup_slot' => $pickupSlots[3],
                'status' => 'Pending',
                'notes' => null,
                'placed_at' => now()->subMinutes(5),
                'items' => ['Sinigang na Baboy' => 1, 'Iced Matcha Latte' => 1],
            ],
            [
                'order_number' => 'DEMO-1005',
                'user' => $student,
                'pickup_slot' => $pickupSlots[4],
                'status' => 'Cancelled',
                'notes' => null,
                'placed_at' => now()->subHours(2),
                'items' => ['Veggie Wrap' => 1, 'Mango Smoothie' => 1],
            ],
        ];

        foreach ($sampleOrders as $sampleOrder) {
            $lineItems = [];
            $totalAmount = 0;

            foreach ($sampleOrder['items'] as $menuItemName => $quantity) {
                $menuItem = $menuItemsByName->get($menuItemName);

                if ($menuItem === null) {
                    throw new \RuntimeException("Seed menu item [{$menuItemName}] was not found.");
                }

                $lineItems[] = [
                    'menu_item_id' => $menuItem->id,
                    'quantity' => $quantity,
                    'unit_price' => $menuItem->price,
                    'created_at' => $sampleOrder['placed_at'],
                    'updated_at' => $sampleOrder['placed_at'],
                ];
                $totalAmount += (float) $menuItem->price * $quantity;
            }

            $placedAt = $sampleOrder['placed_at'];
            $order = Order::updateOrCreate(
                ['order_number' => $sampleOrder['order_number']],
                [
                    'user_id' => $sampleOrder['user']->id,
                    'pickup_slot_id' => $sampleOrder['pickup_slot']->id,
                    'status' => $sampleOrder['status'],
                    'total_amount' => number_format($totalAmount, 2, '.', ''),
                    'notes' => $sampleOrder['notes'],
                    'created_at' => $placedAt,
                    'updated_at' => $placedAt,
                ],
            );

            $order->items()->delete();
            $order->items()->createMany($lineItems);
        }
    }
}
