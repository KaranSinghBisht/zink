#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DESTINATION="${1:-$ROOT_DIR/vendor/zcash-devtool}"
COMMIT="c8322f7e71ae46ab24801a721523ba83b27d911b"
PATCH="$ROOT_DIR/patches/zcash-devtool-zink.patch"

if [[ -e "$DESTINATION" ]]; then
  echo "Refusing to overwrite existing path: $DESTINATION" >&2
  exit 1
fi

mkdir -p "$(dirname "$DESTINATION")"
git init "$DESTINATION"
git -C "$DESTINATION" fetch --depth=1 https://github.com/zcash/zcash-devtool.git "$COMMIT"
git -C "$DESTINATION" checkout --detach FETCH_HEAD
git -C "$DESTINATION" apply "$PATCH"
cargo build --manifest-path "$DESTINATION/Cargo.toml" --release

echo "Built pinned wallet backend at $DESTINATION/target/release/zcash-devtool"
