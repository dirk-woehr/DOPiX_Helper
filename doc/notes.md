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

XML-Daten werden als externe Variablen bezeichnet
Werden nicht geändert, wenn Änderungen nötig, zwischenvariable verwenden (z.B. vollständigen Namen zusammenbauen)

# Variablentypen

Alphanumerisch (maximal 349)
Datum
Maske
Boolean
Aufzählung

# Variablen

Variablen in Textbaustein müssen in Parametern angelegt werden
Externe immer unsichtbar anlegen

TFO (Angelieferte XML Daten)
Bezug in Logik herstellen und in Variable zuweisen

# Brief anlegen

* Neuer Prozess => Änderung => [Prozess Anlegen]
* Prozessname eingeben & kopieren => [Weiter]
* Kopierten Namen in Betreff & Beschreibung einsetzen => [Weiter]
* Typ/Arbeitskorb (Gruppen) auswählen
* Wenn ausgewählt, erscheint oben "Administration", dort Bearbeiten -> "DOPiX-Admin öffnen" auswählen
* Bezeichner aus Name auslesen (oder unter "Auftraggeber in Spezifikation)
* Link zu Confluence in Jira
* Name bekannt aus Projekt (keine Regel, muss man wissen)
* aktuell "KVN_" bei SDK
* Weitere Felder ebenfalls mit Projektnamen befüllen
* Zu DOPiX-Admin wechseln (aus Tab klicken) maximieren mit Alt-F10
* Vorlage Kopieren (bei SDK aktuell 1000er mit Anschreiben)
* alle 5 Basis-Objekte (TTR etc.)
* Beschreibungen ändern (einzeln)
* Freigabename ändern (Alle markieren und über Drop-Down auf einmal möglich)
* Verweise aktualisieren (TTR -> TTD, TTD- > RUF, RUF -> DVL, DVL -> TXK)
* Vor ausführen Liste in DVL aktualisieren
* Bausteine per Default: Baustein nicht änderbar, Gruppe änderbar
* Bei neuem Baustein:
  Status auf Projektbezogen
  Projektname (K_AV_ZZ)Funktioniert
* Vorauswahl: Muss wenn ohne Logik, Kann bei Logik
* Baustein kopieren
  Dann in Kopfdaten:
    Name aus Spezifikation
    Beschreibung aus Spezifikation

* Brief ausführen über "abbrechen" beenden, über (X) wird DOPiX beendet

* Am Ende nach Vorschau unten auf Weiter und prüfen, ob es Fehler gibt.

* Variablen in Parameter anlegen
* Logikbaustein anklicken
* In Logiktab
-> Bedingungen Benutzerdefiniert, nicht oben
-> Wert aus Spezi kopieren
