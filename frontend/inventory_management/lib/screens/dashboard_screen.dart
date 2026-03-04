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
  static const primary = Color(0xFF193DB3);
  static const primaryLight = Color(0xFF3F5DD1);
  static const primaryDark = Color(0xFF0F2573);
  static const background = Color(0xFFF6F6F8);
  static const surface = Color(0xFFFFFFFF);
  static const textPrimary = Color(0xFF0F172A);
  static const textSecondary = Color(0xFF64748B);
  static const border = Color(0xFFE2E8F0);
  static const slate50 = Color(0xFFF8FAFC);
}

class _DashboardScreenState extends State<DashboardScreen> {
  final InventoryService _inventoryService = InventoryService();
  late Future<List<InventoryItem>> _inventoryFuture;
  final TextEditingController _searchController = TextEditingController();

  int _totalItemsCount = 0;
  int _lowStockCount = 0;
  int _selectedIndex = 1; // 1 = Inventory, 4 = Reports
  List<InventoryItem> _items = [];

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  void _fetchData() {
    final future = _inventoryService.fetchInventory();
    setState(() {
      _inventoryFuture = future;
    });

    future
        .then((items) {
          if (mounted) {
            setState(() {
              _items = items;
              _totalItemsCount = items.length;
              _lowStockCount = items.where((item) => item.isLowStock).length;
            });
          }
        })
        .catchError((_) {
          // Handle or ignore gracefully in the future builder
        });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Row(
        children: [
          _buildSidebar(),
          Expanded(
            child: _selectedIndex == 4
                ? ReportsScreen(items: _items)
                : _buildInventoryContent(),
          ),
        ],
      ),
    );
  }

  Widget _buildInventoryContent() {
    return Column(
      children: [
        _buildHeader(),
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(32.0),
            child: Column(
              children: [
                _buildStatsGrid(),
                const SizedBox(height: 32),
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
      width: 288,
      color: AppColors.surface,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Branding
          Container(
            padding: const EdgeInsets.all(24.0),
            decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: AppColors.border)),
            ),
            child: Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: AppColors.primary.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                    image: const DecorationImage(
                      image: NetworkImage(
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ9kme7nag09hgLi9WD-kjxjDDvixb3vq-Df_b85RUcT_NG23p8k7m8LXk8bAnXOrMXGMSVRIIsXY434vZW_XjMzCPP_42PAtYkqizFNIRfdcuUhJLVscFwjVirs6gLKJSLojCnU9_K0ELEfMQxS9_keNatEYkCUigcTnK_KoHbhIrzKDvfT8MtBcxuTLeVCX9QoQ05xOlPxZHLQnSChpZqfHVUi9eLM9bZxJJdty1we7WjLM52w3HoE84WWDx_p2WCHKWwpqgUdeo",
                      ),
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Grand Hotel",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    Text(
                      "Admin Portal",
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          // Navigation
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
              children: [
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  child: Text(
                    "MAIN MENU",
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textSecondary,
                      letterSpacing: 1.2,
                    ),
                  ),
                ),
                _buildNavItem(Icons.dashboard_outlined, "Dashboard", 0),
                _buildNavItem(Icons.inventory_2, "Inventory", 1),
                _buildNavItemWithBadge(
                  Icons.shopping_cart_outlined,
                  "Orders",
                  2,
                  "3",
                ),
                _buildNavItem(Icons.local_shipping_outlined, "Suppliers", 3),
                _buildNavItem(Icons.bar_chart_outlined, "Reports", 4),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 16),
                  child: Divider(color: AppColors.border),
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  child: Text(
                    "SYSTEM",
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textSecondary,
                      letterSpacing: 1.2,
                    ),
                  ),
                ),
                _buildNavItem(Icons.settings_outlined, "Settings", 5),
                _buildNavItem(Icons.help_outline, "Help Center", 6),
              ],
            ),
          ),
          // User Profile Bottom
          Container(
            padding: const EdgeInsets.all(16.0),
            decoration: const BoxDecoration(
              border: Border(top: BorderSide(color: AppColors.border)),
            ),
            child: Row(
              children: [
                const CircleAvatar(
                  radius: 16,
                  backgroundImage: NetworkImage(
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuAhnyQwMfTd4cpRcTriRFVCaa2EUWsldopPg0XGVc-zkYopwddiqgGb5w18Zji80hQG5qtMdxPI3809df1PhothUBPettBmQyF8ji937373q0SDXDNDVIH1AUPs5VO3qw816-ClBQnYUB29663Q2h5SzB1S1wzkZamMiz49Y4C_1fHl2sT-d_WUJw7Jr8jl0ekU17aA1t2XXPAKdhmBkasUSBjiw_0W_MU3SQBvPr_xZvL3YkGW5j-F2PGO0l9U0ChvsUO0osG6mHM8",
                  ),
                ),
                const SizedBox(width: 12),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Tom Cook",
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      Text(
                        "Log out",
                        style: TextStyle(
                          fontSize: 12,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
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
      margin: const EdgeInsets.only(bottom: 4),
      decoration: BoxDecoration(
        color: isActive
            ? AppColors.primary.withValues(alpha: 0.1)
            : Colors.transparent,
        borderRadius: BorderRadius.circular(8),
      ),
      child: ListTile(
        leading: Icon(
          icon,
          color: isActive ? AppColors.primary : AppColors.textSecondary,
          size: 22,
        ),
        title: Text(
          title,
          style: TextStyle(
            fontSize: 14,
            fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
            color: isActive ? AppColors.primary : AppColors.textSecondary,
          ),
        ),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        onTap: () {
          setState(() {
            _selectedIndex = index;
          });
        },
        hoverColor: AppColors.slate50,
      ),
    );
  }

  Widget _buildNavItemWithBadge(
    IconData icon,
    String title,
    int index,
    String badgeCount,
  ) {
    bool isActive = _selectedIndex == index;
    return Container(
      margin: const EdgeInsets.only(bottom: 4),
      decoration: BoxDecoration(
        color: isActive
            ? AppColors.primary.withValues(alpha: 0.1)
            : Colors.transparent,
        borderRadius: BorderRadius.circular(8),
      ),
      child: ListTile(
        leading: Icon(
          icon,
          color: isActive ? AppColors.primary : AppColors.textSecondary,
          size: 22,
        ),
        title: Text(
          title,
          style: TextStyle(
            fontSize: 14,
            fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
            color: isActive ? AppColors.primary : AppColors.textSecondary,
          ),
        ),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
          decoration: BoxDecoration(
            color: Colors.red.shade100,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            badgeCount,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: Colors.red.shade700,
            ),
          ),
        ),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        onTap: () {
          setState(() {
            _selectedIndex = index;
          });
        },
        hoverColor: AppColors.slate50,
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
      decoration: BoxDecoration(
        color: AppColors.surface.withValues(alpha: 0.9),
        border: const Border(bottom: BorderSide(color: AppColors.border)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Inventory Overview",
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              SizedBox(height: 4),
              Text(
                "Manage your hotel stock levels and orders.",
                style: TextStyle(fontSize: 14, color: AppColors.textSecondary),
              ),
            ],
          ),
          Row(
            children: [
              Container(
                width: 256,
                height: 44,
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.05),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ],
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
                    hintText: "Search inventory...",
                    hintStyle: const TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 14,
                    ),
                    prefixIcon: const Icon(
                      Icons.search,
                      color: AppColors.textSecondary,
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
                      vertical: 12,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Stack(
                children: [
                  IconButton(
                    onPressed: () {},
                    icon: const Icon(
                      Icons.notifications_none,
                      color: AppColors.textSecondary,
                    ),
                    style: IconButton.styleFrom(
                      backgroundColor: AppColors.surface,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      shadowColor: Colors.black.withValues(alpha: 0.05),
                      elevation: 2,
                    ),
                  ),
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: Colors.red,
                        shape: BoxShape.circle,
                        border: Border.all(color: AppColors.surface, width: 2),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(width: 16),
              ElevatedButton.icon(
                onPressed: () => _showAddEditItemDialog(),
                icon: const Icon(Icons.add, size: 20, color: Colors.white),
                label: const Text(
                  "Add Item",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: Colors.white,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 12,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 2,
                  shadowColor: AppColors.primary.withValues(alpha: 0.3),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatsGrid() {
    return Row(
      children: [
        Expanded(
          child: _buildStatCard(
            "Total Items",
            _totalItemsCount.toString(),
            Icons.inventory_2,
            Colors.blue,
            "12%",
            Icons.trending_up,
            true,
          ),
        ),
        const SizedBox(width: 24),
        Expanded(
          child: _buildStatCard(
            "Low Stock Alert",
            _lowStockCount.toString(),
            Icons.warning_amber_rounded,
            Colors.orange,
            "+3 new",
            Icons.trending_up,
            false,
          ),
        ),
        const SizedBox(width: 24),
        // Expanded(
        //   child: _buildStatCard(
        //     "Pending Orders",
        //     "8",
        //     Icons.pending_actions,
        //     Colors.purple,
        //     "-2",
        //     Icons.trending_down,
        //     false,
        //   ),
        // ),
        // const SizedBox(width: 24),
        // Expanded(
        //   child: _buildStatCard(
        //     "Total Value",
        //     "\$45,200",
        //     Icons.payments_outlined,
        //     Colors.green,
        //     "5%",
        //     Icons.trending_up,
        //     true,
        //   ),
        // ),
      ],
    );
  }

  Widget _buildStatCard(
    String title,
    String value,
    IconData icon,
    MaterialColor color,
    String trend,
    IconData trendIcon,
    bool isTrendPositive,
  ) {
    return Container(
      padding: const EdgeInsets.all(24),
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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.shade50,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color.shade600, size: 24),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: isTrendPositive
                      ? Colors.green.shade50
                      : Colors.red.shade50,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    Icon(
                      trendIcon,
                      size: 14,
                      color: isTrendPositive
                          ? Colors.green.shade700
                          : Colors.red.shade700,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      trend,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: isTrendPositive
                            ? Colors.green.shade700
                            : Colors.red.shade700,
                      ),
                    ),
                  ],
                ),
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
                Row(
                  children: [
                    const Text(
                      "Inventory Items",
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(width: 12),
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
                Row(
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
                    const SizedBox(width: 8),
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
                  headingRowColor: WidgetStateProperty.all(AppColors.slate50),
                  dataRowMaxHeight: 80,
                  dataRowMinHeight: 80,
                  dividerThickness: 1,
                  horizontalMargin: 24,
                  columnSpacing: 40,
                  border: const TableBorder(
                    horizontalInside: BorderSide(color: AppColors.border),
                  ),
                  columns: const [
                    DataColumn(
                      label: Text(
                        'Item Name',
                        style: TextStyle(
                          color: AppColors.textSecondary,
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
                          color: AppColors.textSecondary,
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
                          color: AppColors.textSecondary,
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
                          color: AppColors.textSecondary,
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
                          color: AppColors.textSecondary,
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
                          color: AppColors.textSecondary,
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
                                  border: Border.all(color: AppColors.border),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: IconButton(
                                  padding: const EdgeInsets.all(4),
                                  constraints: const BoxConstraints(),
                                  icon: const Icon(
                                    Icons.add_shopping_cart,
                                    size: 18,
                                    color: Colors.green,
                                  ),
                                  tooltip: 'Restock',
                                  hoverColor: Colors.green.withValues(
                                    alpha: 0.1,
                                  ),
                                  onPressed: () => _showRestockDialog(item),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                decoration: BoxDecoration(
                                  border: Border.all(color: AppColors.border),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: IconButton(
                                  padding: const EdgeInsets.all(4),
                                  constraints: const BoxConstraints(),
                                  icon: const Icon(
                                    Icons.remove_shopping_cart_outlined,
                                    size: 18,
                                    color: Colors.orange,
                                  ),
                                  tooltip: 'Consume',
                                  hoverColor: Colors.orange.withValues(
                                    alpha: 0.1,
                                  ),
                                  onPressed: () => _showConsumeDialog(item),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                decoration: BoxDecoration(
                                  border: Border.all(color: AppColors.border),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: IconButton(
                                  padding: const EdgeInsets.all(4),
                                  constraints: const BoxConstraints(),
                                  icon: const Icon(
                                    Icons.edit_outlined,
                                    size: 18,
                                    color: AppColors.primary,
                                  ),
                                  tooltip: 'Edit',
                                  hoverColor: AppColors.primary.withValues(
                                    alpha: 0.1,
                                  ),
                                  onPressed: () =>
                                      _showAddEditItemDialog(item: item),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                decoration: BoxDecoration(
                                  border: Border.all(color: AppColors.border),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: IconButton(
                                  padding: const EdgeInsets.all(4),
                                  constraints: const BoxConstraints(),
                                  icon: const Icon(
                                    Icons.delete_outline,
                                    size: 18,
                                    color: Colors.red,
                                  ),
                                  tooltip: 'Delete',
                                  hoverColor: Colors.red.withValues(alpha: 0.1),
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
                Row(
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
                    const SizedBox(width: 8),
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

  void _showRestockDialog(InventoryItem item) {
    final TextEditingController amountController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Restock ${item.name}'),
          content: TextField(
            controller: amountController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              labelText: 'Added Amount',
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
                    await _inventoryService.restockItem(item.id, amount);
                    _fetchData();
                    if (!context.mounted) return;
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Item restocked successfully'),
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
              child: const Text('Restock'),
            ),
          ],
        );
      },
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
