'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

interface AuthTreeNode {
  id: string;
  label: string;
  type: 'orchestrator' | 'worker' | 'transfer';
  children?: AuthTreeNode[];
  status: 'pending' | 'active' | 'complete';
}

// Transaction state type matching the parent component
type TransactionState = 'idle' | 'preparing' | 'signing' | 'submitting' | 'success' | 'error';

interface AuthTreeVisualizationProps {
  batches: {
    workerIndex: number;
    recipientCount: number;
  }[];
  isProcessing: boolean;
  isComplete: boolean;
  transactionHash?: string;
  // NEW: Actual transaction state for proper synchronization
  transactionState?: TransactionState;
  // NEW: Callback when visualization completes its animation
  onVisualizationComplete?: () => void;
}

// Completion animation duration (when transaction finishes, how long to animate to 100%)
const COMPLETION_ANIMATION_MS = 2000;
// Minimum progress per phase to show meaningful animation
const MIN_PHASE_DURATION_MS = 800;

// Easing function for smooth animations
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function AuthTreeVisualization({
  batches,
  isProcessing,
  isComplete,
  transactionHash,
  transactionState = 'idle',
  onVisualizationComplete,
}: AuthTreeVisualizationProps) {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'idle' | 'building' | 'signing' | 'submitting' | 'complete'>('idle');
  const [isVisualizationComplete, setIsVisualizationComplete] = useState(false);

  const animationRef = useRef<number | null>(null);
  const phaseStartTimeRef = useRef<number | null>(null);
  const completionStartTimeRef = useRef<number | null>(null);
  const progressAtCompletionRef = useRef<number>(0);
  const lastPhaseRef = useRef<TransactionState>('idle');

  // Build the tree structure
  const buildTree = (): AuthTreeNode => {
    const workers = batches.map((batch, index) => {
      const transfers = Array.from({ length: batch.recipientCount }, (_, i) => ({
        id: `transfer-${index}-${i}`,
        label: `Transfer ${i + 1}`,
        type: 'transfer' as const,
        status: 'pending' as const,
      }));

      return {
        id: `worker-${index}`,
        label: `Worker ${index + 1}`,
        type: 'worker' as const,
        children: transfers,
        status: 'pending' as const,
      };
    });

    return {
      id: 'orchestrator',
      label: 'Orchestrator',
      type: 'orchestrator' as const,
      children: workers,
      status: 'pending' as const,
    };
  };

  const tree = buildTree();
  const totalNodes = 1 + batches.length + batches.reduce((sum, b) => sum + b.recipientCount, 0);

  // Map transaction state to target progress ranges
  const getTargetProgressForState = useCallback((state: TransactionState): { min: number; max: number } => {
    switch (state) {
      case 'preparing':
        return { min: 0, max: 0.30 }; // 0-30%
      case 'signing':
        return { min: 0.30, max: 0.50 }; // 30-50%
      case 'submitting':
        return { min: 0.50, max: 0.85 }; // 50-85%
      case 'success':
        return { min: 0.85, max: 1.0 }; // 85-100%
      default:
        return { min: 0, max: 0 };
    }
  }, []);

  // Animate within a phase - smoothly animate toward the phase's max progress
  const animateWithinPhase = useCallback(() => {
    if (!phaseStartTimeRef.current) return;

    const elapsed = Date.now() - phaseStartTimeRef.current;
    const target = getTargetProgressForState(transactionState);

    // Animate toward the max of current phase over MIN_PHASE_DURATION_MS
    // But cap at 90% of the phase max to leave room for next phase transition
    const phaseProgress = Math.min(elapsed / MIN_PHASE_DURATION_MS, 1);
    const cappedMax = target.min + (target.max - target.min) * 0.9;
    const newProgress = target.min + (cappedMax - target.min) * easeOutCubic(phaseProgress);

    setAnimationProgress(prev => Math.max(prev, newProgress));

    // Update visual phase
    if (newProgress < 0.30) {
      setCurrentPhase('building');
    } else if (newProgress < 0.50) {
      setCurrentPhase('signing');
    } else if (newProgress < 0.85) {
      setCurrentPhase('submitting');
    }

    // Keep animating if we haven't reached the cap and transaction is still in this phase
    if (phaseProgress < 1 && !isComplete) {
      animationRef.current = requestAnimationFrame(animateWithinPhase);
    }
  }, [transactionState, isComplete, getTargetProgressForState]);

  // Completion animation - smoothly animate from current progress to 100%
  const animateToCompletion = useCallback(() => {
    if (!completionStartTimeRef.current) return;

    const elapsed = Date.now() - completionStartTimeRef.current;
    const progress = Math.min(elapsed / COMPLETION_ANIMATION_MS, 1);

    // Ease out from current progress to 100%
    const startProgress = progressAtCompletionRef.current;
    const newProgress = startProgress + (1 - startProgress) * easeOutCubic(progress);

    setAnimationProgress(newProgress);

    // Update visual phase based on progress
    if (newProgress < 0.95) {
      setCurrentPhase('submitting');
    } else {
      setCurrentPhase('complete');
    }

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animateToCompletion);
    } else {
      // Animation fully complete
      setIsVisualizationComplete(true);
      onVisualizationComplete?.();
    }
  }, [onVisualizationComplete]);

  // Handle transaction state changes
  useEffect(() => {
    // Only react to actual state transitions, not re-renders
    if (transactionState === lastPhaseRef.current) {
      return;
    }

    // Cancel any existing animation before starting new one
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    lastPhaseRef.current = transactionState;

    if (transactionState === 'preparing') {
      // Start fresh
      phaseStartTimeRef.current = Date.now();
      setCurrentPhase('building');
      animationRef.current = requestAnimationFrame(animateWithinPhase);
    } else if (transactionState === 'signing') {
      phaseStartTimeRef.current = Date.now();
      setCurrentPhase('signing');
      // Jump to signing min if we're behind
      setAnimationProgress(prev => Math.max(prev, 0.30));
      animationRef.current = requestAnimationFrame(animateWithinPhase);
    } else if (transactionState === 'submitting') {
      phaseStartTimeRef.current = Date.now();
      setCurrentPhase('submitting');
      // Jump to submitting min if we're behind
      setAnimationProgress(prev => Math.max(prev, 0.50));
      animationRef.current = requestAnimationFrame(animateWithinPhase);
    } else if (transactionState === 'success') {
      // Transaction complete! Start completion animation
      progressAtCompletionRef.current = animationProgress;
      completionStartTimeRef.current = Date.now();
      animationRef.current = requestAnimationFrame(animateToCompletion);
    } else if (transactionState === 'error') {
      // Stop animation on error
      setCurrentPhase('idle');
    } else if (transactionState === 'idle') {
      // Reset everything
      phaseStartTimeRef.current = null;
      completionStartTimeRef.current = null;
      progressAtCompletionRef.current = 0;
      setAnimationProgress(0);
      setCurrentPhase('idle');
      setIsVisualizationComplete(false);
    }
  }, [transactionState, animateWithinPhase, animateToCompletion, animationProgress]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Fallback: Handle isComplete prop if transactionState isn't being passed
  useEffect(() => {
    if (isComplete && transactionState !== 'success' && !completionStartTimeRef.current) {
      // Fallback for legacy usage without transactionState
      progressAtCompletionRef.current = animationProgress;
      completionStartTimeRef.current = Date.now();
      animationRef.current = requestAnimationFrame(animateToCompletion);
    }
  }, [isComplete, transactionState, animationProgress, animateToCompletion]);

  // Reset on new processing (when idle and not complete)
  useEffect(() => {
    if (!isProcessing && !isComplete && transactionState === 'idle') {
      phaseStartTimeRef.current = null;
      completionStartTimeRef.current = null;
      progressAtCompletionRef.current = 0;
      setAnimationProgress(0);
      setCurrentPhase('idle');
      setIsVisualizationComplete(false);
    }
  }, [isProcessing, isComplete, transactionState]);

  // Calculate node status based on progress
  const getNodeStatus = (_nodeIndex: number, totalBeforeNode: number): 'pending' | 'active' | 'complete' => {
    // If visualization is complete, all nodes are complete
    if (isVisualizationComplete || animationProgress >= 0.99) {
      return 'complete';
    }

    const nodeProgress = totalBeforeNode / totalNodes;
    if (animationProgress >= nodeProgress + (1 / totalNodes)) {
      return 'complete';
    } else if (animationProgress >= nodeProgress) {
      return 'active';
    }
    return 'pending';
  };

  const phaseLabels = {
    idle: 'Ready to process',
    building: 'Building Authorization Tree...',
    signing: 'Awaiting Signature...',
    submitting: 'Submitting Transaction...',
    complete: 'Transaction Complete',
  };

  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-white/5 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Authorization Tree</h3>
        <div className="flex items-center gap-2">
          {currentPhase !== 'idle' && currentPhase !== 'complete' && (
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          )}
          {currentPhase === 'complete' && (
            <div className="w-2 h-2 rounded-full bg-green-500" />
          )}
          <span className="text-sm text-white/60">{phaseLabels[currentPhase]}</span>
        </div>
      </div>

      {/* Progress Bar */}
      {currentPhase !== 'idle' && (
        <div className="mb-6">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
              style={{ width: `${animationProgress * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Tree Visualization */}
      <div className="relative">
        {/* Orchestrator Level */}
        <div className="flex flex-col items-center">
          <TreeNode
            label="Orchestrator"
            sublabel="orchestrate_payments()"
            status={getNodeStatus(0, 1)}
            isRoot
          />

          {/* Connection Lines */}
          {batches.length > 0 && (
            <div className="relative w-full mt-4 mb-4">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-6 bg-white/20" />
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-[80%] h-px bg-white/20" />
            </div>
          )}

          {/* Worker Level */}
          <div className="flex flex-wrap justify-center gap-4 w-full">
            {batches.map((batch, workerIndex) => {
              const nodesBeforeWorker = 1 + workerIndex * (1 + Math.max(...batches.map(b => b.recipientCount)));
              const workerStatus = getNodeStatus(workerIndex + 1, nodesBeforeWorker / totalNodes);

              return (
                <div key={workerIndex} className="flex flex-col items-center">
                  {/* Vertical line from horizontal connector */}
                  <div className="w-px h-4 bg-white/20" />

                  <TreeNode
                    label={`Worker ${workerIndex + 1}`}
                    sublabel={`batch_pay() - ${batch.recipientCount} transfers`}
                    status={workerStatus}
                  />

                  {/* Transfer indicators */}
                  <div className="mt-3 flex flex-wrap justify-center gap-1 max-w-[120px]">
                    {Array.from({ length: batch.recipientCount }, (_, i) => {
                      const transferNodeIndex = nodesBeforeWorker + 1 + i;
                      const transferStatus = getNodeStatus(transferNodeIndex, transferNodeIndex / totalNodes);
                      return (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            transferStatus === 'complete'
                              ? 'bg-green-500'
                              : transferStatus === 'active'
                              ? 'bg-blue-500 animate-pulse'
                              : 'bg-white/20'
                          }`}
                          title={`Transfer ${i + 1}`}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-semibold text-white">{batches.length}</div>
          <div className="text-xs text-white/40">Batches</div>
        </div>
        <div>
          <div className="text-2xl font-semibold text-white">
            {batches.reduce((sum, b) => sum + b.recipientCount, 0)}
          </div>
          <div className="text-xs text-white/40">Recipients</div>
        </div>
        <div>
          <div className="text-2xl font-semibold text-white">1</div>
          <div className="text-xs text-white/40">Signature</div>
        </div>
      </div>

      {/* Transaction Hash */}
      {transactionHash && currentPhase === 'complete' && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="text-xs text-green-400 mb-1">Transaction Hash</div>
          <div className="text-sm text-white font-mono truncate">
            <a
              href={`https://stellar.expert/explorer/testnet/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              {transactionHash}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

interface TreeNodeProps {
  label: string;
  sublabel?: string;
  status: 'pending' | 'active' | 'complete';
  isRoot?: boolean;
}

function TreeNode({ label, sublabel, status, isRoot }: TreeNodeProps) {
  const statusStyles = {
    pending: 'border-white/20 bg-black/40',
    active: 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20',
    complete: 'border-green-500 bg-green-500/10',
  };

  const iconStyles = {
    pending: 'text-white/40',
    active: 'text-blue-400',
    complete: 'text-green-400',
  };

  return (
    <div
      className={`relative px-4 py-3 rounded-xl border transition-all duration-300 ${statusStyles[status]} ${
        isRoot ? 'min-w-[200px]' : 'min-w-[140px]'
      }`}
    >
      <div className="flex items-center gap-2">
        {/* Status Icon */}
        <div className={`transition-colors duration-300 ${iconStyles[status]}`}>
          {status === 'complete' ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : status === 'active' ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <div className="w-4 h-4 rounded-full border border-current" />
          )}
        </div>

        <div>
          <div className="text-sm font-medium text-white">{label}</div>
          {sublabel && (
            <div className="text-xs text-white/40 font-mono">{sublabel}</div>
          )}
        </div>
      </div>
    </div>
  );
}
