package com.nsbm.group03.reservationManagementService.service;

import com.nsbm.group03.reservationManagementService.dto.GuestDTO;
import com.nsbm.group03.reservationManagementService.entity.Guest;
import com.nsbm.group03.reservationManagementService.repository.GuestRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class GuestService {

    @Autowired
    private GuestRepository guestRepository;

    @Autowired
    private ModelMapper modelMapper ;

    public GuestDTO saveGuest(GuestDTO guestDTO){

        guestRepository.save(modelMapper.map(guestDTO, Guest.class));
        return guestDTO;

    }

    public List<GuestDTO> findAllGuests(){
        List<Guest> guestList = guestRepository.findAll();
        return modelMapper.map(guestList,new TypeToken<List<GuestDTO>>(){}.getType());
    }

    public GuestDTO updateGuest(GuestDTO guestDTO){
        if(!guestRepository.existsById(guestDTO.getGuestId())){
            throw new RuntimeException("Guest not found");
        }
        guestRepository.save(modelMapper.map(guestDTO,Guest.class));
        return guestDTO;
    }

    public GuestDTO findGuestByPhoneNumber(String phoneNumber){
       Guest guest= guestRepository.findByPhoneNumber(phoneNumber);
        return modelMapper.map(guest,GuestDTO.class);
    }

    public boolean deleteGuest(GuestDTO guestDTO){
        guestRepository.delete(modelMapper.map(guestDTO,Guest.class));
        return true;
    }

}
