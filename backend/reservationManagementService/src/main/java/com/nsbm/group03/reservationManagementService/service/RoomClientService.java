package com.nsbm.group03.reservationManagementService.service;

import com.nsbm.group03.reservationManagementService.dto.RoomDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomClientService {


    @Autowired
    private RestTemplate restTemplate;

    private final String ROOM_SERVICE_URL = "http://localhost:8082/api/rooms";

    public List<RoomDTO> getAvailableRooms() {

        RoomDTO[] rooms = restTemplate.getForObject(
                ROOM_SERVICE_URL,
                RoomDTO[].class
        );

        return Arrays.stream(rooms)
                .filter(room -> room.getStatus().equals("AVAILABLE"))
                .collect(Collectors.toList());
    }
}
