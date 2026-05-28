// Modular GF(p) dense GEMM benchmark: GPU (cuBLAS dgemm + mod-reduce) vs CPU (OpenBLAS dgemm + mod-reduce).
// This is the core kernel of Macaulay2's F4 reduce_matrix() — finite-field dense linear algebra.
// Technique (à la FFLAS-FFPACK): for small primes (p^2 * K < 2^53) the modular product is exact in
// double, so C = A*B can be computed with a normal double GEMM and reduced mod p afterward.
// Build (on the GPU box):
//   nvcc -O3 modgemm_bench.cu -o modgemm_bench -lcublas -lopenblas
#include <cstdio>
#include <cmath>
#include <cstdlib>
#include <random>
#include <chrono>
#include <vector>
#include <cublas_v2.h>
#include <cuda_runtime.h>

extern "C" void cblas_dgemm(int,int,int,int,int,int,double,const double*,int,const double*,int,double,double*,int);
#define ROWMAJOR 101
#define NOTRANS 111

__global__ void modreduce(double* C, long n, double p){
  long i = blockIdx.x*(long)blockDim.x + threadIdx.x;
  if(i<n) C[i] = fmod(C[i], p);
}

int main(int argc, char** argv){
  int N = argc>1 ? atoi(argv[1]) : 4096;
  double p = 1048573.0;             // largest prime < 2^20; p^2*N < 2^53 for N<=8192
  printf("Modular GF(p) GEMM, N=%d, p=%.0f (double-GEMM-then-reduce, FFLAS-style)\n", N, p);

  long NN = (long)N*N;
  std::vector<double> A(NN), B(NN), Cc(NN);
  std::mt19937_64 rng(1); std::uniform_real_distribution<double> U(0,p);
  for(long i=0;i<NN;i++){ A[i]=floor(U(rng)); B[i]=floor(U(rng)); }

  // ---- CPU: OpenBLAS dgemm + reduce ----
  auto c0=std::chrono::steady_clock::now();
  cblas_dgemm(ROWMAJOR,NOTRANS,NOTRANS,N,N,N,1.0,A.data(),N,B.data(),N,0.0,Cc.data(),N);
  for(long i=0;i<NN;i++) Cc[i]=fmod(Cc[i],p);
  auto c1=std::chrono::steady_clock::now();
  double cpu_ms=std::chrono::duration<double,std::milli>(c1-c0).count();

  // ---- GPU: cuBLAS dgemm + reduce ----
  double *dA,*dB,*dC; cudaMalloc(&dA,NN*8); cudaMalloc(&dB,NN*8); cudaMalloc(&dC,NN*8);
  cudaMemcpy(dA,A.data(),NN*8,cudaMemcpyHostToDevice);
  cudaMemcpy(dB,B.data(),NN*8,cudaMemcpyHostToDevice);
  cublasHandle_t h; cublasCreate(&h);
  double one=1.0, zero=0.0;
  // cuBLAS is column-major; compute C^T = B^T*A^T equivalently by swapping args -> gives row-major C.
  auto gemm=[&](){
    cublasDgemm(h,CUBLAS_OP_N,CUBLAS_OP_N,N,N,N,&one,dB,N,dA,N,&zero,dC,N);
    long n=NN; int t=256; modreduce<<<(n+t-1)/t,t>>>(dC,n,p);
  };
  gemm(); cudaDeviceSynchronize();                       // warmup
  cudaEvent_t e0,e1; cudaEventCreate(&e0); cudaEventCreate(&e1);
  int reps=5; cudaEventRecord(e0);
  for(int r=0;r<reps;r++) gemm();
  cudaEventRecord(e1); cudaEventSynchronize(e1);
  float gpu_ms_total=0; cudaEventElapsedTime(&gpu_ms_total,e0,e1);
  double gpu_ms=gpu_ms_total/reps;
  std::vector<double> Cg(NN); cudaMemcpy(Cg.data(),dC,NN*8,cudaMemcpyDeviceToHost);

  // ---- correctness ----
  double maxdiff=0; for(long i=0;i<NN;i++) maxdiff=fmax(maxdiff,fabs(Cg[i]-Cc[i]));

  double gflop = 2.0*N*N*(double)N/1e9;
  printf("  CPU (OpenBLAS, %d thr): %8.1f ms  = %.1f GFLOP/s\n", 0, cpu_ms, gflop/(cpu_ms/1e3));
  printf("  GPU (cuBLAS L4)       : %8.1f ms  = %.1f GFLOP/s  (compute only, avg of %d)\n", gpu_ms, gflop/(gpu_ms/1e3), reps);
  printf("  SPEEDUP GPU/CPU       : %.1fx\n", cpu_ms/gpu_ms);
  printf("  correctness (max |GPU-CPU| over GF(p)) = %.0f  (%s)\n", maxdiff, maxdiff==0?"EXACT MATCH":"MISMATCH!");
  cublasDestroy(h); cudaFree(dA); cudaFree(dB); cudaFree(dC);
  return 0;
}
