package com.nsbm.group03.reservationManagementService.service;

import com.nsbm.group03.reservationManagementService.dto.ReservationDTO;
import com.nsbm.group03.reservationManagementService.entity.Guest;
import com.nsbm.group03.reservationManagementService.entity.Reservation;
import com.nsbm.group03.reservationManagementService.repository.GuestRepository;
import com.nsbm.group03.reservationManagementService.repository.ReservationRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import org.springframework.web.client.RestTemplate;

@Service
@Transactional
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private GuestRepository guestRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private RestTemplate restTemplate;

    private static final String ROOM_SERVICE_URL = "http://localhost:8082/api/rooms/updateStatus";

    // Save Reservation
    public ReservationDTO saveReservation(ReservationDTO reservationDTO) {

        Guest guest = guestRepository.findById(reservationDTO.getGuestId())
                .orElseThrow(() -> new RuntimeException("Guest not found"));

        Reservation reservation = modelMapper.map(reservationDTO, Reservation.class);
        reservation.setGuest(guest);
        reservation.setCreatedAt(LocalDateTime.now());

        reservationRepository.save(reservation);

        return modelMapper.map(reservation, ReservationDTO.class);
    }

    // Get All Reservations
    public List<ReservationDTO> getAllReservations() {
        List<Reservation> list = reservationRepository.findAll();
        return modelMapper.map(list, new TypeToken<List<ReservationDTO>>() {
        }.getType());
    }

    // Get Reservations By Guest
    public List<ReservationDTO> getReservationsByGuest(Long guestId) {
        List<Reservation> list = reservationRepository.findByGuest_GuestId(guestId);
        return modelMapper.map(list, new TypeToken<List<ReservationDTO>>() {
        }.getType());
    }

    // Update Status
    public ReservationDTO updateStatus(Long id, String status) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        reservation.setStatus(status.toUpperCase());
        reservationRepository.save(reservation);

        // Sync with Room Service
        if (status.equalsIgnoreCase("CHECKED-IN")) {
            syncRoomStatus(reservation.getRoomId(), "OCCUPIED");
        } else if (status.equalsIgnoreCase("CHECKED-OUT")) {
            syncRoomStatus(reservation.getRoomId(), "MAINTENANCE");
        }

        return modelMapper.map(reservation, ReservationDTO.class);
    }

    private void syncRoomStatus(String roomNumber, String roomStatus) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("roomNumber", roomNumber);
            request.put("status", roomStatus);
            restTemplate.patchForObject(ROOM_SERVICE_URL, request, Object.class);
        } catch (Exception e) {
            System.err.println("Failed to sync room status for room " + roomNumber + ": " + e.getMessage());
        }
    }

    // Delete Reservation
    public boolean deleteReservation(Long id) {
        reservationRepository.deleteById(id);
        return true;
    }
}