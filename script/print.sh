#!/bin/bash
#
# Copyright (C) 2018-2026 Modding Craft ZBD Studio.
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License along
# with this program; if not, write to the Free Software Foundation, Inc.,
# 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
#

# Parameter order: Location TeamName [teamid] FilePath
LOCATION="$1"
TEAMNAME="$2"
EXAMNUM="$3"
FILE="$4"
ORIGNAME="$5"

# ================= Configuration =================
PRINT_API="{yourToolHost}/cxtool/admin/print/task"
API_TOKEN="{yourPrintToken}"
PDF_DIR="/tmp/print"
MAX_PRINT_PAGES=10
DENIED_LOCATION="Online"
# ==================================================

# Clean up input parameters (remove quotes and extra spaces)
LOCATION=$(echo "$LOCATION" | tr -d "'\"" | xargs)
TEAMNAME=$(echo "$TEAMNAME" | tr -d "'\"" | xargs)
EXAMNUM=$(echo "$EXAMNUM" | tr -d "'\"" | xargs)
FILE=$(echo "$FILE" | tr -d "'\"" | xargs)
# Get original file name for type validation
ORIGNAME=$(basename "$FILE")

# Print basic info
echo "====================="
echo "Team Location: [${LOCATION}]"
echo "Team Name: [${TEAMNAME}]"
echo "Source File: [${FILE}]"
echo "Original File Name: [${ORIGNAME}]"
echo "====================="

# --------------------------
# Validation 1: Required fields
# --------------------------
if [ -z "$TEAMNAME" ] || [ -z "$LOCATION" ]; then
    echo "Error: Team information (location and name) cannot be empty."
    exit 1
fi

# --------------------------
# Validation 2: Denied location (Online)
# --------------------------
if [[ "$LOCATION" == "$DENIED_LOCATION" ]]; then
    echo "Error: Printing is denied for location 'Online'."
    exit 1
fi

# --------------------------
# Validation 3: Allowed file types only
# --------------------------
if [[ ! ($ORIGNAME == *.c || $ORIGNAME == *.cpp || $ORIGNAME == *.py || $ORIGNAME == *.txt || $ORIGNAME == *.java) ]]; then
    echo "Error: Only .c, .cpp, .py, .txt, .java files are allowed."
    exit 1
fi

# --------------------------
# Check required system tools
# --------------------------
command -v enscript >/dev/null 2>&1 || { echo "Error: enscript is required but not installed."; exit 1; }
command -v ps2pdf >/dev/null 2>&1 || { echo "Error: ps2pdf is required but not installed."; exit 1; }
command -v pdfinfo >/dev/null 2>&1 || { echo "Error: pdfinfo (poppler-utils) is required but not installed."; exit 1; }
command -v curl >/dev/null 2>&1 || { echo "Error: curl is required but not installed."; exit 1; }

# Create temporary directory
mkdir -p "$PDF_DIR"
PDF_FILE="${PDF_DIR}/${TEAMNAME}_$(date +%Y%m%d%H%M%S).pdf"

# Generate PDF from text file
enscript -b "ExamNumber: ${EXAMNUM},Delivery location: ${LOCATION},Print Time: $(date +%Y%m%d%H%M%S)" -f Courier10 -A4 "$FILE" -p - | ps2pdf - "$PDF_FILE"

# --------------------------
# Validation 4: PDF generation check
# --------------------------
if [ ! -f "$PDF_FILE" ]; then
    echo "Error: Failed to generate PDF file."
    exit 1
fi

# --------------------------
# Validation 5: Page count limit (max 10 pages)
# --------------------------
PAGE_COUNT=$(pdfinfo "$PDF_FILE" | grep Pages | awk '{print $2}')
if ! [[ "$PAGE_COUNT" =~ ^[0-9]+$ ]]; then
    echo "Error: Failed to read PDF page count."
    rm -f "$PDF_FILE"
    exit 1
fi
if [[ "$PAGE_COUNT" -gt "$MAX_PRINT_PAGES" ]]; then
    echo "Error: Page count exceeds limit. Max allowed: $MAX_PRINT_PAGES, Current: $PAGE_COUNT."
    rm -f "$PDF_FILE"
    exit 1
fi

# --------------------------
# Send print request to API
# --------------------------
curl -X POST "$PRINT_API" \
-H "token: $API_TOKEN" \
-F "file=@${PDF_FILE}" \
-F "printTeamDTO={\"examNum\":\"${EXAMNUM}\"};type=application/json"

echo -e "\nPrint task submitted successfully"

# Clean up temporary PDF file
rm -f "$PDF_FILE"
echo "Temporary PDF file cleaned up: ${PDF_FILE}"