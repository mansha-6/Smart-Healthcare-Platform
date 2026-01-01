$baseUrl = "http://localhost:5003/api"
$testEmail = "reviewtester@example.com"
$testPass = "password123"

try {
    # 1. Register/Login Test User
    Write-Host "Registering/Logging in test user..."
    $rand = Get-Random -Maximum 10000
    $body = @{
        name = "Review Tester"
        email = $testEmail
        password = $testPass
        confirmPassword = $testPass
        role = "patient"
    } | ConvertTo-Json

    # Try register first
    try {
        $loginRes = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
        $token = $loginRes.token
    } catch {
         # Login if exists
         $loginBody = @{ email = $testEmail; password = $testPass } | ConvertTo-Json
         $loginRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
         $token = $loginRes.token
    }
    
    $headers = @{ Authorization = "Bearer $token" }
    Write-Host "Token Acquired."

    # 2. Setup: Create an appointment (so we have a doctorId to review)
    # We need a doctor ID first.
    # Just use a random string ID to test our new loose schema!
    $mockDoctorId = "doctor_123_mock_id"
    
    # 3. Post Review directly (mimicking what frontend does with string ID)
    Write-Host "Submitting Review for Mock Doctor ID: $mockDoctorId ..."
    $reviewBody = @{
        doctorId = $mockDoctorId
        rating = 5
        comment = "This is a test review with string ID"
    } | ConvertTo-Json

    $res = Invoke-RestMethod -Uri "$baseUrl/reviews" -Method Post -Body $reviewBody -Headers $headers -ContentType "application/json"
    Write-Host "Success! Review Created ID: $($res._id)"
    
    # 4. Fetch Reviews
    Write-Host "Fetching My Reviews..."
    $myReviews = Invoke-RestMethod -Uri "$baseUrl/reviews/my-reviews" -Method Get -Headers $headers
    Write-Host "Found $($myReviews.Count) reviews."
    
} catch {
    Write-Host "Error: $_"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response Body: $($reader.ReadToEnd())"
    }
}
