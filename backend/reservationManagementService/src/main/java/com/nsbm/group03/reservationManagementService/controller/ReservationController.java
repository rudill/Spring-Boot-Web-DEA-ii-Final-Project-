package com.nsbm.group03.reservationManagementService.controller;

import com.nsbm.group03.reservationManagementService.dto.ReservationDTO;
import com.nsbm.group03.reservationManagementService.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    public ReservationDTO saveReservation(@RequestBody ReservationDTO dto) {
        return reservationService.saveReservation(dto);
    }

    @GetMapping
    public List<ReservationDTO> getAll() {
        return reservationService.getAllReservations();
    }

    @GetMapping("/guest/{guestId}")
    public List<ReservationDTO> getByGuest(@PathVariable Long guestId) {
        return reservationService.getReservationsByGuest(guestId);
    }

    @PatchMapping("/{id}/status")
    public ReservationDTO updateStatus(@PathVariable Long id, @RequestParam String status) {
        return reservationService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public boolean delete(@PathVariable Long id) {
        return reservationService.deleteReservation(id);
    }
}