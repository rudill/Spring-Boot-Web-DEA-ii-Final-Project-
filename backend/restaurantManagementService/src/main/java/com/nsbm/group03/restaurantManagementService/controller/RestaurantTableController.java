package com.nsbm.group03.restaurantManagementService.controller;

import com.nsbm.group03.restaurantManagementService.dto.RestaurantTableDTO;
import com.nsbm.group03.restaurantManagementService.response.ApiResponse;
import com.nsbm.group03.restaurantManagementService.service.RestaurantTableService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurant/tables")
@CrossOrigin
public class RestaurantTableController {

    private final RestaurantTableService tableService;

    public RestaurantTableController(RestaurantTableService tableService) {
        this.tableService = tableService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RestaurantTableDTO>> addTable(@RequestBody RestaurantTableDTO dto) {
        RestaurantTableDTO created = tableService.addTable(dto);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Table added successfully", created),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RestaurantTableDTO>>> getAllTables() {
        List<RestaurantTableDTO> tables = tableService.getAllTables();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "All tables retrieved", tables));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RestaurantTableDTO>> getTableById(@PathVariable Long id) {
        RestaurantTableDTO table = tableService.getTableById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Table retrieved", table));
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<RestaurantTableDTO>>> getAvailableTables() {
        List<RestaurantTableDTO> tables = tableService.getAvailableTables();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Available tables retrieved", tables));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<RestaurantTableDTO>>> getTablesByStatus(
            @PathVariable String status) {
        List<RestaurantTableDTO> tables = tableService.getTablesByStatus(status);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Tables retrieved for status: " + status, tables));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RestaurantTableDTO>> updateTable(
            @PathVariable Long id, @RequestBody RestaurantTableDTO dto) {
        RestaurantTableDTO updated = tableService.updateTable(id, dto);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Table updated successfully", updated));
    }

    @PutMapping("/{id}/occupy")
    public ResponseEntity<ApiResponse<RestaurantTableDTO>> occupyTable(@PathVariable Long id) {
        RestaurantTableDTO updated = tableService.occupyTable(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Table is now occupied", updated));
    }

    @PutMapping("/{id}/free")
    public ResponseEntity<ApiResponse<RestaurantTableDTO>> freeTable(@PathVariable Long id) {
        RestaurantTableDTO updated = tableService.freeTable(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Table is now available", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTable(@PathVariable Long id) {
        tableService.deleteTable(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Table deleted successfully", null));
    }
}
