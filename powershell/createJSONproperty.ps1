# Type für File-Dialog bereitstellen
Add-Type -AssemblyName System.Windows.Forms

# Filedialog für Pfadauswahl
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

# Pfad zum Ordner mit den JSON-Dateien
$ordnerPfad = Select-Folder

# HIER ANPASSEN: Name und Wert der neuen Eigenschaft
$neueProperty = "editable"
$neuerWert     = $true

# Alle JSON-Dateien im Ordner suchen
$dateien = Get-ChildItem -Path $ordnerPfad -Filter *.json

foreach ($datei in $dateien) {
    # 1. JSON-Datei einlesen und in ein PowerShell-Objekt umwandeln
    $jsonObjekt = Get-Content -Path $datei.FullName -Raw | ConvertFrom-Json
    
    # 2. Die neue Property hinzufügen (falls sie nicht schon existiert)
    if (-not ($jsonObjekt.PSObject.Properties[$neueProperty])) {
        $jsonObjekt | Add-Member -NotePropertyName $neueProperty -NotePropertyValue $neuerWert
        
        # 3. Objekt zurück in JSON umwandeln und Datei überschreiben
        # -Depth 10 sorgt dafür, dass tief verschachtelte JSONs nicht beschädigt werden
        $jsonObjekt | ConvertTo-Json -Depth 10 | Set-Content -Path $datei.FullName
        
        Write-Host "Aktualisiert: $($datei.Name)" -ForegroundColor Green
    } else {
      if (-not $jsonObjekt.$neueProperty) {
        Write-Host "Überschrieben (false bereits vorhanden): $($datei.Name)" -ForegroundColor Green
        $jsonObjekt.$neueProperty = $neuerWert
        $jsonObjekt | ConvertTo-Json -Depth 10 | Set-Content -Path $datei.FullName
      } else {
        Write-Host "Übersprungen (true bereits vorhanden): $($datei.Name)" -ForegroundColor Yellow
      }
    }
}
Write-Host "Fertig!" -ForegroundColor Cyan
