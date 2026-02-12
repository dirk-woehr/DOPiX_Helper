# DOPiX

* Alle Objekte in Prozess markieren
* TTR und alle TTDs bis auf Standard-TDD abwählen
* Name für Export: JJJJ-MM-DD A Name des Briefs ab nummer
  A steht dabei für den Export am jeweiligen Tag und wird bei jedem Export hoch gezählt (also A, B, C, D...)

* Pfad für Export auf SDK-LW (SDKPool): 
  P:\D7-Staging\1-DEV


# D7

## D7-Login
SDK-Login wählen

## D7-Import

### Datencenter
* DSF-Daei auswählen
* -> Importieren
* aufklappen und Ergebnis prüfen

### Requestcenter
* Unter request wählen nummer eintippen (ohne wildcards) & TTD auswählen

<!-- <textApp mode="UAPI" id="K_ZS_ZZ_RUF_1051_BEEND_DAUERAUFTRAG"> -->
<textApp mode="PTRW" id="ZZZ_ZZZ_Z_PRW_SERVICE" >

* Benötigt wird die UAPI-Zeile, PTRW löschen. Wenn USPI felt, selbst anlegen, RUF-Objekt entsprechend anlegen (steht schon in TTD unter reportId)

* erst Testen mit Play-Button
* Ergebnis sollte grün sein
* -> Anzeigen zeigt PDF an

