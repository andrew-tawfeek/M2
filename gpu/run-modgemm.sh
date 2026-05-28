#!/usr/bin/env bash
# Run the M2 GPU-branch modular GF(p) GEMM benchmark on the GPU box.
#   curl -fsSL <this-gist-raw> | bash
set -uo pipefail
export PATH=/usr/local/cuda/bin:$PATH
echo "== installing OpenBLAS (CPU baseline) if needed =="
command -v nvcc >/dev/null || { echo "ERROR: nvcc not found (is this the CUDA image?)"; exit 1; }
ldconfig -p 2>/dev/null | grep -q openblas || sudo apt-get install -y -q libopenblas-dev >/dev/null 2>&1 || true
echo "== fetching + compiling benchmark =="
curl -fsSL https://gist.github.com/andrew-tawfeek/75479a1690d9d296c8adb2dfd2893289/raw -o /tmp/modgemm_bench.cu
nvcc -O3 /tmp/modgemm_bench.cu -o /tmp/modgemm_bench -lcublas -lopenblas
echo "== GPU info =="
nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader 2>/dev/null || true
echo "== running (modular GF(p) GEMM, the F4 reduce_matrix kernel) =="
/tmp/modgemm_bench 4096
echo "== (run /tmp/modgemm_bench 8192 for a bigger size if you like) =="
echo "== DONE — paste the CPU/GPU/SPEEDUP lines back to Auto. Stop billing with: gcloud compute instances stop gpu-box --zone=us-central1-a =="
