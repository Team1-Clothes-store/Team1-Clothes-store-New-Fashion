# ===================================================
# New Fashion - Local Web Server Launcher
# Runs a lightweight local HTTP server using PowerShell
# ===================================================

$port = 8080
$url = "http://localhost:$port/"
$basePath = $PSScriptRoot

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host " NEW FASHION - LOCAL E-COMMERCE SERVER" -ForegroundColor Magenta
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "Hosting folder: $basePath" -ForegroundColor Gray
Write-Host "Opening in browser: $url" -ForegroundColor Green
Write-Host "Press Ctrl + C in this terminal to stop server." -ForegroundColor Yellow
Write-Host "==============================================" -ForegroundColor Cyan

Start-Process $url

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
$listener.Start()

$mimeMap = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".sql"  = "text/plain; charset=utf-8"
    ".md"   = "text/plain; charset=utf-8"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $localPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($localPath)) {
            $localPath = "index.html"
        }

        $filePath = Join-Path $basePath $localPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = if ($mimeMap.ContainsKey($ext)) { $mimeMap[$ext] } else { "application/octet-stream" }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}

