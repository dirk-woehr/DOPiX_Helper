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

$tree = Get-Tree "C:\Users\Dwoehr\Documents\SDK\spezifikationen\xml_test\sdk-REGEX_TEMPLATE-1775036522851871970"

$tree | ConvertTo-Json -Depth 20 | Out-File "tree_with_content.json" -Encoding UTF8

# Filter File Names
# if ($_.Extension -eq ".json" -and $_.Name -like "*relevant*")

# only selected properties
<# $fileObject["content"] = @{
    id = $jsonContent.id
    name = $jsonContent.name
} #>