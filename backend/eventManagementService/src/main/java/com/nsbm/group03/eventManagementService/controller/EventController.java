package com.nsbm.group03.eventManagementService.controller;

import com.nsbm.group03.eventManagementService.entity.Event;
import com.nsbm.group03.eventManagementService.entity.Venue;
import com.nsbm.group03.eventManagementService.service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3000") // CORS for React
public class EventController {

    private final EventService service;

    public EventController(EventService service) {
        this.service = service;
    }

    // -------------------- VENUE CRUD --------------------
    @PostMapping("/venues")
    public Venue addVenue(@RequestBody Venue venue) {
        venue.setCreatedAt(LocalDateTime.now());
        return service.addVenue(venue);
    }

    @GetMapping("/venues")
    public List<Venue> getVenues() {
        return service.getAllVenues();
    }

    @GetMapping("/venues/{id}")
    public ResponseEntity<Venue> getVenueById(@PathVariable Long id) {
        Venue venue = service.findVenueById(id);
        if (venue != null) {
            return ResponseEntity.ok(venue);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/venues/{id}")
    public ResponseEntity<Venue> updateVenue(@PathVariable Long id, @RequestBody Venue details) {
        Venue updated = service.updateVenue(id, details);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/venues/{id}")
    public ResponseEntity<Void> deleteVenue(@PathVariable Long id) {
        boolean deleted = service.deleteVenue(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // -------------------- EVENTS CRUD --------------------
    @PostMapping("/book")
    public Event bookEvent(@RequestBody Event event) {
        event.setCreatedAt(LocalDateTime.now());
        return service.bookEvent(event);
    }

    @GetMapping
    public List<Event> getEvents() {
        return service.getAllEvents();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Event event = service.findById(id);
        if (event != null)
            return ResponseEntity.ok(event);
        else
            return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event details) {
        Event updated = service.updateEvent(id, details);
        if (updated != null)
            return ResponseEntity.ok(updated);
        else
            return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        boolean deleted = service.deleteEvent(id);
        if (deleted)
            return ResponseEntity.noContent().build();
        else
            return ResponseEntity.notFound().build();
    }
}
