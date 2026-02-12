# DOPiX-Admin

Enthält alle Objekte

- Fonts
- Grafiken
- Textbausteine
- etc.

# Namenskonvention

Alphanumerisch, groß, getrennt durch _

# Aufbau

TTR => TTD => RUF => DVL => [LAY, TXK, ASL, END]

# CAL-Objekt

Pro Brief definieren, wird in der Regel kopiert und angepasst

Freigabename:
Enthält Ticketnummer für Fehlersuche bei fehlenden Bausteinen,
muss auch für jeden Bausten angelegt werden (vom Admin)


# Vorauswahl

Kann: Optional, nicht vorausgewählt
Soll: Optional, aber vorausgewählt
Muss: Keine abwahloption

Alternativgruppe / Maximalgruppe
Maximalgruppe: Höchstens 1 auswählen (0 möglich)
Alternativgruppe: 1 muss ausgewählt sein

Minimalgruppe: Mindestens 1, auch 0

Regelauswertung lesen

# Befehle

updateVars() für Aktualisierung von bestehenden Variablen, wenn diese zur laufzeit geändert werden. Verhalten sich sonst wie Konstanten.

# Allgemein

Verschiedene Mapping-Bausteine für unterschiedliche positionen im Brief

Bei dunkelbriefen kein Muss verwenden

Bezeichner nur Großbuchstaben & Zahlen, keine spaces

Querverweise = Parents anzeigen

Seitenzahl unterdrücken: z.B. bei mehrteiligen Briefen, da keine durchgängige Nummerierung möglich

# Spezifikationen

Nummern werden bei Spezifikation gesetzt

# XML

XML-Daten werden als externe Variablen bezeichnet (TFO)
Werden nicht geändert, wenn Änderungen nötig, zwischenvariable verwenden (z.B. vollständigen Namen zusammenbauen)

# Variablentypen

Alphanumerisch (maximal 349, default 60)
Datum
Maske
Boolean
Aufzählung

# Variablen

Variablen in Textbaustein müssen in Parametern angelegt werden
Externe immer unsichtbar anlegen
Interne per default auch

TFO (Angelieferte XML Daten)
Bezug in Logik herstellen und in Variable zuweisen

# DOPiX-Einstellungen
* Administration -> Extgras -> DOPiX-Admin-Einstellungen

