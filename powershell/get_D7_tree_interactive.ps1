Add-Type -AssemblyName System.Windows.Forms

function Select-Folder {
    $dialog = New-Object System.Windows.Forms.FolderBrowserDialog
    $dialog.Description = "Bitte wähle den Quellordner aus"

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
    Get-ChildItem $path | ForEach-Object {
        if ($_.PSIsContainer) {
            @{
                name = $_.Name
                type = "folder"
                children = Get-Tree $_.FullName
            }
        } else {
            $fileObject = @{
                name = $_.Name
                type = "file"
            }

            # Nur JSON-Dateien einlesen und parsen
            if ($_.Extension -eq ".json") {
                try {
                    $jsonContent = Get-Content $_.FullName -Raw | ConvertFrom-Json
                    $fileObject["content"] = $jsonContent
                }
                catch {
                    $fileObject["content_error"] = "Invalid JSON"
                }
            }

            $fileObject
        }
    }
}

# Dialoge anzeigen
$inputPath = Select-Folder
$outputFile = Select-OutputFile

# Tree erzeugen
$tree = Get-Tree $inputPath

# Ausgabe speichern
$tree | ConvertTo-Json -Depth 20 | Out-File $outputFile -Encoding UTF8

[System.Windows.Forms.MessageBox]::Show("Fertig! Datei wurde gespeichert unter:`n$outputFile", "Erfolg")
