package com.nsbm.group03.reservationManagementService.controller;

import com.nsbm.group03.reservationManagementService.dto.GuestDTO;
import com.nsbm.group03.reservationManagementService.service.GuestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping (value = "api/v1/guest")

public class GuestController {

    @Autowired
    private GuestService guestService;

    //create guest
    @PostMapping("/saveguest")
    public GuestDTO saveGuest(@RequestBody GuestDTO guestDTO) {
        return guestService.saveGuest(guestDTO);
    }

    //view guest
    @GetMapping("/getguests")
    public List<GuestDTO> getGuests() {
        return guestService.findAllGuests();
    }

    //updateguest
    @PutMapping(value = "/updateguest")
    public GuestDTO updateGuest(@RequestBody GuestDTO guestDTO) {
        return guestService.updateGuest(guestDTO);
    }

    //get user by phone number
    @GetMapping(value ="/findGuestByPhoneNumber/{phoneNumber}" )
    public GuestDTO findGuestByPhoneNumber(@PathVariable String phoneNumber){
        return guestService.findGuestByPhoneNumber(phoneNumber);
    }

    @DeleteMapping("/deleteguest")
    public boolean deleteGuest(@RequestBody GuestDTO guestDTO) {
        guestService.deleteGuest(guestDTO);
        return true;
    }





}
