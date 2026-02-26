package com.nsbm.group03.eventManagementService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nsbm.group03.eventManagementService.entity.Venue;

public interface VenueRepository extends JpaRepository<Venue, Long> {
}