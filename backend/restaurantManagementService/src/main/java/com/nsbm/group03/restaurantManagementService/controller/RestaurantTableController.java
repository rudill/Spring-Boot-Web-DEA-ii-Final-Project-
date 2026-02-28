package com.nsbm.group03.restaurantManagementService.controller;

import com.nsbm.group03.restaurantManagementService.dto.RestaurantTableDTO;
import com.nsbm.group03.restaurantManagementService.response.ApiResponse;
import com.nsbm.group03.restaurantManagementService.service.RestaurantTableService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = "*")
@Tag(name = "Restaurant Table Management", description = "APIs for managing restaurant tables")
public class RestaurantTableController {

    private static final Logger logger = LoggerFactory.getLogger(RestaurantTableController.class);

    @Autowired
    private RestaurantTableService tableService;

    @Operation(summary = "Create a new table", description = "Adds a new table to the restaurant")
    @PostMapping
    public ResponseEntity<ApiResponse<RestaurantTableDTO>> createTable(
            @Valid @RequestBody RestaurantTableDTO tableDTO) {
        logger.info("REST request to create table number: {}", tableDTO.getTableNumber());
        RestaurantTableDTO created = tableService.createTable(tableDTO);
        return new ResponseEntity<>(
                ApiResponse.success("Table created successfully", created),
                HttpStatus.CREATED
        );
    }

    @Operation(summary = "Get all tables", description = "Retrieves all restaurant tables")
    @GetMapping
    public ResponseEntity<ApiResponse<List<RestaurantTableDTO>>> getAllTables() {
        logger.info("REST request to get all tables");
        List<RestaurantTableDTO> tables = tableService.getAllTables();
        return ResponseEntity.ok(ApiResponse.success("Tables retrieved successfully", tables));
    }

    @Operation(summary = "Get table by ID", description = "Retrieves a table by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RestaurantTableDTO>> getTableById(@PathVariable Long id) {
        logger.info("REST request to get table by id: {}", id);
        return tableService.getTableById(id)
                .map(table -> ResponseEntity.ok(ApiResponse.success("Table retrieved successfully", table)))
                .orElse(new ResponseEntity<>(ApiResponse.error("Table not found with id: " + id), HttpStatus.NOT_FOUND));
    }

    @Operation(summary = "Get table by table number", description = "Retrieves a table by its table number")
    @GetMapping("/number/{tableNumber}")
    public ResponseEntity<ApiResponse<RestaurantTableDTO>> getTableByNumber(@PathVariable Integer tableNumber) {
        logger.info("REST request to get table by number: {}", tableNumber);
        return tableService.getTableByNumber(tableNumber)
                .map(table -> ResponseEntity.ok(ApiResponse.success("Table retrieved successfully", table)))
                .orElse(new ResponseEntity<>(ApiResponse.error("Table not found with number: " + tableNumber), HttpStatus.NOT_FOUND));
    }

    @Operation(summary = "Get tables by status", description = "Retrieves all tables with a specific status")
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<RestaurantTableDTO>>> getTablesByStatus(@PathVariable String status) {
        logger.info("REST request to get tables with status: {}", status);
        List<RestaurantTableDTO> tables = tableService.getTablesByStatus(status);
        return ResponseEntity.ok(ApiResponse.success("Tables retrieved successfully", tables));
    }

    @Operation(summary = "Get tables by location", description = "Retrieves all tables at a specific location")
    @GetMapping("/location/{location}")
    public ResponseEntity<ApiResponse<List<RestaurantTableDTO>>> getTablesByLocation(@PathVariable String location) {
        logger.info("REST request to get tables at location: {}", location);
        List<RestaurantTableDTO> tables = tableService.getTablesByLocation(location);
        return ResponseEntity.ok(ApiResponse.success("Tables retrieved successfully", tables));
    }

    @Operation(summary = "Get tables by minimum capacity", description = "Retrieves tables that can seat a minimum number of guests")
    @GetMapping("/capacity")
    public ResponseEntity<ApiResponse<List<RestaurantTableDTO>>> getTablesByMinCapacity(
            @RequestParam Integer minCapacity) {
        logger.info("REST request to get tables with min capacity: {}", minCapacity);
        List<RestaurantTableDTO> tables = tableService.getTablesByMinCapacity(minCapacity);
        return ResponseEntity.ok(ApiResponse.success("Tables retrieved successfully", tables));
    }

    @Operation(summary = "Update a table", description = "Updates an existing restaurant table")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RestaurantTableDTO>> updateTable(
            @PathVariable Long id, @Valid @RequestBody RestaurantTableDTO tableDTO) {
        logger.info("REST request to update table with id: {}", id);
        RestaurantTableDTO updated = tableService.updateTable(id, tableDTO);
        return ResponseEntity.ok(ApiResponse.success("Table updated successfully", updated));
    }

    @Operation(summary = "Update table status", description = "Updates the status of a table (AVAILABLE, OCCUPIED, RESERVED, OUT_OF_SERVICE)")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<RestaurantTableDTO>> updateTableStatus(
            @PathVariable Long id, @RequestParam String status) {
        logger.info("REST request to update status for table id: {} to: {}", id, status);
        RestaurantTableDTO updated = tableService.updateTableStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Table status updated successfully", updated));
    }

    @Operation(summary = "Delete a table", description = "Removes a table from the system")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTable(@PathVariable Long id) {
        logger.info("REST request to delete table with id: {}", id);
        tableService.deleteTable(id);
        return ResponseEntity.ok(ApiResponse.success("Table deleted successfully", null));
    }
}
