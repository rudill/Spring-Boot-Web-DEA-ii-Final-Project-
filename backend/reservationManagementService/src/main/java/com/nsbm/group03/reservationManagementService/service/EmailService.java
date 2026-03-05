package com.nsbm.group03.reservationManagementService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("ආලකමන්දා Manager <noreply@luxestay.com>");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            System.out.println("Email sent successfully to " + to);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + to + ": " + e.getMessage());
        }
    }

    public void sendReservationConfirmationEmail(String recipientEmail, String guestName, String reservationId,
            String checkIn, String checkOut, String roomNumber, String amount) {
        String subject = "Reservation Confirmed - ආලකමන්දා Hotel ";
        String body = "Dear " + guestName + ",\n\n" +
                "Your reservation at ආලකමන්දා has been confirmed!\n\n" +
                "Reservation Details:\n" +
                "- Reservation ID: #RES-" + reservationId + "\n" +
                "- Room Number: " + roomNumber + "\n" +
                "- Check-in Date: " + checkIn + "\n" +
                "- Check-out Date: " + checkOut + "\n" +
                "- Total Amount: Rs " + amount + "\n\n" +
                "We look forward to welcoming you!\n\n" +
                "Best regards,\n" +
                "The ආලකමන්දා Team";

        sendEmail(recipientEmail, subject, body);
    }
}
