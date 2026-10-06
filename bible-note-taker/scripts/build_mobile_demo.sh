#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="/home/ubuntu/bible-note-taker/demo-assets"
SCREEN_DIR="/home/ubuntu/screenshots"
mkdir -p "$OUT_DIR/clips"

frames=(
  "$SCREEN_DIR/webdev-preview-root-1787928168355954884-3471.png|Bible Note Taker"
  "$SCREEN_DIR/webdev-preview-_tabs_-1787928171325983920-4985.png|Home practice"
  "$SCREEN_DIR/webdev-preview-_tabs__library-1787928168465440767-4855.png|Sermon library"
  "$SCREEN_DIR/webdev-preview-_tabs__bible-1787928168391366413-2260.png|Bible search"
  "$SCREEN_DIR/webdev-preview-prayer_lock-1787928168224626310-8833.png|Prayer Lock"
)

rm -f "$OUT_DIR/clips"/*.mp4 "$OUT_DIR/concat.txt"
index=0
for entry in "${frames[@]}"; do
  image="${entry%%|*}"
  label="${entry#*|}"
  if [[ ! -f "$image" ]]; then
    echo "Missing screenshot: $image" >&2
    exit 1
  fi
  clip="$OUT_DIR/clips/clip-${index}.mp4"
  ffmpeg -y -loglevel error -loop 1 -i "$image" -t 6 \
    -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,drawbox=x=32:y=32:w=420:h=64:color=0x1f3b2fff:t=fill,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text='${label}':fontcolor=white:fontsize=26:x=56:y=50,format=yuv420p" \
    -r 30 -c:v libx264 -pix_fmt yuv420p "$clip"
  printf "file '%s'\n" "$clip" >> "$OUT_DIR/concat.txt"
  index=$((index + 1))
done

ffmpeg -y -loglevel error -f concat -safe 0 -i "$OUT_DIR/concat.txt" -c copy \
  -movflags +faststart "$OUT_DIR/bible-note-taker-mobile-demo.mp4"

echo "$OUT_DIR/bible-note-taker-mobile-demo.mp4"
