class InventoryItem {
  final int id;
  final String category;
  final bool isLowStock;
  final int lowStock;
  final String name;
  final int quantity;

  InventoryItem({
    required this.id,
    required this.category,
    required this.isLowStock,
    required this.lowStock,
    required this.name,
    required this.quantity,
  });

  factory InventoryItem.fromJson(Map<String, dynamic> json) {
    int qty = json['quantity'] as int;
    int threshold = json['lowStock'] as int? ?? 10;
    // Set to true if quantity is at or below the threshold, but handle 0 threshold as defaulting to 10
    int effectiveThreshold = threshold > 0 ? threshold : 10;

    return InventoryItem(
      id: json['id'] as int,
      category: json['category'] as String,
      isLowStock: qty <= effectiveThreshold,
      lowStock: threshold,
      name: json['name'] as String,
      quantity: qty,
    );
  }
}
