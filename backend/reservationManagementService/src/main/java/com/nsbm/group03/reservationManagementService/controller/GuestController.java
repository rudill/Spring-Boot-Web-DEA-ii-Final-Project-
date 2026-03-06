package com.nsbm.group03.reservationManagementService.controller;

import com.nsbm.group03.reservationManagementService.dto.GuestDTO;
import com.nsbm.group03.reservationManagementService.service.GuestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "api/v1/guest")
@CrossOrigin(origins = "*")

public class GuestController {

    @Autowired
    private GuestService guestService;

    // create guest
    @PostMapping("/saveguest")
    public GuestDTO saveGuest(@RequestBody GuestDTO guestDTO) {
        return guestService.saveGuest(guestDTO);
    }

    // view guest
    @GetMapping("/getguests")
    public List<GuestDTO> getGuests() {
        return guestService.findAllGuests();
    }

    // updateguest
    @PutMapping(value = "/updateguest")
    public GuestDTO updateGuest(@RequestBody GuestDTO guestDTO) {
        return guestService.updateGuest(guestDTO);
    }

    @GetMapping("/{id}")
    public GuestDTO getGuestById(@PathVariable Long id) {
        return guestService.findGuestById(id);
    }

    @GetMapping("/findGuestByNic/{nic}")
    public GuestDTO findGuestByNic(@PathVariable String nic) {
        return guestService.findGuestByNic(nic);
    }

    @DeleteMapping("/deleteguest")
    public boolean deleteGuest(@RequestBody GuestDTO guestDTO) {
        guestService.deleteGuest(guestDTO);
        return true;
    }

}
