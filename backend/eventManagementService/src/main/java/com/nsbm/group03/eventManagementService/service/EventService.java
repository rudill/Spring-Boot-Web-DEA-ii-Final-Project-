package com.nsbm.group03.eventManagementService.service;

import com.nsbm.group03.eventManagementService.entity.Event;
import com.nsbm.group03.eventManagementService.entity.Venue;
import com.nsbm.group03.eventManagementService.repository.EventRepository;
import com.nsbm.group03.eventManagementService.repository.VenueRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final VenueRepository venueRepo;
    private final EventRepository eventRepo;

    public EventService(VenueRepository venueRepo, EventRepository eventRepo) {
        this.venueRepo = venueRepo;
        this.eventRepo = eventRepo;
    }

    // -------------------- VENUE CRUD --------------------
    public Venue addVenue(Venue venue) {
        return venueRepo.save(venue);
    }

    public List<Venue> getAllVenues() {
        return venueRepo.findAll();
    }

    public Venue findVenueById(Long id) {
        return venueRepo.findById(id).orElse(null);
    }

    public Venue updateVenue(Long id, Venue details) {
        return venueRepo.findById(id).map(venue -> {
            venue.setName(details.getName());
            venue.setCapacity(details.getCapacity());
            venue.setPricePerHour(details.getPricePerHour());
            return venueRepo.save(venue);
        }).orElse(null);
    }

    public boolean deleteVenue(Long id) {
        return venueRepo.findById(id).map(venue -> {
            venueRepo.delete(venue);
            return true;
        }).orElse(false);
    }

    // -------------------- EVENT CRUD --------------------
    public Event bookEvent(Event event) {
        Venue venue = venueRepo.findById(event.getVenueId())
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        if (event.getAttendees() > venue.getCapacity()) {
            throw new RuntimeException("Attendees exceed venue capacity");
        }

        if (!eventRepo.findByVenueIdAndEventDate(event.getVenueId(), event.getEventDate()).isEmpty()) {
            throw new RuntimeException("Venue already booked on this date");
        }

        event.setStatus("CONFIRMED");
        return eventRepo.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepo.findAll();
    }

    public Event findById(Long id) {
        return eventRepo.findById(id).orElse(null);
    }

    public Event updateEvent(Long id, Event details) {
        return eventRepo.findById(id).map(event -> {
            event.setCustomerName(details.getCustomerName());
            event.setEventDate(details.getEventDate());
            event.setAttendees(details.getAttendees());
            event.setStatus(details.getStatus());
            return eventRepo.save(event);
        }).orElse(null);
    }

    public boolean deleteEvent(Long id) {
        return eventRepo.findById(id).map(event -> {
            eventRepo.delete(event);
            return true;
        }).orElse(false);
    }
}
