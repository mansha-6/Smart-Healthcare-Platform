$baseUrl = "http://localhost:5000/api"

try {
    # 1. Register New User (to ensure success)
    Write-Host "Registering temp user..."
    $rand = Get-Random -Maximum 10000
    $body = @{
        name = "Temp Verifier $rand"
        email = "tempverifier$rand@example.com"
        password = "password123"
        confirmPassword = "password123"
        role = "patient"
        phone = "1234567890"
        age = 25
        gender = "Male"
    } | ConvertTo-Json

    $loginRes = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $body -ContentType "application/json"
    $token = $loginRes.token
    Write-Host "Registration Successful. Token acquired."

    $headers = @{
        Authorization = "Bearer $token"
    }

    # Debug Ping
    try {
        Write-Host "Pinging /api/patient/ping..."
         $ping = Invoke-RestMethod -Uri "$baseUrl/patient/ping" -Method Get
         Write-Host "Ping response: $ping"
    } catch {
        Write-Host "Ping failed: $_"
    }

    # 2. Get All Patients
    Write-Host "Fetching All Patients..."
    $patients = Invoke-RestMethod -Uri "$baseUrl/patient/all" -Method Get -Headers $headers
    Write-Host "Success! Found $($patients.Count) patients."

    # 3. Get Doctor Mappings
    Write-Host "Fetching Doctor-Patient Mappings..."
    $mappings = Invoke-RestMethod -Uri "$baseUrl/doctor/patient-mappings" -Method Get -Headers $headers
    Write-Host "Success! Found $($mappings.Count) mappings."
    
    if ($mappings.Count -gt 0) {
        Write-Host "First Mapping Doctor: $($mappings[0].doctor.name)"
        Write-Host "Linked Patients: $($mappings[0].patients.Count)"
    }

} catch {
    Write-Host "Error: $_"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    Write-Host "Response Body: $($reader.ReadToEnd())"
}
