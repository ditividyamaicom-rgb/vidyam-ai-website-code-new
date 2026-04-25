# PowerShell script to keep npm start running
while ($true) {
    Write-Host "Starting development server..." -ForegroundColor Green
    npm start
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Server stopped. Restarting in 3 seconds..." -ForegroundColor Yellow
        Start-Sleep -Seconds 3
    }
}

