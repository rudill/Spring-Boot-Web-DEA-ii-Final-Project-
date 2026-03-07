import 'package:flutter/material.dart';
import '../models/inventory_item.dart';
import '../services/inventory_service.dart';
import 'reports_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class AppColors {
  static const primary = Color(0xFF284BA8); // Main dark blue
  static const primaryLight = Color(0xFF3F5DD1);
  static const primaryDark = Color(0xFF1E3A8A); // Darker blue for active states
  static const background = Color(0xFFF5F6FA); // Light gray background
  static const surface = Color(0xFFFFFFFF);
  static const textPrimary = Color(0xFF0F172A);
  static const textSecondary = Color(0xFF64748B);
  static const border = Color(0xFFE2E8F0);
  static const slate50 = Color(0xFFF8FAFC);
  static const accent = Color(0xFFFFC107); // Gold/Yellow accent
}

class _DashboardScreenState extends State<DashboardScreen> {
  final InventoryService _inventoryService = InventoryService();
  late Future<List<InventoryItem>> _inventoryFuture;
  final TextEditingController _searchController = TextEditingController();

  int _totalItemsCount = 0;
  int _lowStockCount = 0;
  int _selectedIndex = 0;
  List<InventoryItem> _items = [];

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  void _fetchData() {
    setState(() {
      _inventoryFuture = _inventoryService.fetchInventory();
      _inventoryFuture
          .then((items) {
            if (mounted) {
              setState(() {
                _items = items;
                _totalItemsCount = items.length;
                _lowStockCount = items.where((item) => item.isLowStock).length;
              });
            }
          })
          .catchError((error) {
            // Handle error if needed
          });
    });
  }

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 850;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: isMobile
          ? AppBar(
              backgroundColor: AppColors.primary,
              title: const Text(
                'Inventory Management',
                style: TextStyle(color: Colors.white, fontSize: 18),
              ),
              iconTheme: const IconThemeData(color: Colors.white),
            )
          : null,
      drawer: isMobile ? Drawer(child: _buildSidebar()) : null,
      body: isMobile
          ? (_selectedIndex == 1
                ? ReportsScreen(items: _items)
                : _buildInventoryContent())
          : Row(
              children: [
                _buildSidebar(),
                Expanded(
                  child: _selectedIndex == 1
                      ? ReportsScreen(items: _items)
                      : _buildInventoryContent(),
                ),
              ],
            ),
    );
  }

  Widget _buildInventoryContent() {
    final isMobile = MediaQuery.of(context).size.width < 850;
    return Column(
      children: [
        _buildHeader(), // The new top area (Title + Add Button + Search)
        Expanded(
          child: SingleChildScrollView(
            padding: EdgeInsets.symmetric(
              horizontal: isMobile ? 16.0 : 32.0,
              vertical: 16.0,
            ),
            child: Column(
              children: [
                _buildStatsGrid(),
                const SizedBox(height: 24),
                _buildInventoryDataBox(),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSidebar() {
    return Container(
      width: 280,
      color: AppColors.primary, // Dark blue background
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Branding (Logo only)
          Padding(
            padding: const EdgeInsets.only(top: 40.0, bottom: 20.0),
            child: Center(
              child: Image.asset(
                'assets/images/Hotel_Logo.png',
                height: 100, // Adjust size as needed
                // Using colorFilter if you need to tint it, otherwise leave as is if the logo is white text
              ),
            ),
          ),

          // User Profile Area
          Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: 24.0,
              vertical: 16.0,
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundColor: AppColors.primaryDark,
                  child: const Icon(
                    Icons.person_outline,
                    color: AppColors.accent,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Inventory Manager",
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      Text(
                        "ADMIN",
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: AppColors.accent,
                          letterSpacing: 1.2,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Navigation
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                // _buildNavItem(Icons.dashboard_outlined, "Dashboard", 0),
                _buildNavItem(Icons.inventory_2_outlined, "Inventory", 0),
                // _buildNavItem(Icons.shopping_cart_outlined, "Orders", 2),
                // _buildNavItem(Icons.local_shipping_outlined, "Suppliers", 3),
                _buildNavItem(Icons.bar_chart_outlined, "Reports", 1),
              ],
            ),
          ),

          // Bottom area: Logout and Footer
          Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              children: [
                Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: TextButton.icon(
                    onPressed: () {
                      // Handle logout
                      Navigator.of(context).pushReplacementNamed('/');
                    },
                    icon: const Icon(
                      Icons.logout,
                      color: Colors.white,
                      size: 20,
                    ),
                    label: const Text(
                      "Logout",
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.normal,
                      ),
                    ),
                    style: TextButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                const Text(
                  "© 2026 Hotel",
                  style: TextStyle(color: Colors.white70, fontSize: 12),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 4),
                const Text(
                  "Inventory Management System",
                  style: TextStyle(color: Colors.white54, fontSize: 10),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNavItem(IconData icon, String title, int index) {
    bool isActive = _selectedIndex == index;
    return Container(
      decoration: BoxDecoration(
        color: isActive ? Colors.white.withOpacity(0.15) : Colors.transparent,
        border: Border(
          left: BorderSide(
            color: isActive ? AppColors.accent : Colors.transparent,
            width: 4, // Gold indicator bar like in the image
          ),
        ),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 24.0),
        leading: Icon(
          icon,
          color: isActive ? Colors.white : Colors.white70,
          size: 22,
        ),
        title: Text(
          title,
          style: TextStyle(
            fontSize: 14,
            fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
            color: isActive ? Colors.white : Colors.white70,
          ),
        ),
        onTap: () {
          setState(() {
            _selectedIndex = index;
          });
        },
      ),
    );
  }

  Widget _buildHeader() {
    final isMobile = MediaQuery.of(context).size.width < 850;
    return Container(
      padding: EdgeInsets.only(
        left: isMobile ? 16 : 32,
        right: isMobile ? 16 : 32,
        top: isMobile ? 16 : 32,
        bottom: 16,
      ),
      color: AppColors.background,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top Row: Title + Add Button
          if (isMobile)
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Inventory Directory",
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  "$_totalItemsCount items found",
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () => _showAddEditItemDialog(),
                    icon: const Icon(
                      Icons.add_box_outlined,
                      size: 20,
                      color: Colors.white,
                    ),
                    label: const Text(
                      "Add Item",
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 16,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      elevation: 0,
                    ),
                  ),
                ),
              ],
            )
          else
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Inventory Directory",
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      "$_totalItemsCount items found",
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
                ElevatedButton.icon(
                  onPressed: () => _showAddEditItemDialog(),
                  icon: const Icon(
                    Icons.add_box_outlined,
                    size: 20,
                    color: Colors.white,
                  ),
                  label: const Text(
                    "Add Item",
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 16,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    elevation: 0,
                  ),
                ),
              ],
            ),
          const SizedBox(height: 24),
          // Search Bar Row
          Container(
            height: 50,
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppColors.border),
            ),
            child: TextField(
              controller: _searchController,
              onSubmitted: (value) {
                setState(() {
                  if (value.isEmpty) {
                    _fetchData();
                  } else {
                    _inventoryFuture = _inventoryService.searchItems(value);
                  }
                });
              },
              decoration: InputDecoration(
                hintText: "Search by item name or category...",
                hintStyle: const TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 14,
                ),
                prefixIcon: const Icon(
                  Icons.search,
                  color: AppColors.textSecondary,
                  size: 20,
                ),
                suffixIcon: IconButton(
                  icon: const Icon(Icons.clear, size: 16),
                  onPressed: () {
                    _searchController.clear();
                    _fetchData();
                  },
                ),
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 14,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsGrid() {
    final isMobile = MediaQuery.of(context).size.width < 850;
    if (isMobile) {
      return Column(
        children: [
          _buildStatCard(
            "Total Available Stock",
            _totalItemsCount.toString(),
            Icons.inventory_2,
            AppColors.primary,
          ),
          const SizedBox(height: 16),
          _buildStatCard(
            "Low Stock Items",
            _lowStockCount.toString(),
            Icons.warning_amber_rounded,
            Colors.orange,
          ),
        ],
      );
    }

    return Row(
      children: [
        Expanded(
          child: _buildStatCard(
            "Total Available Stock",
            _totalItemsCount.toString(),
            Icons.inventory_2,
            AppColors.primary,
          ),
        ),
        const SizedBox(width: 24),
        Expanded(
          child: _buildStatCard(
            "Low Stock Items",
            _lowStockCount.toString(),
            Icons.warning_amber_rounded,
            Colors.orange,
          ),
        ),
      ],
    );
  }

  Widget _buildStatCard(
    String title,
    String value,
    IconData icon,
    Color color,
  ) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color, size: 24),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            title,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(
              fontSize: 30,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInventoryDataBox() {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Wrap(
                  spacing: 12,
                  runSpacing: 8,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    const Text(
                      "Inventory Items",
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.slate50,
                        border: Border.all(color: AppColors.border),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text(
                        "All Items",
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ),
                  ],
                ),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    TextButton.icon(
                      onPressed: () {
                        setState(() {
                          _inventoryFuture = _inventoryService
                              .fetchLowStockItems();
                        });
                      },
                      icon: const Icon(
                        Icons.filter_list,
                        size: 18,
                        color: AppColors.textSecondary,
                      ),
                      label: const Text(
                        "Low Stock",
                        style: TextStyle(color: AppColors.textSecondary),
                      ),
                    ),
                    TextButton.icon(
                      onPressed: () {
                        setState(() {
                          _inventoryFuture = _inventoryService.fetchInventory();
                        });
                      },
                      icon: const Icon(
                        Icons.clear_all,
                        size: 18,
                        color: AppColors.textSecondary,
                      ),
                      label: const Text(
                        "Clear Filter",
                        style: TextStyle(color: AppColors.textSecondary),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const Divider(height: 1, color: AppColors.border),
          FutureBuilder<List<InventoryItem>>(
            future: _inventoryFuture,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Padding(
                  padding: EdgeInsets.all(40.0),
                  child: Center(
                    child: CircularProgressIndicator(color: AppColors.primary),
                  ),
                );
              } else if (snapshot.hasError) {
                return Padding(
                  padding: const EdgeInsets.all(40.0),
                  child: Center(
                    child: Text(
                      'Error: ${snapshot.error}',
                      style: const TextStyle(color: Colors.red),
                    ),
                  ),
                );
              } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                return const Padding(
                  padding: EdgeInsets.all(40.0),
                  child: Center(
                    child: Text(
                      'No items found',
                      style: TextStyle(color: AppColors.textSecondary),
                    ),
                  ),
                );
              }

              final items = snapshot.data!;
              return SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: DataTable(
                  headingRowColor: WidgetStateProperty.all(AppColors.primary),
                  dataRowMaxHeight: 80,
                  dataRowMinHeight: 80,
                  dividerThickness: 1,
                  horizontalMargin: 24,
                  columnSpacing: 40,
                  headingTextStyle: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                  border: const TableBorder(
                    horizontalInside: BorderSide(color: AppColors.border),
                  ),
                  columns: const [
                    DataColumn(
                      label: Text(
                        'Item Name',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                          fontSize: 12,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                    DataColumn(
                      label: Text(
                        'Category',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                          fontSize: 12,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                    DataColumn(
                      label: Text(
                        'SKU',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                          fontSize: 12,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                    DataColumn(
                      label: Text(
                        'Quantity',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                          fontSize: 12,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                    DataColumn(
                      label: Text(
                        'Status',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                          fontSize: 12,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                    DataColumn(
                      label: Text(
                        'Actions',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                          fontSize: 12,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ],
                  rows: items.map((item) {
                    // Style attributes based on category
                    Color catBgColor = Colors.blue.shade50;
                    Color catTextColor = Colors.blue.shade700;
                    IconData itemIcon = Icons.inventory_2_outlined;

                    if (item.category.toLowerCase().contains('linens') ||
                        item.category.toLowerCase().contains('bedding')) {
                      catBgColor = Colors.blue.shade50;
                      catTextColor = Colors.blue.shade700;
                      itemIcon = Icons.bed_outlined;
                    } else if (item.category.toLowerCase().contains(
                          'toiletries',
                        ) ||
                        item.category.toLowerCase().contains('bath')) {
                      catBgColor = Colors.teal.shade50;
                      catTextColor = Colors.teal.shade700;
                      itemIcon = Icons.wash_outlined;
                    } else if (item.category.toLowerCase().contains('f&b') ||
                        item.category.toLowerCase().contains('food')) {
                      catBgColor = Colors.amber.shade50;
                      catTextColor = Colors.amber.shade700;
                      itemIcon = Icons.coffee_outlined;
                    }

                    return DataRow(
                      cells: [
                        DataCell(
                          Row(
                            children: [
                              Container(
                                width: 40,
                                height: 40,
                                decoration: BoxDecoration(
                                  color: AppColors.slate50,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Icon(
                                  itemIcon,
                                  color: AppColors.textSecondary,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item.name,
                                    style: const TextStyle(
                                      fontWeight: FontWeight.w500,
                                      color: AppColors.textPrimary,
                                    ),
                                  ),
                                  const Text(
                                    "Last updated: recently",
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: AppColors.textSecondary,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        DataCell(
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: catBgColor,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              item.category,
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: catTextColor,
                              ),
                            ),
                          ),
                        ),
                        DataCell(
                          Text(
                            'ITM-${item.id.toString().padLeft(3, '0')}',
                            style: const TextStyle(
                              fontSize: 13,
                              fontFamily: 'monospace',
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ),
                        DataCell(
                          Text(
                            '${item.quantity}',
                            style: const TextStyle(
                              fontWeight: FontWeight.w500,
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ),
                        DataCell(
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: item.isLowStock
                                  ? Colors.orange.shade50
                                  : Colors.green.shade50,
                              border: Border.all(
                                color: item.isLowStock
                                    ? Colors.orange.shade100
                                    : Colors.green.shade100,
                              ),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  width: 6,
                                  height: 6,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: item.isLowStock
                                        ? Colors.orange.shade500
                                        : Colors.green.shade500,
                                  ),
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  item.isLowStock ? 'Low Stock' : 'In Stock',
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w500,
                                    color: item.isLowStock
                                        ? Colors.orange.shade700
                                        : Colors.green.shade700,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        DataCell(
                          Row(
                            children: [
                              Container(
                                decoration: BoxDecoration(
                                  color: Colors.green.shade50,
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: IconButton(
                                  padding: const EdgeInsets.all(4),
                                  constraints: const BoxConstraints(),
                                  icon: Icon(
                                    Icons.edit_outlined,
                                    size: 16,
                                    color: Colors.green.shade400,
                                  ),
                                  tooltip: 'Edit/Restock',
                                  onPressed: () =>
                                      _showAddEditItemDialog(item: item),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                decoration: BoxDecoration(
                                  color: Colors.red.shade50,
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: IconButton(
                                  padding: const EdgeInsets.all(4),
                                  constraints: const BoxConstraints(),
                                  icon: Icon(
                                    Icons.delete_outline,
                                    size: 16,
                                    color: Colors.red.shade400,
                                  ),
                                  tooltip: 'Delete',
                                  onPressed: () async {
                                    final confirm = await showDialog<bool>(
                                      context: context,
                                      builder: (context) => AlertDialog(
                                        title: const Text('Delete Item'),
                                        content: Text(
                                          'Are you sure you want to delete ${item.name}?',
                                        ),
                                        actions: [
                                          TextButton(
                                            onPressed: () =>
                                                Navigator.pop(context, false),
                                            child: const Text('Cancel'),
                                          ),
                                          TextButton(
                                            onPressed: () =>
                                                Navigator.pop(context, true),
                                            child: const Text(
                                              'Delete',
                                              style: TextStyle(
                                                color: Colors.red,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    );
                                    if (confirm == true) {
                                      try {
                                        await _inventoryService.deleteItem(
                                          item.id,
                                        );
                                        _fetchData();
                                        if (!context.mounted) return;
                                        ScaffoldMessenger.of(
                                          context,
                                        ).showSnackBar(
                                          const SnackBar(
                                            content: Text(
                                              'Item deleted successfully',
                                            ),
                                          ),
                                        );
                                      } catch (e) {
                                        if (!context.mounted) return;
                                        ScaffoldMessenger.of(
                                          context,
                                        ).showSnackBar(
                                          SnackBar(
                                            content: Text(e.toString()),
                                            backgroundColor: Colors.red,
                                          ),
                                        );
                                      }
                                    }
                                  },
                                ),
                              ),
                              const SizedBox(width: 8),
                              // Optional: Keep Consume as a separate button if required
                              Container(
                                decoration: BoxDecoration(
                                  color: Colors.orange.shade50,
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: IconButton(
                                  padding: const EdgeInsets.all(4),
                                  constraints: const BoxConstraints(),
                                  icon: Icon(
                                    Icons.remove_shopping_cart_outlined,
                                    size: 16,
                                    color: Colors.orange.shade400,
                                  ),
                                  tooltip: 'Consume',
                                  onPressed: () => _showConsumeDialog(item),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    );
                  }).toList(),
                ),
              );
            },
          ),
          const Divider(height: 1, color: AppColors.border),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "Showing items",
                  style: TextStyle(
                    fontSize: 14,
                    color: AppColors.textSecondary,
                  ),
                ),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    OutlinedButton(
                      onPressed: null,
                      style: OutlinedButton.styleFrom(
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        side: const BorderSide(color: AppColors.border),
                      ),
                      child: const Text("Previous"),
                    ),
                    OutlinedButton(
                      onPressed: () {},
                      style: OutlinedButton.styleFrom(
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        side: const BorderSide(color: AppColors.border),
                        foregroundColor: AppColors.textPrimary,
                      ),
                      child: const Text("Next"),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showConsumeDialog(InventoryItem item) {
    final TextEditingController amountController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Consume ${item.name}'),
          content: TextField(
            controller: amountController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              labelText: 'Consume Amount',
              border: OutlineInputBorder(),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () async {
                final amount = int.tryParse(amountController.text) ?? 0;
                if (amount > 0) {
                  Navigator.pop(context);
                  try {
                    await _inventoryService.consumeItem(item.id, amount);
                    _fetchData();
                    if (!context.mounted) return;
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Item consumed successfully'),
                      ),
                    );
                  } catch (e) {
                    if (!context.mounted) return;
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          e.toString().replaceAll('Exception: ', ''),
                        ),
                        backgroundColor: Colors.red,
                        duration: const Duration(seconds: 4),
                      ),
                    );
                  }
                }
              },
              child: const Text('Consume'),
            ),
          ],
        );
      },
    );
  }

  void _showAddEditItemDialog({InventoryItem? item}) {
    final isEditing = item != null;
    final nameController = TextEditingController(text: item?.name ?? '');
    final categoryController = TextEditingController(
      text: item?.category ?? '',
    );
    final quantityController = TextEditingController(
      text: item?.quantity.toString() ?? '',
    );
    // Using 10 as default low stock threshold for new items
    final lowStockController = TextEditingController(
      text: item?.lowStock.toString() ?? '10',
    );

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(isEditing ? 'Edit Item' : 'Add Item'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(
                    labelText: 'Name',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: categoryController,
                  decoration: const InputDecoration(
                    labelText: 'Category',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: quantityController,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Quantity',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: lowStockController,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Low Stock Threshold',
                    border: OutlineInputBorder(),
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () async {
                final name = nameController.text.trim();
                final category = categoryController.text.trim();
                final quantity = int.tryParse(quantityController.text) ?? 0;
                final lowStock = int.tryParse(lowStockController.text) ?? 10;

                if (name.isNotEmpty && category.isNotEmpty) {
                  Navigator.pop(context);
                  try {
                    final itemData = {
                      'name': name,
                      'category': category,
                      'quantity': quantity,
                      'lowStock': lowStock,
                    };
                    if (isEditing) {
                      await _inventoryService.updateItem(item.id, itemData);
                    } else {
                      await _inventoryService.addItem(itemData);
                    }
                    _fetchData();
                    if (!context.mounted) return;
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          isEditing ? 'Item updated' : 'Item added',
                        ),
                      ),
                    );
                  } catch (e) {
                    if (!context.mounted) return;
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(e.toString()),
                        backgroundColor: Colors.red,
                      ),
                    );
                  }
                }
              },
              child: Text(isEditing ? 'Update' : 'Add'),
            ),
          ],
        );
      },
    );
  }
}
