Write-Host "==========================="
Write-Host "   Test SOAP (Windows)"
Write-Host "==========================="

$COURSE_URL = "http://localhost:8082/api/ws/course"

# 1) SOAP SANS JWT
Write-Host "[1] Test sans JWT"

$SOAP_NO_JWT = @"
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://soap.course_service.nexis.com/">
    <soapenv:Header/>
    <soapenv:Body>
        <soap:addCourse>
            <code>TEST001</code>
            <title>TestSansJWT</title>
            <description>Fail</description>
            <instructor>Test</instructor>
            <credits>1</credits>
            <room>A001</room>
            <dayOfWeek>Monday</dayOfWeek>
            <startTime>09:00</startTime>
            <endTime>11:00</endTime>
            <semester>S1</semester>
            <maxStudents>10</maxStudents>
        </soap:addCourse>
    </soapenv:Body>
</soapenv:Envelope>
"@

$NO_JWT_RESPONSE = Invoke-WebRequest `
    -Uri $COURSE_URL `
    -Method POST `
    -ContentType "application/soap+xml" `
    -Body $SOAP_NO_JWT `
    -ErrorAction SilentlyContinue

Write-Host "Réponse sans JWT:"
Write-Host $NO_JWT_RESPONSE.Content


# 2) SOAP AVEC JWT
Write-Host "[2] Test avec JWT"

$TOKEN = "MON_TOKEN_ICI"

$SOAP_WITH_JWT = @"
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://soap.course_service.nexis.com/">
    <soapenv:Header/>
    <soapenv:Body>
        <soap:addCourse>
            <code>INF101</code>
            <title>Intro Java</title>
            <description>Securise JWT</description>
            <instructor>Admin</instructor>
            <credits>3</credits>
            <room>A101</room>
            <dayOfWeek>Monday</dayOfWeek>
            <startTime>09:00</startTime>
            <endTime>11:00</endTime>
            <semester>S1</semester>
            <maxStudents>30</maxStudents>
        </soap:addCourse>
    </soapenv:Body>
</soapenv:Envelope>
"@

$WITH_JWT_RESPONSE = Invoke-WebRequest `
    -Uri $COURSE_URL `
    -Method POST `
    -ContentType "application/soap+xml" `
    -Headers @{ "Authorization" = "Bearer $TOKEN" } `
    -Body $SOAP_WITH_JWT `
    -ErrorAction SilentlyContinue

Write-Host "Réponse avec JWT:"
Write-Host $WITH_JWT_RESPONSE.Content
