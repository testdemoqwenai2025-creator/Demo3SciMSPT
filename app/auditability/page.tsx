'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import Link from 'next/link'

/**
 * Auditability & Traceability Page - SciMSPT AI-Native Architecture
 * 
 * ENHANCED PREMIUM EDITION - The Most Impressive Showcase Page!
 * 
 * Features:
 * 1. REAL Cryptographic Demo (Web Crypto API SHA-256)
 * 2. Live Audit Log Stream (auto-updating every 3-5 seconds)
 * 3. Merkle Tree Builder (interactive construction)
 * 4. Compliance Report Generator (GDPR, SOC2, HIPAA, ISO27001)
 * 5. Decision Path Explorer (enhanced with probabilities)
 * 6. Anomaly Detection Engine (ML-style simulation)
 * 7. Access Control Simulator (RBAC permission matrix)
 * 8. Blockchain-style Explorer (mining simulation)
 * 9. Usage & Subscription section
 * 10. Enhanced Visuals (dark theme, color-coded states)
 */

// ============ TYPES & INTERFACES ============

interface AuditLogEntry {
  id: string
  timestamp: string
  actor: string
  action: string
  resource: string
  hash: string
  severity: 'info' | 'success' | 'warning' | 'error' | 'critical'
}

interface MerkleNode {
  hash: string
  left?: MerkleNode
  right?: MerkleNode
  data?: string
  isLeaf?: boolean
}

interface Block {
  index: number
  timestamp: string
  hash: string
  previousHash: string
  nonce: number
  data: string
}

interface Role {
  name: string
  permissions: {
    readLogs: boolean
    writeLogs: boolean
    deleteLogs: boolean
    manageUsers: boolean
    viewReports: boolean
    exportData: boolean
    modifyPermissions: boolean
    systemConfig: boolean
  }
}

interface PermissionChange {
  timestamp: string
  role: string
  permission: string
  oldValue: boolean
  newValue: string
  changedBy: string
}

interface ComplianceItem {
  id: string
  framework: string
  category: string
  requirement: string
  description: string
  checked: boolean
  evidence?: string
}

interface AnomalyAlert {
  id: string
  timestamp: string
  type: 'statistical_outlier' | 'pattern_break' | 'confidence_drift'
  description: string
  confidence: number
  baseline: number
  actual: number
  status: 'detected' | 'acknowledged' | 'investigating' | 'false_positive' | 'resolved'
}

interface DecisionEvent {
  id: string
  timestamp: string
  decision: string
  chosenPath: string
  confidence: number
  alternatives: { path: string; probability: number; reason: string }[]
  explanation: string
}

// ============ CRYPTOGRAPHIC UTILITIES (REAL Web Crypto API) ============

async function computeSHA256(message: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function computeHashChain(entries: string[]): Promise<string[]> {
  const hashes: string[] = []
  let previousHash = '0'.repeat(64)
  
  for (const entry of entries) {
    const combined = previousHash + entry
    const hash = await computeSHA256(combined)
    hashes.push(hash)
    previousHash = hash
  }
  
  return hashes
}

// ============ MERKLE TREE UTILITIES ============

async function buildMerkleTree(leaves: string[]): Promise<MerkleNode> {
  if (leaves.length === 0) {
    return { hash: await computeSHA256('') }
  }
  
  if (leaves.length === 1) {
    return { hash: await computeSHA256(leaves[0]), data: leaves[0], isLeaf: true }
  }
  
  const nodes: MerkleNode[] = await Promise.all(
    leaves.map(async (leaf) => ({
      hash: await computeSHA256(leaf),
      data: leaf,
      isLeaf: true as const
    }))
  )
  
  while (nodes.length > 1) {
    const nextLevel: MerkleNode[] = []
    
    for (let i = 0; i < nodes.length; i += 2) {
      const left = nodes[i]
      const right = nodes[i + 1] || nodes[i]
      const combinedHash = await computeSHA256(left.hash + right.hash)
      nextLevel.push({ hash: combinedHash, left, right })
    }
    
    nodes.splice(0, nodes.length, ...nextLevel)
  }
  
  return nodes[0]
}

async function getMerkleProof(tree: MerkleNode, targetData: string, path: string[] = []): Promise<string[] | null> {
  if (!tree) return null
  
  if (tree.isLeaf && tree.data === targetData) {
    return path
  }
  
  if (tree.left) {
    const leftProof = await getMerkleProof(tree.left, targetData, [...path, tree.right?.hash || tree.left.hash])
    if (leftProof) return leftProof
  }
  
  if (tree.right) {
    const rightProof = await getMerkleProof(tree.right, targetData, [...path, tree.left?.hash || tree.right.hash])
    if (rightProof) return rightProof
  }
  
  return null
}

async function verifyMerkleProof(leaf: string, proof: string[], rootHash: string): Promise<boolean> {
  let currentHash = await computeSHA256(leaf)
  
  for (const sibling of proof) {
    currentHash = await computeSHA256(currentHash + sibling)
  }
  
  return currentHash === rootHash
}

// ============ BLOCKCHAIN UTILITIES ============

async function mineBlock(index: number, previousHash: string, data: string, difficulty: number = 2): Promise<Block> {
  const prefix = '0'.repeat(difficulty)
  let nonce = 0
  let hash = ''
  
  do {
    nonce++
    const content = `${index}${previousHash}${data}${nonce}`
    hash = await computeSHA256(content)
  } while (!hash.startsWith(prefix))
  
  return {
    index,
    timestamp: new Date().toISOString(),
    hash,
    previousHash,
    nonce,
    data
  }
}

async function validateChain(chain: Block[]): Promise<{ valid: boolean; message: string }> {
  for (let i = 1; i < chain.length; i++) {
    const currentBlock = chain[i]
    const previousBlock = chain[i - 1]
    
    // Verify hash
    const content = `${currentBlock.index}${currentBlock.previousHash}${currentBlock.data}${currentBlock.nonce}`
    const computedHash = await computeSHA256(content)
    
    if (computedHash !== currentBlock.hash) {
      return { valid: false, message: `Block ${i}: Hash mismatch detected!` }
    }
    
    if (currentBlock.previousHash !== previousBlock.hash) {
      return { valid: false, message: `Block ${i}: Chain broken at this block!` }
    }
  }
  
  return { valid: true, message: 'Blockchain integrity verified ✓' }
}

// ============ MOCK DATA GENERATORS ============

const actors = ['IntentClassifier', 'TaskPlanner', 'CodeGenerator', 'Validator', 'SecurityScanner', 'Admin', 'System', 'API Gateway']
const actions = [
  'Authenticated user session',
  'Processed request',
  'Generated code artifact',
  'Validated output',
  'Scanned for vulnerabilities',
  'Logged decision point',
  'Updated configuration',
  'Exported audit trail',
  'Modified permissions',
  'Created compliance report'
]
const resources = ['/api/auth', '/api/generate', '/api/validate', '/config/rules', '/audit/logs', '/users/*', '/reports/*', '/permissions']

function generateLiveLogEntry(id: number): AuditLogEntry {
  const severities: AuditLogEntry['severity'][] = ['info', 'info', 'info', 'success', 'warning', 'error']
  return {
    id: `live-${id.toString().padStart(6, '0')}`,
    timestamp: new Date().toISOString(),
    actor: actors[Math.floor(Math.random() * actors.length)],
    action: actions[Math.floor(Math.random() * actions.length)],
    resource: resources[Math.floor(Math.random() * resources.length)],
    hash: Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join(''),
    severity: severities[Math.floor(Math.random() * severities.length)]
  }
}

function generateAnomalyAlerts(): AnomalyAlert[] {
  return [
    {
      id: 'anom-001',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      type: 'confidence_drift',
      description: 'CodeGenerator agent showing 23% drop in average confidence over last 50 decisions',
      confidence: 94,
      baseline: 92,
      actual: 69,
      status: 'detected'
    },
    {
      id: 'anom-002',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      type: 'pattern_break',
      description: 'TaskPlanner chose non-standard decomposition path for 3 consecutive similar requests',
      confidence: 87,
      baseline: 85,
      actual: 42,
      status: 'acknowledged'
    },
    {
      id: 'anom-003',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      type: 'statistical_outlier',
      description: 'Response time exceeded 4 standard deviations from mean (z-score: 4.2)',
      confidence: 99,
      baseline: 150,
      actual: 2340,
      status: 'investigating'
    }
  ]
}

function generateDecisionEvents(): DecisionEvent[] {
  return [
    {
      id: 'dec-001',
      timestamp: new Date(Date.now() - 45000).toISOString(),
      decision: 'Route incoming request to appropriate agent',
      chosenPath: 'CodeGenerator',
      confidence: 0.94,
      alternatives: [
        { path: 'DataProcessor', probability: 0.04, reason: 'Request contains data transformation patterns but primary intent is code generation' },
        { path: 'Validator', probability: 0.02, reason: 'Validation not required at this stage - request is new, not a modification' }
      ],
      explanation: 'The intent classifier identified strong indicators of code generation intent: presence of technical keywords ("create", "endpoint", "API"), structured format requirements, and absence of data query patterns.'
    },
    {
      id: 'dec-002',
      timestamp: new Date(Date.now() - 30000).toISOString(),
      decision: 'Determine task complexity and execution strategy',
      chosenPath: 'Decompose into subtasks',
      confidence: 0.87,
      alternatives: [
        { path: 'Execute directly', probability: 0.13, reason: 'Direct execution possible but subtask decomposition improves parallelization and error isolation' }
      ],
      explanation: 'Complexity analysis scored this task as medium-high complexity due to multiple dependencies (auth, database, validation), suggesting decomposition would improve reliability and enable progress tracking.'
    }
  ]
}

const defaultRoles: Role[] = [
  {
    name: 'Admin',
    permissions: {
      readLogs: true, writeLogs: true, deleteLogs: true,
      manageUsers: true, viewReports: true, exportData: true,
      modifyPermissions: true, systemConfig: true
    }
  },
  {
    name: 'Auditor',
    permissions: {
      readLogs: true, writeLogs: false, deleteLogs: false,
      manageUsers: false, viewReports: true, exportData: true,
      modifyPermissions: false, systemConfig: false
    }
  },
  {
    name: 'Operator',
    permissions: {
      readLogs: true, writeLogs: true, deleteLogs: false,
      manageUsers: false, viewReports: true, exportData: true,
      modifyPermissions: false, systemConfig: false
    }
  },
  {
    name: 'Viewer',
    permissions: {
      readLogs: true, writeLogs: false, deleteLogs: false,
      manageUsers: false, viewReports: true, exportData: false,
      modifyPermissions: false, systemConfig: false
    }
  }
]

const complianceItems: ComplianceItem[] = [
  // GDPR Article 22
  { id: 'gdpr-1', framework: 'GDPR', category: 'Article 22', requirement: 'Right to Explanation', description: 'Provide meaningful information about logic involved in automated decision-making', checked: false },
  { id: 'gdpr-2', framework: 'GDPR', category: 'Article 22', requirement: 'Human Intervention', description: 'Obtain human intervention to express his or her point of view', checked: false },
  { id: 'gdpr-3', framework: 'GDPR', category: 'Article 22', requirement: 'Contest Decision', description: 'Contest the automated decision', checked: false },
  { id: 'gdpr-4', framework: 'GDPR', category: 'Article 5', requirement: 'Data Minimization', description: 'Adequate, relevant and limited to what is necessary', checked: false },
  { id: 'gdpr-5', framework: 'GDPR', category: 'Article 25', requirement: 'Privacy by Design', description: 'Implement appropriate technical measures at design stage', checked: false },
  // SOC2 CC6
  { id: 'soc2-1', framework: 'SOC2', category: 'CC6.1', requirement: 'Logical Access', description: 'Implement logical access security measures', checked: false },
  { id: 'soc2-2', framework: 'SOC2', category: 'CC6.2', requirement: 'User Authentication', description: 'Authenticate users before access granted', checked: false },
  { id: 'soc2-3', framework: 'SOC2', category: 'CC6.3', requirement: 'Privileged Access', description: 'Restrict privileged access to authorized individuals', checked: false },
  { id: 'soc2-4', framework: 'SOC2', category: 'CC6.6', requirement: 'Access Review', description: 'Review access rights periodically', checked: false },
  { id: 'soc2-5', framework: 'SOC2', category: 'CC6.7', requirement: 'Access Revocation', description: 'Modify or revoke access upon termination', checked: false },
  // HIPAA
  { id: 'hipaa-1', framework: 'HIPAA', category: '164.312(a)', requirement: 'Access Control', description: 'Implement technical policies for electronic PHI access', checked: false },
  { id: 'hipaa-2', framework: 'HIPAA', category: '164.312(b)', requirement: 'Audit Controls', description: 'Implement hardware/software mechanisms to examine system activity', checked: false },
  { id: 'hipaa-3', framework: 'HIPAA', category: '164.312(c)', requirement: 'Integrity Controls', description: 'Protect PHI from improper alteration or destruction', checked: false },
  { id: 'hipaa-4', framework: 'HIPAA', category: '164.312(e)', requirement: 'Transmission Security', description: 'Protect PHI during transmission', checked: false },
  // ISO27001
  { id: 'iso-1', framework: 'ISO27001', category: 'A.12.3', requirement: 'Backup', description: 'Information backup provisions', checked: false },
  { id: 'iso-2', framework: 'ISO27001', category: 'A.12.4', requirement: 'Logging', description: 'Event logging and monitoring', checked: false },
  { id: 'iso-3', framework: 'ISO27001', category: 'A.13.1', requirement: 'Network Controls', description: 'Network security management', checked: false },
  { id: 'iso-4', framework: 'ISO27001', category: 'A.14.1', requirement: 'Secure Development', description: 'Security requirements in systems development', checked: false },
  { id: 'iso-5', framework: 'ISO27001', category: 'A.15.1', requirement: 'Supplier Relationships', description: 'Information security in supplier relationships', checked: false }
]

// ============ MAIN COMPONENT ============

export default function AuditabilityPage() {
  const [activeTab, setActiveTab] = useState<string>('crypto')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const tabs = [
    { id: 'crypto', label: '🔐 Crypto Demo', icon: '🔐' },
    { id: 'livestream', label: '📡 Live Stream', icon: '📡' },
    { id: 'merkle', label: '🌳 Merkle Tree', icon: '🌳' },
    { id: 'compliance', label: '📋 Compliance', icon: '📋' },
    { id: 'decisions', label: '🔀 Decisions', icon: '🔀' },
    { id: 'anomaly', label: '🚨 Anomaly Detection', icon: '🚨' },
    { id: 'rbac', label: '🛡️ RBAC Simulator', icon: '🛡️' },
    { id: 'blockchain', label: '⛓️ Blockchain', icon: '⛓️' },
    { id: 'subscription', label: '💎 Subscription', icon: '💎' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors mb-1 block">← Back to Home</Link>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Auditability & Traceability
              </h1>
              <p className="text-slate-400 text-sm mt-1">AI-Native Architecture • Premium Edition</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Operational
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 sticky top-[73px] z-40 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-2 min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!isClient ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {activeTab === 'crypto' && <CryptoDemo />}
            {activeTab === 'livestream' && <LiveAuditStream />}
            {activeTab === 'merkle' && <MerkleTreeBuilder />}
            {activeTab === 'compliance' && <ComplianceReportGenerator />}
            {activeTab === 'decisions' && <DecisionPathExplorer />}
            {activeTab === 'anomaly' && <AnomalyDetectionEngine />}
            {activeTab === 'rbac' && <AccessControlSimulator />}
            {activeTab === 'blockchain' && <BlockchainExplorer />}
            {activeTab === 'subscription' && <SubscriptionSection />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-auto py-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          <p>SciMSPT AI-Native Architecture • Auditability & Traceability Module</p>
          <p className="mt-1">Powered by Web Crypto API • Real Cryptographic Verification</p>
        </div>
      </footer>

      <style jsx global>{`
        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #1e293b; border-radius: 4px; }
        ::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #64748b; }

        .mono { font-family: 'Fira Code', 'Cascadia Code', monospace; font-size: 0.85rem; }
        .capitalize { text-transform: capitalize; }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
          50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6); }
        }

        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }

        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>
    </div>
  )
}

// ============ COMPONENT 1: REAL CRYPTOGRAPHIC DEMO ============

function CryptoDemo() {
  const [inputText, setInputText] = useState('Hello, SciMSPT!')
  const [hashResult, setHashResult] = useState<string>('')
  const [isComputing, setIsComputing] = useState(false)
  const [hashChain, setHashChain] = useState<string[]>([])
  const [chainInput, setChainInput] = useState(['Block 1: Genesis', 'Block 2: Transaction', 'Block 3: Validation'])
  const [chainVerified, setChainVerified] = useState<boolean | null>(null)
  const [animationText, setAnimationText] = useState('')

  useEffect(() => {
    computeHash()
  }, [])

  const computeHash = async () => {
    setIsComputing(true)
    
    // Animation effect
    let dots = 0
    const animInterval = setInterval(() => {
      setAnimationText('.'.repeat(dots % 4))
      dots++
    }, 100)
    
    const hash = await computeSHA256(inputText)
    clearInterval(animInterval)
    setAnimationText('')
    setHashResult(hash)
    setIsComputing(false)
  }

  const handleComputeHashChain = async () => {
    setChainVerified(null)
    const hashes = await computeHashChain(chainInput)
    setHashChain(hashes)
  }

  const verifyChainIntegrity = async () => {
    const recomputed = await computeHashChain(chainInput)
    const isValid = JSON.stringify(recomputed) === JSON.stringify(hashChain)
    setChainVerified(isValid)
  }

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <h2 className="text-xl font-bold text-emerald-400 mb-2 flex items-center gap-2">
          🔐 Real SHA-256 Hash Computation
        </h2>
        <p className="text-slate-400 text-sm mb-6">Using Web Crypto API for real cryptographic hashing</p>

        {/* Single Hash Demo */}
        <div className="bg-slate-800/50 rounded-xl p-5 space-y-4">
          <label className="block">
            <span className="text-sm text-slate-300 mb-2 block">Enter text to hash:</span>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && computeHash()}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
              placeholder="Type something..."
            />
          </label>

          <button
            onClick={computeHash}
            disabled={isComputing}
            className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {isComputing ? (
              <>
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Computing{animationText}
              </>
            ) : (
              <>Compute SHA-256 Hash</>
            )}
          </button>

          {hashResult && (
            <div className="bg-slate-900 rounded-lg p-4 border border-emerald-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-emerald-400 font-medium">SHA-256 Output (64 hex characters)</span>
                <button
                  onClick={() => navigator.clipboard.writeText(hashResult)}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  📋 Copy
                </button>
              </div>
              <code className="mono text-emerald-300 break-all text-sm leading-relaxed">{hashResult}</code>
            </div>
          )}

          {/* Hash Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/70 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-cyan-400">{hashResult.length}</div>
              <div className="text-xs text-slate-400">Characters</div>
            </div>
            <div className="bg-slate-900/70 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-400">{hashResult.length / 2}</div>
              <div className="text-xs text-slate-400">Bytes</div>
            </div>
            <div className="bg-slate-900/70 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-amber-400">256</div>
              <div className="text-xs text-slate-400">Bits</div>
            </div>
            <div className="bg-slate-900/70 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-emerald-400">✓</div>
              <div className="text-xs text-slate-400">Real Crypto</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hash Chain Demo */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <h2 className="text-xl font-bold text-cyan-400 mb-2 flex items-center gap-2">
          ⛓️ Hash Chain Verification
        </h2>
        <p className="text-slate-400 text-sm mb-6">Each block's hash depends on the previous hash - tamper detection!</p>

        <div className="space-y-4">
          {chainInput.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-24 text-right">
                <span className="text-xs text-slate-500">Block {idx + 1}</span>
              </div>
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const newChain = [...chainInput]
                  newChain[idx] = e.target.value
                  setChainInput(newChain)
                }}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none"
              />
              {hashChain[idx] && (
                <div className="flex-shrink-0 max-w-[200px] truncate mono text-xs text-emerald-400 bg-slate-800 px-2 py-2 rounded">
                  {hashChain[idx].substring(0, 16)}...
                </div>
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setChainInput([...chainInput, `Block ${chainInput.length + 1}: New Entry`])}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
            >
              + Add Block
            </button>
            <button
              onClick={handleComputeHashChain}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-medium transition-colors"
            >
              Compute Chain
            </button>
            {hashChain.length > 0 && (
              <button
                onClick={verifyChainIntegrity}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors"
              >
                Verify Integrity
              </button>
            )}
          </div>

          {chainVerified !== null && (
            <div className={`rounded-lg p-4 ${chainVerified ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{chainVerified ? '✅' : '❌'}</span>
                <span className={chainVerified ? 'text-emerald-400' : 'text-red-400'}>
                  {chainVerified ? 'Chain integrity VERIFIED - All hashes are consistent!' : 'Chain BROKEN - Tampering detected!'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============ COMPONENT 2: LIVE AUDIT LOG STREAM ============

function LiveAuditStream() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [isStreaming, setIsStreaming] = useState(true)
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const logCounterRef = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Initialize with some logs
    const initialLogs: AuditLogEntry[] = []
    for (let i = 0; i < 10; i++) {
      logCounterRef.current++
      initialLogs.push(generateLiveLogEntry(logCounterRef.current))
    }
    setLogs(initialLogs.reverse())

    // Start streaming
    startStreaming()

    return () => stopStreaming()
  }, [])

  const startStreaming = () => {
    if (intervalRef.current) return
    
    intervalRef.current = setInterval(() => {
      logCounterRef.current++
      const newEntry = generateLiveLogEntry(logCounterRef.current)
      
      setLogs(prev => {
        const updated = [newEntry, ...prev]
        // Keep only last 50 entries
        return updated.slice(0, 50)
      })
    }, 3000 + Math.random() * 2000) // Random interval between 3-5 seconds
  }

  const stopStreaming = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const toggleStreaming = () => {
    if (isStreaming) {
      stopStreaming()
    } else {
      startStreaming()
    }
    setIsStreaming(!isStreaming)
  }

  const filteredLogs = filterSeverity === 'all' 
    ? logs 
    : logs.filter(l => l.severity === filterSeverity)

  const exportToCSV = () => {
    const headers = ['ID', 'Timestamp', 'Actor', 'Action', 'Resource', 'Hash', 'Severity']
    const rows = filteredLogs.map(l => [l.id, l.timestamp, l.actor, l.action, l.resource, l.hash, l.severity])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportToJSON = () => {
    const json = JSON.stringify(filteredLogs, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const severityColors = {
    info: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
    success: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    warning: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
    error: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
    critical: { bg: 'bg-red-600/20', text: 'text-red-300', border: 'border-red-600/30' }
  }

  const severityCounts = useMemo(() => ({
    all: logs.length,
    info: logs.filter(l => l.severity === 'info').length,
    success: logs.filter(l => l.severity === 'success').length,
    warning: logs.filter(l => l.severity === 'warning').length,
    error: logs.filter(l => l.severity === 'error').length,
    critical: logs.filter(l => l.severity === 'critical').length,
  }), [logs])

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(severityCounts).map(([key, count]) => (
          <button
            key={key}
            onClick={() => setFilterSeverity(key)}
            className={`p-4 rounded-xl border transition-all ${
              filterSeverity === key 
                ? 'bg-slate-700 border-emerald-500 ring-1 ring-emerald-500' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-2xl font-bold text-white">{count}</div>
            <div className="text-xs text-slate-400 capitalize">{key}</div>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleStreaming}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
              isStreaming 
                ? 'bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30' 
                : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-red-400 animate-pulse' : 'bg-emerald-400'}`} />
            {isStreaming ? 'Stop Stream' : 'Start Stream'}
          </button>
          
          <div className="text-sm text-slate-400">
            Updates every 3-5s • Max 50 entries
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors flex items-center gap-1.5"
          >
            📥 CSV
          </button>
          <button
            onClick={exportToJSON}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors flex items-center gap-1.5"
          >
            📥 JSON
          </button>
        </div>
      </div>

      {/* Log Stream */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-slate-800 z-10">
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wider">
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Resource</th>
                <th className="px-4 py-3">Hash</th>
                <th className="px-4 py-3">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLogs.map((log, idx) => {
                const colors = severityColors[log.severity]
                return (
                  <tr 
                    key={log.id} 
                    className={`hover:bg-slate-800/50 transition-colors ${idx === 0 ? 'animate-slide-in' : ''}`}
                  >
                    <td className="px-4 py-3 mono text-xs text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-white font-medium">{log.actor}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{log.action}</td>
                    <td className="px-4 py-3 mono text-xs text-cyan-400">{log.resource}</td>
                    <td className="px-4 py-3 mono text-xs text-emerald-400/70" style={{ maxWidth: '120px' }}>
                      {log.hash.substring(0, 12)}...
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
                        {log.severity.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              No log entries match the selected filter
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============ COMPONENT 3: MERKLE TREE BUILDER ============

function MerkleTreeBuilder() {
  const [entries, setEntries] = useState<string[]>(['Transaction A: $100', 'Transaction B: $250', 'Transaction C: $75', 'Transaction D: $150'])
  const [newEntry, setNewEntry] = useState('')
  const [tree, setTree] = useState<MerkleNode | null>(null)
  const [selectedForProof, setSelectedForProof] = useState<string>('')
  const [proof, setProof] = useState<string[]>([])
  const [proofVerified, setProofVerified] = useState<boolean | null>(null)
  const [isBuilding, setIsBuilding] = useState(false)

  const buildTree = async () => {
    setIsBuilding(true)
    const builtTree = await buildMerkleTree(entries.filter(e => e.trim()))
    setTree(builtTree)
    setSelectedForProof('')
    setProof([])
    setProofVerified(null)
    setIsBuilding(false)
  }

  const generateProof = async () => {
    if (!tree || !selectedForProof) return
    
    const merkleProof = await getMerkleProof(tree, selectedForProof)
    if (merkleProof) {
      setProof(merkleProof)
      const isValid = await verifyMerkleProof(selectedForProof, merkleProof, tree.hash)
      setProofVerified(isValid)
    } else {
      setProof([])
      setProofVerified(null)
    }
  }

  const addEntry = () => {
    if (newEntry.trim()) {
      setEntries([...entries, newEntry.trim()])
      setNewEntry('')
    }
  }

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index))
  }

  const renderTreeNode = (node: MerkleNode, depth: number = 0, isLast: boolean = true): React.ReactNode => {
    if (!node) return null
    
    return (
      <div className="flex items-start gap-2">
        <div className="flex flex-col items-center">
          <div className={`w-3 h-3 rounded-full ${node.isLeaf ? 'bg-emerald-500' : 'bg-cyan-500'} mt-2`} />
          {!isLast && depth > 0 && <div className="w-0.5 h-6 bg-slate-700" />}
        </div>
        <div className="pb-4">
          <div className={`rounded-lg p-3 ${node.isLeaf ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-cyan-500/10 border border-cyan-500/30'} min-w-[200px]`}>
            <div className="mono text-xs text-emerald-400 break-all">{node.hash.substring(0, 32)}...</div>
            {node.data && <div className="text-xs text-slate-400 mt-1">{node.data}</div>}
          </div>
          {node.left && node.right && (
            <div className="mt-3 ml-4 flex gap-4">
              {renderTreeNode(node.left, depth + 1, false)}
              {renderTreeNode(node.right, depth + 1, true)}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Entry Management */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <h2 className="text-xl font-bold text-emerald-400 mb-4">🌳 Merkle Tree Builder</h2>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addEntry()}
            placeholder="Add transaction/entry..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
          />
          <button
            onClick={addEntry}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors"
          >
            Add
          </button>
          <button
            onClick={buildTree}
            disabled={isBuilding || entries.filter(e => e.trim()).length === 0}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 rounded-lg font-medium transition-colors"
          >
            {isBuilding ? 'Building...' : 'Build Tree'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {entries.map((entry, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 bg-slate-800 rounded-lg text-sm text-slate-300 flex items-center gap-2 group"
            >
              {entry.substring(0, 30)}{entry.length > 30 ? '...' : ''}
              <button
                onClick={() => removeEntry(idx)}
                className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Tree Visualization & Root Hash */}
      {tree && (
        <>
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Merkle Root Hash</h3>
              <button
                onClick={() => navigator.clipboard.writeText(tree.hash)}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                📋 Copy
              </button>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border border-emerald-500/30">
              <code className="mono text-emerald-400 text-sm break-all">{tree.hash}</code>
            </div>
          </div>

          {/* Tree Structure */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <h3 className="font-semibold text-white mb-4">Tree Structure</h3>
            <div className="overflow-x-auto pb-4">
              {renderTreeNode(tree)}
            </div>
          </div>

          {/* Proof Generation */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <h3 className="font-semibold text-white mb-4">🔍 Merkle Proof Generator</h3>
            
            <div className="mb-4">
              <label className="block text-sm text-slate-400 mb-2">Select entry to generate proof:</label>
              <select
                value={selectedForProof}
                onChange={(e) => {
                  setSelectedForProof(e.target.value)
                  setProof([])
                  setProofVerified(null)
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 outline-none"
              >
                <option value="">-- Select an entry --</option>
                {entries.filter(e => e.trim()).map((entry, idx) => (
                  <option key={idx} value={entry}>{entry}</option>
                ))}
              </select>
            </div>

            <button
              onClick={generateProof}
              disabled={!selectedForProof}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-lg font-medium transition-colors mb-4"
            >
              Generate Proof
            </button>

            {proof.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-300">Proof Path ({proof.length} hashes):</h4>
                {proof.map((hash, idx) => (
                  <div key={idx} className="bg-slate-800 rounded-lg p-3 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Step {idx + 1}</span>
                    <code className="mono text-xs text-purple-400">{hash.substring(0, 32)}...</code>
                  </div>
                ))}
                
                <div className={`rounded-lg p-4 mt-4 ${proofVerified ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                  <div className="flex items-center gap-2">
                    <span>{proofVerified ? '✅' : '❌'}</span>
                    <span className={proofVerified ? 'text-emerald-400' : 'text-red-400'}>
                      {proofVerified ? 'Proof VERIFIED - Entry exists in tree!' : 'Verification failed'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ============ COMPONENT 4: COMPLIANCE REPORT GENERATOR ============

function ComplianceReportGenerator() {
  const [items, setItems] = useState<ComplianceItem[]>(complianceItems)
  const [selectedFramework, setSelectedFramework] = useState<string>('all')
  const [reportName, setReportName] = useState('')
  const [showPrintView, setShowPrintView] = useState(false)

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  const filteredItems = selectedFramework === 'all' 
    ? items 
    : items.filter(item => item.framework === selectedFramework)

  const frameworks = ['all', ...new Set(items.map(i => i.framework))]

  const stats = useMemo(() => {
    const total = items.length
    const checked = items.filter(i => i.checked).length
    const byFramework = frameworks.slice(1).map(fw => ({
      name: fw,
      total: items.filter(i => i.framework === fw).length,
      checked: items.filter(i => i.framework === fw && i.checked).length
    }))
    return { total, checked, percentage: total > 0 ? ((checked / total) * 100).toFixed(1) : '0', byFramework }
  }, [items, frameworks])

  const generateReport = () => {
    setShowPrintView(true)
    setTimeout(() => window.print(), 100)
  }

  const frameworkColors: Record<string, string> = {
    GDPR: 'text-blue-400',
    SOC2: 'text-purple-400',
    HIPAA: 'text-red-400',
    ISO27001: 'text-amber-400'
  }

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
          <div className="text-3xl font-bold text-white">{stats.checked}/{stats.total}</div>
          <div className="text-sm text-slate-400">Requirements Checked</div>
          <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
          <div className="text-3xl font-bold text-emerald-400">{stats.percentage}%</div>
          <div className="text-sm text-slate-400">Compliance Score</div>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
          <div className="text-3xl font-bold text-cyan-400">{frameworks.length - 1}</div>
          <div className="text-sm text-slate-400">Frameworks Covered</div>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
          <div className="text-3xl font-bold text-purple-400">{stats.total - stats.checked}</div>
          <div className="text-sm text-slate-400">Remaining Items</div>
        </div>
      </div>

      {/* Framework Filter & Actions */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2 flex-wrap">
          {frameworks.map(fw => (
            <button
              key={fw}
              onClick={() => setSelectedFramework(fw)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                selectedFramework === fw
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {fw} {fw !== 'all' && stats.byFramework.find(f => f.name === fw) && 
                `(${stats.byFramework.find(f => f.name === fw)!.checked}/${stats.byFramework.find(f => f.name === fw)!.total})`
              }
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            placeholder="Report name..."
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
          />
          <button
            onClick={generateReport}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 rounded-lg text-sm font-medium transition-all"
          >
            🖨️ Generate Report
          </button>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="divide-y divide-slate-800">
          {filteredItems.map(item => (
            <div 
              key={item.id}
              className={`p-4 hover:bg-slate-800/50 transition-colors cursor-pointer ${item.checked ? 'bg-emerald-500/5' : ''}`}
              onClick={() => toggleItem(item.id)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                  item.checked 
                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                    : 'border-slate-600 hover:border-slate-500'
                }`}>
                  {item.checked && <span className="text-sm">✓</span>}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-medium uppercase ${frameworkColors[item.framework] || 'text-slate-400'}`}>
                      {item.framework}
                    </span>
                    <span className="text-xs text-slate-500">{item.category}</span>
                  </div>
                  <h4 className="text-white font-medium mt-1">{item.requirement}</h4>
                  <p className="text-sm text-slate-400 mt-0.5">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Print View (hidden normally) */}
      {showPrintView && (
        <div className="fixed inset-0 bg-white text-black z-50 p-8 overflow-auto print:block hidden print:block">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Compliance Report</h1>
            <p className="text-gray-600 mb-6">Generated on {new Date().toLocaleDateString()}</p>
            
            <div className="mb-8 p-4 bg-gray-100 rounded-lg">
              <h2 className="font-bold text-lg">Executive Summary</h2>
              <p>Overall Compliance Score: <strong>{stats.percentage}%</strong></p>
              <p>Requirements Met: <strong>{stats.checked}</strong> of <strong>{stats.total}</strong></p>
            </div>

            <h2 className="font-bold text-xl mb-4">Detailed Checklist</h2>
            {items.filter(i => i.checked).map(item => (
              <div key={item.id} className="mb-3 p-3 border-l-4 border-green-500 bg-green-50">
                <strong>[{item.framework}] {item.category}</strong>: {item.requirement}
              </div>
            ))}

            <button 
              onClick={() => setShowPrintView(false)}
              className="mt-8 px-4 py-2 bg-gray-200 rounded"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ============ COMPONENT 5: DECISION PATH EXPLORER ============

function DecisionPathExplorer() {
  const decisions = generateDecisionEvents()
  const [selectedDecision, setSelectedDecision] = useState<DecisionEvent>(decisions[0])
  const [timelinePosition, setTimelinePosition] = useState<number>(decisions.length - 1)
  const [showAlternatives, setShowAlternatives] = useState(true)

  const currentDecision = decisions[timelinePosition] || decisions[0]

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Timeline Scrubber */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <h2 className="text-xl font-bold text-purple-400 mb-4">⏱️ Decision Timeline Explorer</h2>
        
        <div className="relative">
          <input
            type="range"
            min="0"
            max={decisions.length - 1}
            value={timelinePosition}
            onChange={(e) => setTimelinePosition(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            {decisions.map((d, i) => (
              <button
                key={d.id}
                onClick={() => setTimelinePosition(i)}
                className={`transition-colors ${i === timelinePosition ? 'text-purple-400 font-medium' : 'hover:text-slate-300'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 text-center">
          <span className="text-sm text-slate-400">
            Viewing decision at: <span className="text-white font-medium">{new Date(currentDecision.timestamp).toLocaleString()}</span>
          </span>
        </div>
      </div>

      {/* Current Decision Card */}
      <div className="bg-slate-900 rounded-2xl border border-purple-500/30 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-4 border-b border-slate-800">
          <h3 className="font-semibold text-lg text-white">{currentDecision.decision}</h3>
          <p className="text-sm text-slate-400 mt-1">{new Date(currentDecision.timestamp).toLocaleString()}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Chosen Path */}
          <div>
            <h4 className="text-sm font-medium text-emerald-400 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Chosen Path
            </h4>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
              <div className="text-xl font-bold text-emerald-400">{currentDecision.chosenPath}</div>
              <div className="flex items-center gap-4 mt-3">
                <div className="text-sm text-slate-400">Confidence:</div>
                <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                    style={{ width: `${currentDecision.confidence * 100}%` }}
                  />
                </div>
                <div className="text-sm font-mono text-emerald-400">{(currentDecision.confidence * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div>
            <h4 className="text-sm font-medium text-cyan-400 mb-2">💡 Why This Decision?</h4>
            <div className="bg-slate-800/50 rounded-lg p-4 text-slate-300 leading-relaxed">
              {currentDecision.explanation}
            </div>
          </div>

          {/* Alternative Paths */}
          {showAlternatives && currentDecision.alternatives.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-amber-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Alternative Paths Not Taken
                </h4>
                <button
                  onClick={() => setShowAlternatives(!showAlternatives)}
                  className="text-xs text-slate-500 hover:text-white transition-colors"
                >
                  Hide
                </button>
              </div>
              
              <div className="space-y-3">
                {currentDecision.alternatives.map((alt, idx) => (
                  <div key={idx} className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-amber-400">{alt.path}</span>
                      <span className="text-xs text-slate-500">{(alt.probability * 100).toFixed(1)}% probability</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full bg-amber-500/50 rounded-full"
                        style={{ width: `${alt.probability * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-slate-400 italic">Reason: {alt.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!showAlternatives && (
            <button
              onClick={() => setShowAlternatives(true)}
              className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
            >
              Show alternatives →
            </button>
          )}
        </div>
      </div>

      {/* All Decisions List */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <h3 className="font-semibold text-white mb-4">All Decision Events</h3>
        <div className="space-y-2">
          {decisions.map((dec, idx) => (
            <button
              key={dec.id}
              onClick={() => setTimelinePosition(idx)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                idx === timelinePosition 
                  ? 'bg-purple-500/20 border border-purple-500/30' 
                  : 'bg-slate-800/50 hover:bg-slate-800 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-white font-medium">{dec.decision.substring(0, 50)}...</span>
                <span className="text-xs text-slate-400">{(dec.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">→ {dec.chosenPath}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============ COMPONENT 6: ANOMALY DETECTION ENGINE ============

function AnomalyDetectionEngine() {
  const [alerts, setAlerts] = useState<AnomalyAlert[]>(generateAnomalyAlerts())
  const [baselineValue, setBaselineValue] = useState(150)
  const [testValue, setTestValue] = useState(250)
  const [detectionResult, setDetectionResult] = useState<{
    isAnomaly: boolean
    zScore: number
    confidence: number
    type: string
  } | null>(null)

  const detectAnomaly = () => {
    const stdDev = baselineValue * 0.15 // Assume 15% standard deviation
    const zScore = Math.abs(testValue - baselineValue) / stdDev
    const isAnomaly = zScore > 2
    const confidence = Math.min(99, Math.round(zScore * 25))
    
    let type = 'Normal'
    if (zScore > 4) type = 'Statistical Outlier'
    else if (zScore > 3) type = 'Pattern Break'
    else if (zScore > 2) type = 'Confidence Drift'

    setDetectionResult({ isAnomaly, zScore, confidence, type })
  }

  const updateAlertStatus = (id: string, status: AnomalyAlert['status']) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status } : a))
  }

  const typeConfig = {
    statistical_outlier: { color: '#ef4444', icon: '📊', label: 'Statistical Outlier' },
    pattern_break: { color: '#f59e0b', icon: '🔄', label: 'Pattern Break' },
    confidence_drift: { color: '#8b5cf6', icon: '📉', label: 'Confidence Drift' }
  }

  const statusConfig = {
    detected: { color: 'bg-blue-500/20 text-blue-400', label: 'Detected' },
    acknowledged: { color: 'bg-amber-500/20 text-amber-400', label: 'Acknowledged' },
    investigating: { color: 'bg-purple-500/20 text-purple-400', label: 'Investigating' },
    false_positive: { color: 'bg-slate-500/20 text-slate-400', label: 'False Positive' },
    resolved: { color: 'bg-emerald-500/20 text-emerald-400', label: 'Resolved' }
  }

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Interactive Detector */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <h2 className="text-xl font-bold text-red-400 mb-4">🔬 ML-Style Anomaly Detection</h2>
        <p className="text-slate-400 text-sm mb-6">Simulate Z-score based anomaly detection</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Baseline Value (μ)</label>
              <input
                type="number"
                value={baselineValue}
                onChange={(e) => setBaselineValue(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-red-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Test Value (x)</label>
              <input
                type="number"
                value={testValue}
                onChange={(e) => setTestValue(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-red-500 outline-none"
              />
            </div>
            <button
              onClick={detectAnomaly}
              className="w-full bg-red-600 hover:bg-red-500 rounded-lg py-3 font-medium transition-colors"
            >
              Run Detection
            </button>
          </div>

          {detectionResult && (
            <div className={`rounded-xl p-6 border ${
              detectionResult.isAnomaly 
                ? 'bg-red-500/10 border-red-500/30' 
                : 'bg-emerald-500/10 border-emerald-500/30'
            }`}>
              <div className="text-center">
                <div className="text-5xl mb-3">{detectionResult.isAnomaly ? '🚨' : '✅'}</div>
                <div className={`text-2xl font-bold ${detectionResult.isAnomaly ? 'text-red-400' : 'text-emerald-400'}`}>
                  {detectionResult.type}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6 text-left">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Z-Score</div>
                    <div className="text-lg font-bold text-white">{detectionResult.zScore.toFixed(2)}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Confidence</div>
                    <div className="text-lg font-bold text-white">{detectionResult.confidence}%</div>
                  </div>
                </div>

                <div className="mt-4 h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${detectionResult.isAnomaly ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ width: `${detectionResult.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <h3 className="font-semibold text-white mb-4">Active Alerts</h3>
        
        <div className="space-y-4">
          {alerts.map(alert => {
            const config = typeConfig[alert.type]
            const status = statusConfig[alert.status]
            
            return (
              <div 
                key={alert.id}
                className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{config.icon}</span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-white">{config.label}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${status.color}`}>{status.label}</span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{alert.description}</p>
                        
                        <div className="flex gap-6 mt-3 text-xs">
                          <div>
                            <span className="text-slate-500">Baseline: </span>
                            <span className="text-slate-300">{alert.baseline}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Actual: </span>
                            <span className="text-red-400">{alert.actual}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Confidence: </span>
                            <span className="text-amber-400">{alert.confidence}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-slate-500 whitespace-nowrap">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  
                  {/* Resolution Actions */}
                  {alert.status !== 'resolved' && alert.status !== 'false_positive' && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700">
                      <button
                        onClick={() => updateAlertStatus(alert.id, 'acknowledged')}
                        className="px-3 py-1.5 bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 rounded text-xs font-medium transition-colors"
                      >
                        Acknowledge
                      </button>
                      <button
                        onClick={() => updateAlertStatus(alert.id, 'investigating')}
                        className="px-3 py-1.5 bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 rounded text-xs font-medium transition-colors"
                      >
                        Investigate
                      </button>
                      <button
                        onClick={() => updateAlertStatus(alert.id, 'false_positive')}
                        className="px-3 py-1.5 bg-slate-600/20 text-slate-400 hover:bg-slate-600/30 rounded text-xs font-medium transition-colors"
                      >
                        False Positive
                      </button>
                      <button
                        onClick={() => updateAlertStatus(alert.id, 'resolved')}
                        className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded text-xs font-medium transition-colors"
                      >
                        Resolve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ============ COMPONENT 7: ACCESS CONTROL SIMULATOR ============

function AccessControlSimulator() {
  const [roles, setRoles] = useState<Role[]>(defaultRoles)
  const [selectedRole, setSelectedRole] = useState<string>('Auditor')
  const [testAction, setTestAction] = useState<keyof Role['permissions']>('deleteLogs')
  const [testResult, setTestResult] = useState<{ allowed: boolean; message: string } | null>(null)
  const [permissionHistory, setPermissionHistory] = useState<PermissionChange[]>([])

  const permissionLabels: Record<keyof Role['permissions'], string> = {
    readLogs: 'Read Audit Logs',
    writeLogs: 'Write Audit Logs',
    deleteLogs: 'Delete Audit Logs',
    manageUsers: 'Manage Users',
    viewReports: 'View Reports',
    exportData: 'Export Data',
    modifyPermissions: 'Modify Permissions',
    systemConfig: 'System Configuration'
  }

  const testAccess = () => {
    const role = roles.find(r => r.name === selectedRole)
    if (!role) return
    
    const hasPermission = role.permissions[testAction]
    setTestResult({
      allowed: hasPermission,
      message: hasPermission 
        ? `✅ ${selectedRole} CAN "${permissionLabels[testAction]}"`
        : `❌ ${selectedRole} CANNOT "${permissionLabels[testAction]}" - Permission denied`
    })

    // Log the test
    setPermissionHistory(prev => [{
      timestamp: new Date().toISOString(),
      role: selectedRole,
      permission: permissionLabels[testAction],
      oldValue: !hasPermission,
      newValue: hasPermission ? 'Allowed' : 'Denied',
      changedBy: 'Current User'
    }, ...prev].slice(0, 20))
  }

  const togglePermission = (roleName: string, permission: keyof Role['permissions']) => {
    setRoles(roles.map(role => {
      if (role.name !== roleName) return role
      
      const oldValue = role.permissions[permission]
      const newValue = !oldValue
      
      setPermissionHistory(prev => [{
        timestamp: new Date().toISOString(),
        role: roleName,
        permission: permissionLabels[permission],
        oldValue,
        newValue: newValue ? 'Granted' : 'Revoked',
        changedBy: 'Current User'
      }, ...prev].slice(0, 20))
      
      return {
        ...role,
        permissions: { ...role.permissions, [permission]: newValue }
      }
    }))
  }

  const currentRole = roles.find(r => r.name === selectedRole)

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Access Test Panel */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <h2 className="text-xl font-bold text-amber-400 mb-4">🛡️ RBAC Permission Simulator</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Select Role</label>
              <select
                value={selectedRole}
                onChange={(e) => { setSelectedRole(e.target.value); setTestResult(null) }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 outline-none"
              >
                {roles.map(role => (
                  <option key={role.name} value={role.name}>{role.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-slate-400 mb-2">Action to Test</label>
              <select
                value={testAction}
                onChange={(e) => setTestAction(e.target.value as keyof Role['permissions'])}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 outline-none"
              >
                {Object.entries(permissionLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={testAccess}
              className="w-full bg-amber-600 hover:bg-amber-500 rounded-lg py-3 font-medium transition-colors"
            >
              Test Access
            </button>
          </div>

          {testResult && (
            <div className={`rounded-xl p-6 border flex items-center justify-center ${
              testResult.allowed 
                ? 'bg-emerald-500/10 border-emerald-500/30' 
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="text-center">
                <div className="text-4xl mb-3">{testResult.allowed ? '✅' : '🚫'}</div>
                <div className={`text-lg font-bold ${testResult.allowed ? 'text-emerald-400' : 'text-red-400'}`}>
                  {testResult.allowed ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
                </div>
                <p className="text-sm text-slate-400 mt-2">{testResult.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 overflow-x-auto">
        <h3 className="font-semibold text-white mb-4">Permission Matrix Editor</h3>
        
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-sm text-slate-400 font-medium">Role</th>
              {(Object.keys(permissionLabels) as Array<keyof Role['permissions']>).map(key => (
                <th key={key} className="text-center py-3 px-2 text-xs text-slate-500 font-medium">
                  {permissionLabels[key]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map(role => (
              <tr key={role.name} className={`border-b border-slate-800 ${role.name === selectedRole ? 'bg-amber-500/5' : ''}`}>
                <td className="py-3 px-4 font-medium text-white">{role.name}</td>
                {(Object.keys(permissionLabels) as Array<keyof Role['permissions']>).map(key => (
                  <td key={key} className="py-3 px-2 text-center">
                    <button
                      onClick={() => togglePermission(role.name, key)}
                      className={`w-8 h-8 rounded-lg transition-all ${
                        role.permissions[key]
                          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                          : 'bg-slate-700/50 text-slate-500 hover:bg-slate-700'
                      }`}
                    >
                      {role.permissions[key] ? '✓' : '✕'}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Permission Change History */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <h3 className="font-semibold text-white mb-4">📜 Permission Change Audit Trail</h3>
        
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {permissionHistory.map((change, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg text-sm">
              <span className="text-slate-500 mono text-xs whitespace-nowrap">
                {new Date(change.timestamp).toLocaleTimeString()}
              </span>
              <span className="font-medium text-white">{change.role}</span>
              <span className="text-slate-400">{change.permission}</span>
              <span className={`${change.newValue === 'Granted' || change.newValue === 'Allowed' ? 'text-emerald-400' : 'text-red-400'}`}>
                {change.oldValue ? '✕' : '✓'} → {change.newValue === 'Granted' || change.newValue === 'Allowed' ? '✓' : '✕'}
              </span>
              <span className="text-slate-500 text-xs ml-auto">by {change.changedBy}</span>
            </div>
          ))}
          
          {permissionHistory.length === 0 && (
            <div className="text-center text-slate-500 py-8">
              No permission changes yet. Use the matrix above or run access tests.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============ COMPONENT 8: BLOCKCHAIN EXPLORER ============

function BlockchainExplorer() {
  const [blocks, setBlocks] = useState<Block[]>([
    {
      index: 0,
      timestamp: new Date(Date.now() - 60000).toISOString(),
      hash: '',
      previousHash: '0'.repeat(64),
      nonce: 0,
      data: 'Genesis Block - SciMSPT Audit Chain Initialized'
    }
  ])
  const [newBlockData, setNewBlockData] = useState('')
  const [isMining, setIsMining] = useState(false)
  const [validationResult, setValidationResult] = useState<{ valid: boolean; message: string } | null>(null)
  const [tamperedIndex, setTamperedIndex] = useState<number | null>(null)
  const [tamperValue, setTamperValue] = useState('')

  useEffect(() => {
    initializeGenesis()
  }, [])

  const initializeGenesis = async () => {
    const genesisHash = await computeSHA256(`${blocks[0].index}${blocks[0].previousHash}${blocks[0].data}${blocks[0].nonce}`)
    setBlocks([{ ...blocks[0], hash: genesisHash }])
  }

  const addBlock = async () => {
    if (!newBlockData.trim() || isMining) return
    
    setIsMining(true)
    setValidationResult(null)
    setTamperedIndex(null)
    
    const previousBlock = blocks[blocks.length - 1]
    const newBlock = await mineBlock(blocks.length, previousBlock.hash, newBlockData, 2)
    
    setBlocks([...blocks, newBlock])
    setNewBlockData('')
    setIsMining(false)
  }

  const validateBlockchain = async () => {
    const result = await validateChain(blocks)
    setValidationResult(result)
  }

  const tamperWithBlock = (index: number) => {
    if (tamperedIndex === index && tamperValue) {
      setBlocks(blocks.map((b, i) => 
        i === index ? { ...b, data: tamperValue } : b
      ))
      setTamperedIndex(null)
      setTamperValue('')
      setValidationResult(null)
    } else {
      setTamperedIndex(index)
      setTamperValue(blocks[index].data)
    }
  }

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Mining Panel */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <h2 className="text-xl font-bold text-cyan-400 mb-4">⛓️ Blockchain Explorer</h2>
        
        <div className="flex gap-3">
          <input
            type="text"
            value={newBlockData}
            onChange={(e) => setNewBlockData(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addBlock()}
            placeholder="Enter block data..."
            disabled={isMining}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 outline-none disabled:opacity-50"
          />
          <button
            onClick={addBlock}
            disabled={isMining || !newBlockData.trim()}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 rounded-lg font-medium transition-all flex items-center gap-2"
          >
            {isMining ? (
              <>
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Mining...
              </>
            ) : (
              <>⛏️ Mine Block</>
            )}
          </button>
          <button
            onClick={validateBlockchain}
            className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors"
          >
            Validate
          </button>
        </div>
      </div>

      {/* Validation Result */}
      {validationResult && (
        <div className={`rounded-xl p-4 border ${
          validationResult.valid 
            ? 'bg-emerald-500/10 border-emerald-500/30' 
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{validationResult.valid ? '✅' : '❌'}</span>
            <span className={validationResult.valid ? 'text-emerald-400' : 'text-red-400'}>
              {validationResult.message}
            </span>
          </div>
        </div>
      )}

      {/* Blocks Display */}
      <div className="space-y-4">
        {blocks.map((block, idx) => (
          <div 
            key={idx}
            className={`bg-slate-900 rounded-xl border overflow-hidden transition-all ${
              idx === blocks.length - 1 ? 'border-cyan-500/50 pulse-glow' : 'border-slate-800'
            } ${tamperedIndex === idx ? 'border-amber-500/50' : ''}`}
          >
            <div className={`px-4 py-2 flex items-center justify-between ${
              idx === 0 ? 'bg-purple-600/20' : 'bg-slate-800/50'
            }`}>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-slate-700 rounded text-xs font-mono">#{block.index}</span>
                <span className="text-sm text-slate-300">
                  {idx === 0 ? 'Genesis Block' : `Block ${block.index}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">
                  Nonce: <span className="text-cyan-400 font-mono">{block.nonce.toLocaleString()}</span>
                </span>
                <button
                  onClick={() => tamperWithBlock(idx)}
                  className="px-2 py-1 bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 rounded text-xs transition-colors"
                >
                  {tamperedIndex === idx ? 'Save' : 'Tamper'}
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              {tamperedIndex === idx ? (
                <input
                  type="text"
                  value={tamperValue}
                  onChange={(e) => setTamperValue(e.target.value)}
                  className="w-full bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 text-amber-200 focus:outline-none"
                  autoFocus
                />
              ) : (
                <p className="text-sm text-slate-300">{block.data}</p>
              )}
              
              <div className="grid md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="text-slate-500 mb-1">Hash</div>
                  <div className="mono text-emerald-400 break-all">{block.hash || 'Computing...'}</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="text-slate-500 mb-1">Previous Hash</div>
                  <div className="mono text-slate-400 break-all">{block.previousHash}</div>
                </div>
              </div>
              
              <div className="text-xs text-slate-500">
                {new Date(block.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {blocks.length === 1 && (
        <div className="text-center py-12 text-slate-500">
          <p>Mine your first block to see the blockchain grow!</p>
          <p className="text-sm mt-2">Each block is cryptographically linked to the previous one.</p>
        </div>
      )}
    </div>
  )
}

// ============ COMPONENT 9: SUBSCRIPTION SECTION ============

function SubscriptionSection() {
  const usageStats = {
    hashVerifications: { used: 234, limit: 1000, unit: 'daily' },
    auditExports: { used: 3, limit: 10, unit: 'daily' },
    complianceReports: { used: 1, limit: 3, unit: 'monthly' }
  }

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Status Banner */}
      <div className="bg-gradient-to-r from-emerald-600/20 via-cyan-600/20 to-blue-600/20 rounded-2xl border border-emerald-500/30 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <span className="text-3xl">✅</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Fully Operational</h2>
            <p className="text-emerald-400">This page is fully functional with real cryptographic computations!</p>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📊 Free Tier Usage</h3>
        
        <div className="space-y-6">
          {Object.entries(usageStats).map(([key, stat]) => {
            const percentage = (stat.used / stat.limit) * 100
            const isNearLimit = percentage > 80
            
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`text-sm font-medium ${isNearLimit ? 'text-amber-400' : 'text-slate-400'}`}>
                    {stat.used.toLocaleString()} / {stat.limit.toLocaleString()} {stat.unit}
                  </span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isNearLimit ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Tier */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white">Free Tier</h3>
            <div className="text-3xl font-bold text-slate-300 mt-2">$0<span className="text-base font-normal text-slate-500">/mo</span></div>
          </div>
          
          <ul className="space-y-3 mb-6">
            {[
              '1,000 hash verifications/day',
              '10 audit log exports/day',
              '3 compliance reports/month',
              'Basic anomaly detection',
              'Standard blockchain features',
              'Community support'
            ].map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                <span className="text-emerald-400">✓</span>
                {feature}
              </li>
            ))}
          </ul>
          
          <div className="text-center py-3 bg-slate-800 rounded-lg text-slate-400 font-medium">
            Current Plan
          </div>
        </div>

        {/* PRO Tier */}
        <div className="bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 rounded-2xl border border-emerald-500/50 p-6 relative overflow-hidden">
          <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500 rounded-full text-xs font-bold text-black">
            PRO
          </div>
          
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white">Professional</h3>
            <div className="text-3xl font-bold text-emerald-400 mt-2">$19<span className="text-base font-normal text-slate-400">/mo</span></div>
          </div>
          
          <ul className="space-y-3 mb-6">
            {[
              'Unlimited everything',
              'Custom compliance frameworks',
              'Advanced ML anomaly detection',
              'Real-time monitoring alerts',
              'Priority support',
              'API access',
              'Team collaboration',
              'Custom branding'
            ].map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-slate-200">
                <span className="text-emerald-400">★</span>
                {feature}
              </li>
            ))}
          </ul>
          
          <a
            href="https://github.com/sponsors/testdemoqwenai2025-creator"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 rounded-lg text-white font-bold transition-all"
          >
            Upgrade to PRO →
          </a>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">✨ What You Get Today (Free)</h3>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: '🔐', title: 'Real SHA-256', desc: 'Web Crypto API hashing' },
            { icon: '📡', title: 'Live Stream', desc: 'Auto-updating audit logs' },
            { icon: '🌳', title: 'Merkle Trees', desc: 'Build & verify trees' },
            { icon: '📋', title: 'Compliance', desc: 'GDPR/SOC2/HIPAA/ISO' },
            { icon: '🔀', title: 'Decisions', desc: 'Path explorer with reasons' },
            { icon: '🚨', title: 'Anomalies', desc: 'ML-style detection' },
            { icon: '🛡️', title: 'RBAC', desc: 'Permission simulator' },
            { icon: '⛓️', title: 'Blockchain', desc: 'Mine & validate blocks' },
            { icon: '🖨️', title: 'Export', desc: 'CSV/JSON downloads' }
          ].map((feature, idx) => (
            <div key={idx} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-emerald-500/30 transition-colors">
              <div className="text-2xl mb-2">{feature.icon}</div>
              <div className="font-medium text-white text-sm">{feature.title}</div>
              <div className="text-xs text-slate-400 mt-1">{feature.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
// Fixed Mon Aug 24 14:21:36 UTC 2026
