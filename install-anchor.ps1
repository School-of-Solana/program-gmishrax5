# Create directory for Anchor CLI
$installDir = "$env:USERPROFILE\.cargo\bin"
if (-not (Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir -Force | Out-Null
}

# Download Anchor CLI binary
$anchorVersion = "0.29.0"
$downloadUrl = "https://github.com/coral-xyz/anchor/releases/download/v$anchorVersion/anchor-cli-$anchorVersion-x86_64-pc-windows-msvc.tar.gz"
$tarFile = "$env:TEMP\anchor-cli.tar.gz"

Write-Host "Downloading Anchor CLI v$anchorVersion..."
Invoke-WebRequest -Uri $downloadUrl -OutFile $tarFile

# Extract the tar.gz file
Write-Host "Extracting Anchor CLI..."
tar -xzf $tarFile -C $env:TEMP

# Move the anchor.exe to the install directory
Copy-Item -Path "$env:TEMP\anchor.exe" -Destination "$installDir\anchor.exe" -Force

# Clean up
Remove-Item $tarFile -Force

# Add to PATH if not already there
if (-not $env:PATH.Contains($installDir)) {
    $env:PATH = "$env:PATH;$installDir"
    [Environment]::SetEnvironmentVariable("PATH", $env:PATH, "User")
}

Write-Host "Anchor CLI installed successfully!"
Write-Host "Please restart your terminal or run 'refreshenv' to update your PATH"
