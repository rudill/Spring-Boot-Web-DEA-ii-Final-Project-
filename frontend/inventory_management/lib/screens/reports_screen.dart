import 'package:flutter/material.dart';
import '../models/inventory_item.dart';

class ReportsScreen extends StatelessWidget {
  final List<InventoryItem> items;

  const ReportsScreen({super.key, required this.items});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF6F6F8),
      body: Column(
        children: [
          _buildHeader(),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(32.0),
              child: Column(
                children: [
                  _buildStatsRow(),
                  const SizedBox(height: 24),
                  _buildVisualizationsRow(),
                  const SizedBox(height: 24),
                  _buildReorderedItemsTable(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      height: 64,
      padding: const EdgeInsets.symmetric(horizontal: 32),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.8),
        border: const Border(bottom: BorderSide(color: Color(0xFFE2E8F0))),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text(
            "Inventory Performance Reports",
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              letterSpacing: -0.5,
              color: Color(0xFF0F172A),
            ),
          ),
          Row(
            children: [
              Container(
                width: 256,
                height: 40,
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: TextField(
                  decoration: InputDecoration(
                    hintText: "Search reports...",
                    hintStyle: const TextStyle(
                      color: Color(0xFF94A3B8),
                      fontSize: 14,
                    ),
                    prefixIcon: const Icon(
                      Icons.search,
                      color: Color(0xFF94A3B8),
                      size: 20,
                    ),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(vertical: 10),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              ElevatedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.download_for_offline, size: 18),
                label: const Text("Generate Report"),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1E3FAE),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 0,
                  ),
                  minimumSize: const Size(0, 40),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  elevation: 2,
                ),
              ),
              const SizedBox(width: 16),
              Container(
                height: 40,
                width: 40,
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: IconButton(
                  icon: const Icon(
                    Icons.notifications_none,
                    color: Color(0xFF64748B),
                  ),
                  onPressed: () {},
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  int get _totalItems => items.fold(0, (sum, item) => sum + item.quantity);
  int get _lowStockItems => items.where((i) => i.isLowStock).length;

  Widget _buildStatsRow() {
    return Row(
      children: [
        Expanded(
          child: _buildStatCard(
            "Monthly Usage",
            "\$12,450",
            "5.2%",
            true,
            "Compared to \$11,834 last month",
          ),
        ),
        const SizedBox(width: 24),
        Expanded(
          child: _buildStatCard(
            "Inventory Turnover",
            "4.2x",
            "0.8%",
            false,
            "Industry average: 3.8x",
          ),
        ),
        const SizedBox(width: 24),
        Expanded(
          child: _buildStatCard(
            "Total Items in Stock",
            "$_totalItems",
            "",
            true,
            "Sum of all current inventory quantities",
          ),
        ),
        const SizedBox(width: 24),
        Expanded(
          child: _buildStatCard(
            "Low Stock Items",
            "$_lowStockItems",
            "",
            false,
            "Items below restock threshold",
          ),
        ),
      ],
    );
  }

  Widget _buildStatCard(
    String title,
    String value,
    String trend,
    bool isTrendUp,
    String subtitle,
  ) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 4,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: Color(0xFF64748B),
            ),
          ),
          const SizedBox(height: 8),
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                value,
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  letterSpacing: -0.5,
                  color: Color(0xFF0F172A),
                ),
              ),
              const SizedBox(width: 8),
              const SizedBox(width: 8),
              if (trend.isNotEmpty)
                Row(
                  children: [
                    Icon(
                      isTrendUp ? Icons.trending_up : Icons.trending_down,
                      size: 14,
                      color: isTrendUp ? const Color(0xFF10B981) : Colors.red,
                    ),
                    const SizedBox(width: 2),
                    Text(
                      trend,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: isTrendUp ? const Color(0xFF10B981) : Colors.red,
                      ),
                    ),
                  ],
                ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8)),
          ),
        ],
      ),
    );
  }

  Widget _buildVisualizationsRow() {
    return Row(
      children: [
        Expanded(child: _buildUsageByCategoryChart()),
        const SizedBox(width: 24),
        Expanded(child: _buildStockLevelsChart()),
      ],
    );
  }

  Widget _buildUsageByCategoryChart() {
    // Group quantities by category and sum them
    final Map<String, int> categoryCounts = {};
    for (var item in items) {
      categoryCounts[item.category] =
          (categoryCounts[item.category] ?? 0) + item.quantity;
    }

    // Convert to list, sort by quantity descending, keep top 5
    var sortedCategories = categoryCounts.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));

    var top5 = sortedCategories.take(5).toList();

    // Get max value for filling algorithm
    final int maxCount = top5.isEmpty
        ? 1
        : top5.fold(0, (max, e) => e.value > max ? e.value : max);

    return Container(
      height: 340,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Stock by Category",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  Text(
                    "Current quantities per category",
                    style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(6),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.05),
                            blurRadius: 2,
                          ),
                        ],
                      ),
                      child: const Text(
                        "All Time",
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Expanded(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: top5.map((entry) {
                double fillPercent =
                    entry.value / (maxCount == 0 ? 1 : maxCount);
                // Clamp it just in case
                fillPercent = fillPercent.clamp(0.05, 1.0);
                return _buildBar(entry.key.toUpperCase(), fillPercent);
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBar(String label, double fillPercentage) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        Expanded(
          child: Container(
            width: 40,
            alignment: Alignment.bottomCenter,
            child: FractionallySizedBox(
              heightFactor: fillPercentage,
              widthFactor: 1.0,
              child: Container(
                decoration: const BoxDecoration(
                  color: Color(0xFF1E3FAE),
                  borderRadius: BorderRadius.vertical(top: Radius.circular(8)),
                ),
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: const TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.bold,
            letterSpacing: 0.5,
            color: Color(0xFF64748B),
          ),
        ),
      ],
    );
  }

  Widget _buildStockLevelsChart() {
    return Container(
      height: 340,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Stock Levels Over Time",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  Text(
                    "Inventory volume (Units)",
                    style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Row(
                  children: [
                    Text(
                      "Mocked - No historical data API",
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Expanded(
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8),
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    const Color(0xFF1E3FAE).withValues(alpha: 0.1),
                    Colors.white.withValues(alpha: 0.0),
                  ],
                ),
              ),
              child: CustomPaint(painter: LineChartPainter()),
            ),
          ),
          const SizedBox(height: 8),
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "JAN",
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF94A3B8),
                ),
              ),
              Text(
                "FEB",
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF94A3B8),
                ),
              ),
              Text(
                "MAR",
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF94A3B8),
                ),
              ),
              Text(
                "APR",
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF94A3B8),
                ),
              ),
              Text(
                "MAY",
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF94A3B8),
                ),
              ),
              Text(
                "JUN",
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF94A3B8),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildReorderedItemsTable() {
    // Sort items by lowest stock first
    var sortedItems = List<InventoryItem>.from(items)
      ..sort((a, b) => a.quantity.compareTo(b.quantity));

    // Take top 5 lowest stock items
    var top5NeedsRestock = sortedItems.take(5).toList();

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(24.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "Items Needing Restock",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF0F172A),
                  ),
                ),
                TextButton(
                  onPressed: () {},
                  child: const Text(
                    "View All Items",
                    style: TextStyle(
                      color: Color(0xFF1E3FAE),
                      fontWeight: FontWeight.w600,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1, color: Color(0xFFF1F5F9)),
          DataTable(
            headingRowColor: WidgetStateProperty.all(const Color(0xFFF8FAFC)),
            horizontalMargin: 24,
            columnSpacing: 24,
            dataRowMaxHeight: 72,
            dataRowMinHeight: 72,
            columns: const [
              DataColumn(
                label: Text(
                  "ITEM DETAILS",
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF64748B),
                    letterSpacing: 0.5,
                  ),
                ),
              ),
              DataColumn(
                label: Text(
                  "CATEGORY",
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF64748B),
                    letterSpacing: 0.5,
                  ),
                ),
              ),
              DataColumn(
                label: Text(
                  "STOCK STATUS",
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF64748B),
                    letterSpacing: 0.5,
                  ),
                ),
              ),
            ],
            rows: top5NeedsRestock.map((item) {
              return _buildTableRow(
                item.name,
                "ITM-${item.id.toString().padLeft(3, '0')}",
                Icons.inventory_2_outlined,
                item.category,
                Colors.blue,
                item.isLowStock
                    ? "Low Stock (${item.quantity})"
                    : "Optimal (${item.quantity})",
                item.isLowStock ? Colors.red : const Color(0xFF10B981),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  DataRow _buildTableRow(
    String name,
    String sku,
    IconData icon,
    String category,
    Color catColor,
    String status,
    Color statusColor,
  ) {
    return DataRow(
      cells: [
        DataCell(
          Row(
            children: [
              Container(
                height: 32,
                width: 32,
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Icon(icon, color: const Color(0xFF94A3B8), size: 16),
              ),
              const SizedBox(width: 12),
              Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  Text(
                    sku,
                    style: const TextStyle(
                      fontSize: 10,
                      color: Color(0xFF94A3B8),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        DataCell(
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: catColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              category,
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.bold,
                color: catColor,
              ),
            ),
          ),
        ),
        DataCell(
          Align(
            alignment: Alignment.centerLeft,
            child: Text(
              status,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: statusColor,
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class LineChartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF1E3FAE)
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final path = Path();

    // Create points based on the SVG coordinates from HTML
    // M0,120 Q50,110 80,60 T160,80 T240,40 T320,100 T400,20
    final double w = size.width;
    final double h = size.height;

    // Normalize coordinates based on SVG 400x150 viewbox
    double scaleX = w / 400;
    double scaleY = h / 150;

    path.moveTo(0, 120 * scaleY);
    path.quadraticBezierTo(50 * scaleX, 110 * scaleY, 80 * scaleX, 60 * scaleY);
    path.quadraticBezierTo(
      120 * scaleX,
      10 * scaleY,
      160 * scaleX,
      80 * scaleY,
    );
    path.quadraticBezierTo(
      200 * scaleX,
      150 * scaleY,
      240 * scaleX,
      40 * scaleY,
    );
    path.quadraticBezierTo(
      280 * scaleX,
      -70 * scaleY,
      320 * scaleX,
      100 * scaleY,
    );
    path.quadraticBezierTo(
      360 * scaleX,
      270 * scaleY,
      400 * scaleX,
      20 * scaleY,
    );

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
