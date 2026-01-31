package com.nsbm.group03.roomManagementService.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nsbm.group03.roomManagementService.Entity.Room;
import com.nsbm.group03.roomManagementService.Service.RoomService;

@RestController
@RequestMapping(value = "/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;
    
    //views all rooms
    @RequestMapping(value = "/all")
    public  List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }
    //view available rooms
    @RequestMapping(value = "/available")
    public List<Room> getAvailableRooms() {
        return roomService.getAvailableRooms();
    }
    //create a room
    @RequestMapping
    public Room createRoom(@RequestBody Room room) {
        return roomService.insertRoom(room);
    }
    
    
}
