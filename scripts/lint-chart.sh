#!/usr/bin/env bash
# lint + template + schema-validate the helm chart, locally and in ci
# runs for the chart defaults plus every ci/*-values.yaml permutation
set -euo pipefail   # important: without it a failure is masked by kubeconforms exit

CHART_DIR="${CHART_DIR:-charts/koordinattransformation}"
KUBE_VERSION="${KUBE_VERSION:-1.36.0}"
CI_DIR="$CHART_DIR/ci"
CACHE_DIR="${RUNNER_TEMP:-/tmp}/kubeconform-cache"

for bin in helm kubeconform; do
  command -v "$bin" >/dev/null 2>&1 || { echo "::error::$bin not found in PATH"; exit 1; }
done

mkdir -p "$CACHE_DIR"

run_one() {
  local label="$1"; shift # remaining args are -f flags (may be none)
  echo "[-] Validating: $label"
  helm lint --strict "$CHART_DIR" "$@"
  helm template release "$CHART_DIR" "$@" \
    | kubeconform -strict -summary \
        -kubernetes-version "$KUBE_VERSION" \
        -schema-location default \
        -cache "$CACHE_DIR" \
        -
}

run_one "defaults" # chart defaults, no -f

shopt -s nullglob # safe when ci/ is empty
for f in "$CI_DIR"/*-values.yaml; do
  run_one "$(basename "$f")" -f "$f"
done
shopt -u nullglob

echo "[+] All chart validations passed!"
