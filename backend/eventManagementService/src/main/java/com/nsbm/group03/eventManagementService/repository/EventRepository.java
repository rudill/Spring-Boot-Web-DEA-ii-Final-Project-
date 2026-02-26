package com.nsbm.group03.eventManagementService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nsbm.group03.eventManagementService.entity.Event;

import java.time.LocalDate;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByVenueIdAndEventDate(Long venueId, LocalDate eventDate);
}