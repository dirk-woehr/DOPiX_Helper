Add-Type -AssemblyName System.Windows.Forms

# Sicherstellen, dass die Konsole UTF-8 kann (optional, aber hilfreich)
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Select-Folder {
    $dialog = New-Object System.Windows.Forms.FolderBrowserDialog
    $dialog.Description = "Bitte Quellordner auswählen"

    if ($dialog.ShowDialog() -eq "OK") {
        return $dialog.SelectedPath
    } else {
        Write-Host "Kein Ordner ausgewählt. Abbruch."
        exit
    }
}

function Select-OutputFile {
    $dialog = New-Object System.Windows.Forms.SaveFileDialog
    $dialog.Title = "Speicherort für JSON-Datei auswählen"
    $dialog.Filter = "JSON-Dateien (*.json)|*.json"
    $dialog.DefaultExt = "json"
    $dialog.AddExtension = $true

    if ($dialog.ShowDialog() -eq "OK") {
        return $dialog.FileName
    } else {
        Write-Host "Kein Speicherort ausgewählt. Abbruch."
        exit
    }
}

function Get-Tree($path) {
    Get-ChildItem -LiteralPath $path | Sort-Object Name | ForEach-Object {
        if ($_.PSIsContainer) {
            [PSCustomObject]@{
                name = $_.Name
                type = "folder"
                children = Get-Tree $_.FullName
            }
        } else {
            $fileObject = [ordered]@{
                name = $_.Name
                type = "file"
            }

            if ($_.Extension -eq ".json") {
                try {
                    # Wichtig: Encoding explizit setzen!
                    $raw = Get-Content -LiteralPath $_.FullName -Raw -Encoding UTF8
                    $jsonContent = $raw | ConvertFrom-Json
                    $fileObject["content"] = $jsonContent
                }
                catch {
                    $fileObject["content_error"] = $_.Exception.Message
                }
            }

            [PSCustomObject]$fileObject
        }
    }
}

# Dialoge anzeigen
$inputPath = Select-Folder
$outputFile = Select-OutputFile

# Tree erzeugen
$tree = Get-Tree $inputPath

# JSON erzeugen
$json = $tree | ConvertTo-Json -Depth 20

# 🔴 UTF-8 OHNE BOM schreiben (wichtig!)
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($outputFile, $json, $utf8NoBom)

# Erfolgsmeldung
[System.Windows.Forms.MessageBox]::Show(
    "Fertig! Datei wurde gespeichert unter:`n$outputFile",
    "Erfolg"
)
