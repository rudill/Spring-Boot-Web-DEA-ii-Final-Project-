import 'package:dio/dio.dart';
import '../models/inventory_item.dart';

class InventoryService {
  final Dio _dio = Dio();

  static const String _baseUrl =
      'https://inventorymanagementservice-inventory.onrender.com';
  static const String _inventoryEndpoint = '/api/inventory';

  Future<List<InventoryItem>> fetchInventory() async {
    try {
      final response = await _dio.get('$_baseUrl$_inventoryEndpoint');

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        return data.map((e) => InventoryItem.fromJson(e)).toList();
      } else {
        throw Exception('Failed to load inventory: ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.response != null) {
        throw Exception(
          'Failed to load inventory: ${e.response?.statusCode} - ${e.response?.statusMessage}',
        );
      } else {
        throw Exception('Failed to load inventory: ${e.message}');
      }
    } catch (e) {
      throw Exception('Failed to load inventory: $e');
    }
  }

  Future<InventoryItem> fetchItemById(int id) async {
    try {
      final response = await _dio.get('$_baseUrl$_inventoryEndpoint/$id');
      if (response.statusCode == 200) {
        return InventoryItem.fromJson(response.data);
      } else {
        throw Exception('Failed to load item: ${response.statusCode}');
      }
    } on DioException catch (e) {
      throw Exception('Failed to load item: ${e.message}');
    }
  }

  Future<InventoryItem> addItem(Map<String, dynamic> itemData) async {
    try {
      final response = await _dio.post(
        '$_baseUrl$_inventoryEndpoint',
        data: itemData,
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        return InventoryItem.fromJson(response.data);
      } else {
        throw Exception('Failed to add item: ${response.statusCode}');
      }
    } on DioException catch (e) {
      throw Exception('Failed to add item: ${e.message}');
    }
  }

  Future<InventoryItem> updateItem(
    int id,
    Map<String, dynamic> itemData,
  ) async {
    try {
      final response = await _dio.put(
        '$_baseUrl$_inventoryEndpoint/$id',
        data: itemData,
      );
      if (response.statusCode == 200) {
        return InventoryItem.fromJson(response.data);
      } else {
        throw Exception('Failed to update item: ${response.statusCode}');
      }
    } on DioException catch (e) {
      throw Exception('Failed to update item: ${e.message}');
    }
  }

  Future<void> deleteItem(int id) async {
    try {
      final response = await _dio.delete('$_baseUrl$_inventoryEndpoint/$id');
      if (response.statusCode != 200 && response.statusCode != 204) {
        throw Exception('Failed to delete item: ${response.statusCode}');
      }
    } on DioException catch (e) {
      throw Exception('Failed to delete item: ${e.message}');
    }
  }

  Future<InventoryItem> restockItem(int id, int amount) async {
    try {
      final response = await _dio.put(
        '$_baseUrl$_inventoryEndpoint/$id/restock',
        queryParameters: {'amount': amount},
      );
      if (response.statusCode == 200) {
        return InventoryItem.fromJson(response.data);
      } else {
        throw Exception('Failed to restock item: ${response.statusCode}');
      }
    } on DioException catch (e) {
      throw Exception('Failed to restock item: ${e.message}');
    }
  }

  Future<List<InventoryItem>> fetchLowStockItems() async {
    try {
      final response = await _dio.get('$_baseUrl$_inventoryEndpoint/low-stock');
      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        return data.map((e) => InventoryItem.fromJson(e)).toList();
      } else {
        throw Exception(
          'Failed to load low stock items: ${response.statusCode}',
        );
      }
    } on DioException catch (e) {
      throw Exception('Failed to load low stock items: ${e.message}');
    }
  }

  Future<List<InventoryItem>> searchItems(String keyword) async {
    try {
      final response = await _dio.get(
        '$_baseUrl$_inventoryEndpoint/search',
        queryParameters: {'keyword': keyword},
      );
      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        return data.map((e) => InventoryItem.fromJson(e)).toList();
      } else {
        throw Exception('Failed to search items: ${response.statusCode}');
      }
    } on DioException catch (e) {
      throw Exception('Failed to search items: ${e.message}');
    }
  }
}
