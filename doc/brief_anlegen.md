# Brief anlegen

## Prozess anlegen

* Neuer Prozess => Änderung => [Prozess Anlegen]
* Prozessname eingeben & kopieren => [Weiter]
* Name bekannt aus Projekt (keine Regel, muss man wissen)
* aktuell "KVN_" bei SDK
* Kopierten Namen in Betreff & Beschreibung einsetzen => [Weiter]
* Weitere Felder ebenfalls mit Projektnamen befüllen
* Zu DOPiX-Admin wechseln (auf Tab klicken) maximieren mit Alt-F10
* Typ/Arbeitskorb (Gruppen) auswählen
* Wenn ausgewählt, erscheint oben "Administration", dort Bearbeiten -> "Zu DOPiX-Admin wechseln" auswählen

* Bezeichner aus Name auslesen (oder unter "Auftraggeber" in Spezifikation) z.B: K_AV_ZZ_RUF_1007_WILLENSERKLAERUNG
* Link zu Confluence in Jira-Ticket oder wissen

## Objekte kopieren

* Vorlage Kopieren (bei SDK aktuell 1000er mit Anschreiben) suche nach: *1000*
* alle 5 Basis-Objekte (TTR etc.) kopieren
* Beschreibungen an Objekten ändern (einzeln)
* Freigabename ändern (Alle markieren und über Drop-Down auf einmal möglich)
* Verweise aktualisieren (
    TTR -> TTD, (DOPREQUEST)
    TTD- > RUF, (in XML)
    RUF -> DVL, (DOPDOCID)
    DVL -> TXK (Vorlagenelement ersetzen/überschreiben)
  )
* Vor ausführen Liste in DVL aktualisieren (Kontextmenü "aktualisieren")

## Betreffzeile(n) anpassen
* Betreffzeile 2 (Z_ZZ_ZZ_EXT_Z9001_IND_BETREFF_2) ist eine Variable im RUF-Objekt  und kann dort im Standardwert überschrieben werden
* Zusätzlich kann sie auch in der Logik der DVL überschrieben werden, wenn dort andere Werte aus Variablen rein sollen, müssen diese manuell zugewiesen werden, da das Default-Mapping erst danach stattfindet. 
* Betreffzeile 1 ist fix, aber die Variable Z_ZZ_ZZ_EXT_Z0002_VERTRNR kann überschrieben werden (auch in DVL)

## Generell
* Brief ausführen über "abbrechen" beenden, über (X) wird DOPiX beendet

## Debugging aktivieren in TTD

Z_ZZ_ZZ_EXT_D0001_DEBUGGING auf 1 setzen

