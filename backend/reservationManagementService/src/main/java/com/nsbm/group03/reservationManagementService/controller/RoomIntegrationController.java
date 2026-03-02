package com.nsbm.group03.reservationManagementService.controller;

import com.nsbm.group03.reservationManagementService.dto.RoomDTO;
import com.nsbm.group03.reservationManagementService.service.RoomClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservations")
public class RoomIntegrationController {

    @Autowired
    private RoomClientService roomClientService;

    @GetMapping("/available-rooms")
    public List<RoomDTO> getAvailableRooms() {
        return roomClientService.getAvailableRooms();
    }
}