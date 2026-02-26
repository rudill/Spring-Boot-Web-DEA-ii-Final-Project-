package com.nsbm.group03.eventManagementService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class EventManagementServiceApplication {

	public static void main(String[] args) {
		ConfigurableApplicationContext context = SpringApplication.run(EventManagementServiceApplication.class, args);

		try {
			JdbcTemplate jdbc = context.getBean(JdbcTemplate.class);
			System.out.println("DB Test Query Result: " + jdbc.queryForObject("SELECT 1", Integer.class));
		} catch (Exception e) {
			System.out.println("Database connection failed!");
			e.printStackTrace();
		}
	}
}
