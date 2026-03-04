# Sample Sri Lankan Data for Event Management System

$baseUrl = "http://localhost:8087/api/events"

Write-Host "Adding Sri Lankan Themed Venues..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Venue 1: Kandy Hall
$venue1 = @{
    name         = "Kandy Heritage Hall"
    capacity     = 300
    pricePerHour = 75000.00
} | ConvertTo-Json

try {
    $response1 = Invoke-RestMethod -Uri "$baseUrl/venues" -Method Post -Body $venue1 -ContentType "application/json"
    Write-Host "[OK] Added: Kandy Heritage Hall (300 capacity, Rs. 75,000/hr)" -ForegroundColor Green
}
catch {
    Write-Host "[SKIP] Kandy Heritage Hall already exists" -ForegroundColor Yellow
}

# Venue 2: Galle Fort Room
$venue2 = @{
    name         = "Galle Fort Convention Room"
    capacity     = 150
    pricePerHour = 45000.00
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri "$baseUrl/venues" -Method Post -Body $venue2 -ContentType "application/json"
    Write-Host "[OK] Added: Galle Fort Convention Room (150 capacity, Rs. 45,000/hr)" -ForegroundColor Green
}
catch {
    Write-Host "[SKIP] Galle Fort Convention Room already exists" -ForegroundColor Yellow
}

# Venue 3: Sigiriya Banquet Hall
$venue3 = @{
    name         = "Sigiriya Banquet Hall"
    capacity     = 500
    pricePerHour = 120000.00
} | ConvertTo-Json

try {
    $response3 = Invoke-RestMethod -Uri "$baseUrl/venues" -Method Post -Body $venue3 -ContentType "application/json"
    Write-Host "[OK] Added: Sigiriya Banquet Hall (500 capacity, Rs. 120,000/hr)" -ForegroundColor Green
}
catch {
    Write-Host "[SKIP] Sigiriya Banquet Hall already exists" -ForegroundColor Yellow
}

# Venue 4: Colombo Lakeside Pavilion
$venue4 = @{
    name         = "Colombo Lakeside Pavilion"
    capacity     = 250
    pricePerHour = 85000.00
} | ConvertTo-Json

try {
    $response4 = Invoke-RestMethod -Uri "$baseUrl/venues" -Method Post -Body $venue4 -ContentType "application/json"
    Write-Host "[OK] Added: Colombo Lakeside Pavilion (250 capacity, Rs. 85,000/hr)" -ForegroundColor Green
}
catch {
    Write-Host "[SKIP] Colombo Lakeside Pavilion already exists" -ForegroundColor Yellow
}

# Venue 5: Nuwara Eliya Garden Hall
$venue5 = @{
    name         = "Nuwara Eliya Garden Hall"
    capacity     = 180
    pricePerHour = 55000.00
} | ConvertTo-Json

try {
    $response5 = Invoke-RestMethod -Uri "$baseUrl/venues" -Method Post -Body $venue5 -ContentType "application/json"
    Write-Host "[OK] Added: Nuwara Eliya Garden Hall (180 capacity, Rs. 55,000/hr)" -ForegroundColor Green
}
catch {
    Write-Host "[SKIP] Nuwara Eliya Garden Hall already exists" -ForegroundColor Yellow
}

# Venue 6: Anuradhapura Conference Center
$venue6 = @{
    name         = "Anuradhapura Conference Center"
    capacity     = 400
    pricePerHour = 95000.00
} | ConvertTo-Json

try {
    $response6 = Invoke-RestMethod -Uri "$baseUrl/venues" -Method Post -Body $venue6 -ContentType "application/json"
    Write-Host "[OK] Added: Anuradhapura Conference Center (400 capacity, Rs. 95,000/hr)" -ForegroundColor Green
}
catch {
    Write-Host "[SKIP] Anuradhapura Conference Center already exists" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Adding Sri Lankan Themed Events..." -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Get all venues to use their IDs
Start-Sleep -Seconds 1
$venues = Invoke-RestMethod -Uri "$baseUrl/venues" -Method Get

# Event 1: Traditional Wedding
$event1 = @{
    venueId      = $venues[0].id
    customerName = "Nuwan Perera & Sandali Fernando"
    eventDate    = "2026-04-15"
    attendees    = 250
    status       = "CONFIRMED"
} | ConvertTo-Json

try {
    $eventResponse1 = Invoke-RestMethod -Uri "$baseUrl/book" -Method Post -Body $event1 -ContentType "application/json"
    Write-Host "[OK] Booked: Nuwan & Sandali Wedding (250 guests, Apr 15)" -ForegroundColor Green
}
catch {
    Write-Host "[SKIP] Wedding Event already booked" -ForegroundColor Yellow
}

# Event 2: Corporate Seminar
$event2 = @{
    venueId      = $venues[1].id
    customerName = "Dialog Axiata PLC"
    eventDate    = "2026-03-20"
    attendees    = 120
    status       = "CONFIRMED"
} | ConvertTo-Json

try {
    $eventResponse2 = Invoke-RestMethod -Uri "$baseUrl/book" -Method Post -Body $event2 -ContentType "application/json"
    Write-Host "[OK] Booked: Dialog Axiata Seminar (120 attendees, Mar 20)" -ForegroundColor Green
}
catch {
    Write-Host "[SKIP] Corporate Seminar already booked" -ForegroundColor Yellow
}

# Event 3: Avurudu Celebration
$event3 = @{
    venueId      = $venues[2].id
    customerName = "Sinhala Tamil New Year Committee"
    eventDate    = "2026-04-14"
    attendees    = 450
    status       = "CONFIRMED"
} | ConvertTo-Json

try {
    $eventResponse3 = Invoke-RestMethod -Uri "$baseUrl/book" -Method Post -Body $event3 -ContentType "application/json"
    Write-Host "[OK] Booked: Avurudu Celebration (450 guests, Apr 14)" -ForegroundColor Green
}
catch {
    Write-Host "[SKIP] Avurudu Event already booked" -ForegroundColor Yellow
}

# Event 4: Birthday Party
$event4 = @{
    venueId      = $venues[3].id
    customerName = "Chaminda Silva"
    eventDate    = "2026-03-28"
    attendees    = 80
    status       = "PENDING"
} | ConvertTo-Json

try {
    $eventResponse4 = Invoke-RestMethod -Uri "$baseUrl/book" -Method Post -Body $event4 -ContentType "application/json"
    Write-Host "[OK] Booked: Chaminda Birthday (80 guests, Mar 28)" -ForegroundColor Green
}
catch {
    Write-Host "[SKIP] Birthday Party already booked" -ForegroundColor Yellow
}

# Event 5: Professional Conference
$event5 = @{
    venueId      = $venues[4].id
    customerName = "Sri Lanka Medical Association"
    eventDate    = "2026-05-10"
    attendees    = 175
    status       = "CONFIRMED"
} | ConvertTo-Json

try {
    $eventResponse5 = Invoke-RestMethod -Uri "$baseUrl/book" -Method Post -Body $event5 -ContentType "application/json"
    Write-Host "[OK] Booked: Medical Conference (175 attendees, May 10)" -ForegroundColor Green
}
catch {
    Write-Host "[SKIP] Medical Conference already booked" -ForegroundColor Yellow
}

# Event 6: Cultural Performance
$event6 = @{
    venueId      = $venues[5].id
    customerName = "Chitrasena Dance Company"
    eventDate    = "2026-06-08"
    attendees    = 350
    status       = "CONFIRMED"
} | ConvertTo-Json

try {
    $eventResponse6 = Invoke-RestMethod -Uri "$baseUrl/book" -Method Post -Body $event6 -ContentType "application/json"
    Write-Host "[OK] Booked: Cultural Dance Performance (350 guests, Jun 8)" -ForegroundColor Green
}
catch {
    Write-Host "[SKIP] Cultural Performance already booked" -ForegroundColor Yellow
}

# Event 7: Engagement Ceremony
$event7 = @{
    venueId      = $venues[0].id
    customerName = "Kasun Rajapaksa & Thilini Wickramasinghe"
    eventDate    = "2026-03-25"
    attendees    = 150
    status       = "CONFIRMED"
} | ConvertTo-Json

try {
    $eventResponse7 = Invoke-RestMethod -Uri "$baseUrl/book" -Method Post -Body $event7 -ContentType "application/json"
    Write-Host "[OK] Booked: Engagement Ceremony (150 guests, Mar 25)" -ForegroundColor Green
}
catch {
    Write-Host "[SKIP] Engagement Ceremony already booked" -ForegroundColor Yellow
}

# Event 8: Product Launch
$event8 = @{
    venueId      = $venues[1].id
    customerName = "Ceylon Tea Exporters"
    eventDate    = "2026-04-05"
    attendees    = 100
    status       = "PENDING"
} | ConvertTo-Json

try {
    $eventResponse8 = Invoke-RestMethod -Uri "$baseUrl/book" -Method Post -Body $event8 -ContentType "application/json"
    Write-Host "[OK] Booked: Tea Product Launch (100 attendees, Apr 5)" -ForegroundColor Green
}
catch {
    Write-Host "[SKIP] Product Launch already booked" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Data Import Complete!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan

# Display summary
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
$finalVenues = Invoke-RestMethod -Uri "$baseUrl/venues" -Method Get
$finalEvents = Invoke-RestMethod -Uri "$baseUrl" -Method Get

Write-Host "Total Venues: $($finalVenues.Count)" -ForegroundColor Cyan
Write-Host "Total Events: $($finalEvents.Count)" -ForegroundColor Cyan

Write-Host ""
Write-Host "URLs:" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:5174" -ForegroundColor Magenta
Write-Host "  Backend API: http://localhost:8087/api/events" -ForegroundColor Magenta
Write-Host "  Swagger UI: http://localhost:8087/swagger-ui.html" -ForegroundColor Magenta
