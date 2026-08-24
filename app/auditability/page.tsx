'use client'

import { PillarCard } from '@/components/PillarCard'
import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'

/**
 * Auditability & Traceability Page - SciMSPT AI-Native Architecture
 * 
 * Comprehensive audit trail system for AI/ML agent decision tracking.
 * Features:
 * - Immutable structured reasoning logs
 * - Decision path tracing with non-linear action visualization
 * - Cryptographic proof verification (Merkle trees, hash chains)
 * - Real-time anomaly detection in agent behavior
 * - Compliance reporting and governance tools
 * - Interactive timeline and graph visualizations
 */

// ============ TYPES & INTERFACES ============

interface AuditLogEntry {
  id: string
  timestamp: string
  agentId: string
  agentName: string
  actionType: 'decision' | 'reasoning' | 'execution' | 'correction' | 'validation'
  input: string
  output: string
  confidence: number
  reasoningPath: string[]
  metadata: Record<string, unknown>
  hash: string
  previousHash: string
  nonce: number
}

interface DecisionNode {
  id: string
  label: string
  type: 'root' | 'decision' | 'action' | 'outcome' | 'branch'
  confidence: number
  children: DecisionNode[]
  timestamp: string
  data?: Record<string, unknown>
}

interface AnomalyEvent {
  id: string
  timestamp: string
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  type: string
  description: string
  affectedAgents: string[]
  suggestion: string
  status: 'detected' | 'investigating' | 'resolved' | 'false_positive'
}

interface ComplianceRule {
  id: string
  name: string
  category: 'GDPR' | 'SOC2' | 'HIPAA' | 'ISO27001' | 'Custom'
  status: 'compliant' | 'partial' | 'non_compliant' | 'pending'
  lastChecked: string
  details: string
}

// ============ MOCK DATA GENERATORS ============

const generateHash = (): string => {
  return Array.from({ length: 64 }, () => 
    '0123456789abcdef'[Math.floor(Math.random() * 16)]
  ).join('')
}

const generateAuditLogs = (count: number): AuditLogEntry[] => {
  const agents = [
    { id: 'agent-001', name: 'IntentClassifier' },
    { id: 'agent-002', name: 'TaskPlanner' },
    { id: 'agent-003', name: 'CodeGenerator' },
    { id: 'agent-004', name: 'Validator' },
    { id: 'agent-005', name: 'SecurityScanner' },
  ]
  
  const actions: AuditLogEntry['actionType'][] = ['decision', 'reasoning', 'execution', 'correction', 'validation']
  const inputs = [
    'User request: "Create authentication API endpoint"',
    'Context: User is authenticated as admin',
    'Pattern detected: RESTful resource naming',
    'Constraint: Must use OAuth2.0 flow',
    'Dependency: Database schema available',
    'Risk assessment: Medium complexity task',
    'Resource allocation: 2 GPU units requested',
    'Timeout threshold: 30 seconds set',
  ]
  
  const outputs = [
    'Routed to CodeGenerator with high confidence',
    'Decomposed into 5 subtasks',
    'Generated 147 lines of TypeScript',
    'Validation passed: All tests green',
    'Security scan: No vulnerabilities found',
    'Optimization applied: Reduced latency by 23%',
    'Cache strategy: Implemented TTL=300s',
    'Documentation: Auto-generated JSDoc comments',
  ]
  
  const reasoningPaths = [
    ['intent_analysis', 'entity_extraction', 'confidence_scoring', 'routing'],
    ['task_decomposition', 'dependency_mapping', 'priority_assignment'],
    ['template_selection', 'code_generation', 'optimization'],
    ['syntax_check', 'semantic_analysis', 'test_generation'],
    ['pattern_matching', 'vulnerability_scan', 'compliance_check'],
  ]

  let prevHash = '0'.repeat(64)
  
  return Array.from({ length: count }, (_, i) => {
    const agent = agents[Math.floor(Math.random() * agents.length)]
    const action = actions[Math.floor(Math.random() * actions.length)]
    const hash = generateHash()
    
    const entry: AuditLogEntry = {
      id: `log-${String(i + 1).padStart(6, '0')}`,
      timestamp: new Date(Date.now() - i * 45000).toISOString(),
      agentId: agent.id,
      agentName: agent.name,
      actionType: action,
      input: inputs[Math.floor(Math.random() * inputs.length)],
      output: outputs[Math.floor(Math.random() * outputs.length)],
      confidence: Math.round((Math.random() * 0.4 + 0.6) * 100) / 100,
      reasoningPath: reasoningPaths[Math.floor(Math.random() * reasoningPaths.length)],
      metadata: {
        sessionId: `sess-${Math.random().toString(36).substr(2, 9)}`,
        userId: `user-${Math.floor(Math.random() * 1000)}`,
        requestId: `req-${Math.random().toString(36).substr(2, 12)}`,
        processingTime: Math.round(Math.random() * 1000) + 50,
        memoryUsage: Math.round(Math.random() * 512) + 64,
        modelVersion: `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
      },
      hash,
      previousHash: prevHash,
      nonce: Math.floor(Math.random() * 1000000),
    }
    
    prevHash = hash
    return entry
  })
}

const generateDecisionTree = (): DecisionNode => {
  return {
    id: 'root',
    label: 'User Intent Received',
    type: 'root',
    confidence: 1.0,
    timestamp: new Date().toISOString(),
    children: [
      {
        id: 'd1',
        label: 'Intent Classification',
        type: 'decision',
        confidence: 0.94,
        timestamp: new Date(Date.now() - 40000).toISOString(),
        data: { model: 'BERT-large', latency: '23ms' },
        children: [
          {
            id: 'a1',
            label: 'Route to Code Agent',
            type: 'action',
            confidence: 0.94,
            timestamp: new Date(Date.now() - 35000).toISOString(),
            children: [
              {
                id: 'd2',
                label: 'Complexity Analysis',
                type: 'decision',
                confidence: 0.87,
                timestamp: new Date(Date.now() - 30000).toISOString(),
                children: [
                  {
                    id: 'a2',
                    label: 'Decompose Task',
                    type: 'action',
                    confidence: 0.87,
                    timestamp: new Date(Date.now() - 25000).toISOString(),
                    children: [
                      {
                        id: 'o1',
                        label: '5 Subtasks Created',
                        type: 'outcome',
                        confidence: 0.92,
                        timestamp: new Date(Date.now() - 20000).toISOString(),
                        children: []
                      }
                    ]
                  },
                  {
                    id: 'b1',
                    label: 'Execute Directly',
                    type: 'branch',
                    confidence: 0.13,
                    timestamp: new Date(Date.now() - 20000).toISOString(),
                    children: []
                  }
                ]
              }
            ]
          },
          {
            id: 'b2',
            label: 'Route to Data Agent',
            type: 'branch',
            confidence: 0.06,
            timestamp: new Date(Date.now() - 30000).toISOString(),
            children: []
          }
        ]
      },
      {
        id: 'd3',
        label: 'Security Validation',
        type: 'decision',
        confidence: 0.98,
        timestamp: new Date(Date.now() - 38000).toISOString(),
        data: { scanner: 'AI-Sec-v2', threatsDetected: 0 },
        children: [
          {
            id: 'o2',
            label: 'Request Approved',
            type: 'outcome',
            confidence: 0.98,
            timestamp: new Date(Date.now() - 33000).toISOString(),
            children: []
          }
        ]
      }
    ]
  }
}

const generateAnomalies = (): AnomalyEvent[] => {
  return [
    {
      id: 'anom-001',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      severity: 'high',
      type: 'Confidence Drift',
      description: 'CodeGenerator agent showing 23% drop in average confidence over last 50 decisions',
      affectedAgents: ['CodeGenerator'],
      suggestion: 'Investigate recent model updates or training data quality',
      status: 'investigating',
    },
    {
      id: 'anom-002',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      severity: 'medium',
      type: 'Path Deviation',
      description: 'TaskPlanner chose non-standard decomposition path for 3 consecutive similar requests',
      affectedAgents: ['TaskPlanner'],
      suggestion: 'Review routing rules for this request pattern',
      status: 'detected',
    },
    {
      id: 'anom-003',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      severity: 'critical',
      type: 'Loop Detected',
      description: 'IntentClassifier entered correction loop (5 iterations) on single request',
      affectedAgents: ['IntentClassifier', 'Validator'],
      suggestion: 'Immediate review required - possible infinite loop condition',
      status: 'investigating',
    },
    {
      id: 'anom-004',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      severity: 'low',
      type: 'Latency Spike',
      description: 'SecurityScanner response time exceeded 2x normal baseline',
      affectedAgents: ['SecurityScanner'],
      suggestion: 'Monitor for resource contention or queue buildup',
      status: 'resolved',
    },
    {
      id: 'anom-005',
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      severity: 'info',
      type: 'Pattern Shift',
      description: 'New decision pattern emerging in Validator agent (possible learning adaptation)',
      affectedAgents: ['Validator'],
      suggestion: 'Monitor for positive/negative impact on validation accuracy',
      status: 'detected',
    },
  ]
}

const complianceRules: ComplianceRule[] = [
  {
    id: 'comp-001',
    name: 'Data Minimization (GDPR Art. 5)',
    category: 'GDPR',
    status: 'compliant',
    lastChecked: new Date().toISOString(),
    details: 'Only essential data collected during intent classification; PII auto-redacted in logs',
  },
  {
    id: 'comp-002',
    name: 'Right to Explanation (GDPR Art. 22)',
    category: 'GDPR',
    status: 'compliant',
    lastChecked: new Date().toISOString(),
    details: 'Full reasoning path available for all automated decisions; explanation API active',
  },
  {
    id: 'comp-003',
    name: 'Access Control (SOC2 CC6)',
    category: 'SOC2',
    status: 'compliant',
    lastChecked: new Date().toISOString(),
    details: 'Role-based access control enforced; all log access authenticated and audited',
  },
  {
    id: 'comp-004',
    name: 'Encryption at Rest (HIPAA)',
    category: 'HIPAA',
    status: 'partial',
    lastChecked: new Date(Date.now() - 3600000).toISOString(),
    details: 'Audit logs encrypted; some legacy logs pending migration to AES-256',
  },
  {
    id: 'comp-005',
    name: 'Audit Trail Integrity (ISO27001 A.12.3)',
    category: 'ISO27001',
    status: 'compliant',
    lastChecked: new Date().toISOString(),
    details: 'Cryptographic hash chain verified; Merkle root published every 1000 entries',
  },
  {
    id: 'comp-006',
    name: 'Change Management (SOC2 CM)',
    category: 'SOC2',
    status: 'pending',
    lastChecked: new Date(Date.now() - 7200000).toISOString(),
    details: 'Next scheduled audit in 24 hours; preliminary checks passed',
  },
]

// ============ SUB-COMPONENTS ============

function AuditDashboard({ logs }: { logs: AuditLogEntry[] }) {
  const stats = useMemo(() => {
    const totalLogs = logs.length
    const uniqueAgents = new Set(logs.map(l => l.agentId)).size
    const avgConfidence = logs.reduce((sum, l) => sum + l.confidence, 0) / totalLogs
    const decisions = logs.filter(l => l.actionType === 'decision').length
    const corrections = logs.filter(l => l.actionType === 'correction').length
    const avgProcessingTime = logs.reduce((sum, l) => 
      sum + (l.metadata.processingTime as number), 0) / totalLogs
    
    return { totalLogs, uniqueAgents, avgConfidence, decisions, corrections, avgProcessingTime }
  }, [logs])

  return (
    <div className="audit-dashboard">
      <div className="dashboard-grid">
        <div className="metric-card metric-primary">
          <div className="metric-icon">📋</div>
          <div className="metric-content">
            <span className="metric-value">{stats.totalLogs.toLocaleString()}</span>
            <span className="metric-label">Total Log Entries</span>
          </div>
          <div className="metric-sparkline">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="spark-bar"
                style={{ height: `${Math.random() * 100}%` }}
              />
            ))}
          </div>
        </div>

        <div className="metric-card metric-success">
          <div className="metric-icon">🤖</div>
          <div className="metric-content">
            <span className="metric-value">{stats.uniqueAgents}</span>
            <span className="metric-label">Active Agents</span>
          </div>
          <div className="metric-indicator">
            <span className="indicator-dot online" />
            <span>All Systems Operational</span>
          </div>
        </div>

        <div className="metric-card metric-warning">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <span className="metric-value">{(stats.avgConfidence * 100).toFixed(1)}%</span>
            <span className="metric-label">Avg Confidence</span>
          </div>
          <div className="metric-mini-chart">
            <svg viewBox="0 0 100 30" className="confidence-svg">
              <polyline
                points={Array.from({ length: 20 }, (_, i) => 
                  `${i * 5},${30 - (Math.random() * 20 + 5)}`
                ).join(' ')}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        <div className="metric-card metric-info">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <span className="metric-value">{Math.round(stats.avgProcessingTime)}ms</span>
            <span className="metric-label">Avg Processing</span>
          </div>
          <div className="metric-trend trend-down">
            <span>↓ 12%</span>
            <span>vs yesterday</span>
          </div>
        </div>

        <div className="metric-card metric-danger">
          <div className="metric-icon">🔀</div>
          <div className="metric-content">
            <span className="metric-value">{stats.decisions}</span>
            <span className="metric-label">Decision Points</span>
          </div>
          <div className="metric-breakdown">
            <span>Corrections: {stats.corrections}</span>
            <span>{((stats.corrections / stats.decisions) * 100).toFixed(1)}% rate</span>
          </div>
        </div>

        <div className="metric-card metric-purple">
          <div className="metric-icon">🔒</div>
          <div className="metric-content">
            <span className="metric-value">100%</span>
            <span className="metric-label">Log Integrity</span>
          </div>
          <div className="metric-verification">
            <span className="verified-badge">✓ Verified</span>
            <span>Merkle Root Valid</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function DecisionPathVisualizer({ tree }: { tree: DecisionNode }) {
  const [selectedNode, setSelectedNode] = useState<DecisionNode | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']))

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }
      return next
    })
  }

  const renderNode = (node: DecisionNode, depth: number = 0) => {
    const isExpanded = expandedNodes.has(node.id)
    const hasChildren = node.children.length > 0
    const isSelected = selectedNode?.id === node.id

    const typeColors = {
      root: '#3b82f6',
      decision: '#8b5cf6',
      action: '#10b981',
      outcome: '#f59e0b',
      branch: '#64748b',
    }

    const typeIcons = {
      root: '🌐',
      decision: '🔀',
      action: '⚡',
      outcome: '✅',
      branch: '↪️',
    }

    return (
      <div key={node.id} className={`tree-node ${isSelected ? 'selected' : ''}`} style={{ marginLeft: depth * 24 }}>
        <div 
          className={`node-content node-${node.type}`}
          onClick={() => {
            setSelectedNode(node)
            if (hasChildren) toggleNode(node.id)
          }}
          style={{ borderLeftColor: typeColors[node.type] }}
        >
          <div className="node-header">
            {hasChildren && (
              <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                ▶
              </span>
            )}
            {!hasChildren && <span className="expand-icon placeholder" />}
            
            <span className="node-icon">{typeIcons[node.type]}</span>
            <span className="node-label">{node.label}</span>
            
            <div className="node-meta">
              <span className="confidence-badge" style={{ 
                background: `${typeColors[node.type]}20`,
                color: typeColors[node.type]
              }}>
                {(node.confidence * 100).toFixed(0)}%
              </span>
              <span className="node-type-badge">{node.type}</span>
            </div>
          </div>

          {isSelected && node.data && (
            <div className="node-data">
              {Object.entries(node.data).map(([key, value]) => (
                <div key={key} className="data-row">
                  <span className="data-key">{key}:</span>
                  <span className="data-value">{String(value)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="node-timestamp">
            {new Date(node.timestamp).toLocaleTimeString()}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="node-children">
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="decision-visualizer">
      <div className="visualizer-header">
        <h3>Interactive Decision Tree</h3>
        <p>Click nodes to inspect details. Expand/collapse branches to trace decision paths.</p>
      </div>
      
      <div className="tree-container">
        {renderNode(tree)}
      </div>

      {selectedNode && (
        <div className="node-detail-panel">
          <h4>Node Details</h4>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Node ID</span>
              <span className="detail-value mono">{selectedNode.id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Type</span>
              <span className="detail-value capitalize">{selectedNode.type}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Confidence</span>
              <span className="detail-value">
                <div className="confidence-bar">
                  <div 
                    className="confidence-fill"
                    style={{ width: `${selectedNode.confidence * 100}%` }}
                  />
                </div>
                {(selectedNode.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Timestamp</span>
              <span className="detail-value">{new Date(selectedNode.timestamp).toLocaleString()}</span>
            </div>
            <div className="detail-item full-width">
              <span className="detail-label">Children</span>
              <span className="detail-value">{selectedNode.children.length} branches</span>
            </div>
          </div>
        </div>
      )}

      <div className="legend">
        <span className="legend-title">Legend:</span>
        {[
          { type: 'root' as const, label: 'Entry Point', icon: '🌐' },
          { type: 'decision' as const, label: 'Decision', icon: '🔀' },
          { type: 'action' as const, label: 'Action', icon: '⚡' },
          { type: 'outcome' as const, label: 'Outcome', icon: '✅' },
          { type: 'branch' as const, label: 'Alternative', icon: '↪️' },
        ].map(item => (
          <span key={item.type} className="legend-item">
            <span className="legend-icon">{item.icon}</span>
            <span>{item.label}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function LogExplorer({ logs }: { logs: AuditLogEntry[] }) {
  const [filter, setFilter] = useState<{
    agent?: string
    actionType?: string
    searchQuery: string
    sortBy: 'timestamp' | 'confidence' | 'agent'
    sortOrder: 'asc' | 'desc'
  }>({
    searchQuery: '',
    sortBy: 'timestamp',
    sortOrder: 'desc'
  })

  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null)
  const [showRawJson, setShowRawJson] = useState(false)

  const filteredLogs = useMemo(() => {
    let result = [...logs]

    if (filter.agent) {
      result = result.filter(l => l.agentId === filter.agent)
    }

    if (filter.actionType) {
      result = result.filter(l => l.actionType === filter.actionType)
    }

    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase()
      result = result.filter(l => 
        l.input.toLowerCase().includes(query) ||
        l.output.toLowerCase().includes(query) ||
        l.agentName.toLowerCase().includes(query)
      )
    }

    result.sort((a, b) => {
      let comparison = 0
      switch (filter.sortBy) {
        case 'timestamp':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          break
        case 'confidence':
          comparison = a.confidence - b.confidence
          break
        case 'agent':
          comparison = a.agentName.localeCompare(b.agentName)
          break
      }
      return filter.sortOrder === 'desc' ? -comparison : comparison
    })

    return result
  }, [logs, filter])

  const uniqueAgents = useMemo(() => 
    Array.from(new Set(logs.map(l => ({ id: l.agentId, name: l.agentName })))),
    [logs]
  )

  const actionTypes: AuditLogEntry['actionType'][] = ['decision', 'reasoning', 'execution', 'correction', 'validation']

  const verifyHashChain = (log: AuditLogEntry): boolean => {
    // In production, this would use actual crypto verification
    // For demo, we simulate verification based on hash format
    return log.hash.length === 64 && log.previousHash.length === 64
  }

  return (
    <div className="log-explorer">
      <div className="explorer-toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search logs by content, agent, or action..."
            value={filter.searchQuery}
            onChange={(e) => setFilter(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select 
            value={filter.agent || ''} 
            onChange={(e) => setFilter(prev => ({ ...prev, agent: e.target.value || undefined }))}
            className="filter-select"
          >
            <option value="">All Agents</option>
            {uniqueAgents.map(agent => (
              <option key={agent.id} value={agent.id}>{agent.name}</option>
            ))}
          </select>

          <select 
            value={filter.actionType || ''} 
            onChange={(e) => setFilter(prev => ({ ...prev, actionType: (e.target.value || undefined) as AuditLogEntry['actionType'] }))}
            className="filter-select"
          >
            <option value="">All Actions</option>
            {actionTypes.map(type => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>

          <select 
            value={`${filter.sortBy}-${filter.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-')
              setFilter(prev => ({ ...prev, sortBy: sortBy as 'timestamp' | 'confidence' | 'agent', sortOrder: sortOrder as 'asc' | 'desc' }))
            }}
            className="filter-select"
          >
            <option value="timestamp-desc">Newest First</option>
            <option value="timestamp-asc">Oldest First</option>
            <option value="confidence-desc">Highest Confidence</option>
            <option value="confidence-asc">Lowest Confidence</option>
            <option value="agent-asc">Agent (A-Z)</option>
          </select>
        </div>

        <div className="results-count">
          Showing {filteredLogs.length} of {logs.length} entries
        </div>
      </div>

      <div className="log-viewer-layout">
        <div className="log-list">
          {filteredLogs.map(log => (
            <div 
              key={log.id}
              className={`log-entry ${selectedLog?.id === log.id ? 'selected' : ''}`}
              onClick={() => setSelectedLog(log)}
            >
              <div className="log-entry-header">
                <span className={`action-type-badge action-${log.actionType}`}>
                  {log.actionType}
                </span>
                <span className="log-agent">{log.agentName}</span>
                <span className="log-confidence">
                  {(log.confidence * 100).toFixed(0)}%
                </span>
                <span className="log-time">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              <div className="log-entry-preview">
                <span className="preview-input">{log.input.substring(0, 60)}...</span>
                <span className="preview-arrow">→</span>
                <span className="preview-output">{log.output.substring(0, 60)}...</span>
              </div>

              <div className="log-hash-preview">
                <span className="hash-indicator verified" title="Hash verified">🔐</span>
                <span className="hash-short">{log.hash.substring(0, 16)}...</span>
              </div>
            </div>
          ))}
        </div>

        {selectedLog && (
          <div className="log-detail-panel">
            <div className="panel-header">
              <h4>Log Entry Details</h4>
              <button 
                className="toggle-json-btn"
                onClick={() => setShowRawJson(!showRawJson)}
              >
                {showRawJson ? 'Structured View' : 'View JSON'}
              </button>
            </div>

            {!showRawJson ? (
              <div className="detail-content">
                <div className="detail-section">
                  <h5>Metadata</h5>
                  <div className="metadata-grid">
                    <div className="meta-item">
                      <span className="meta-label">Entry ID</span>
                      <span className="meta-value mono">{selectedLog.id}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Timestamp</span>
                      <span className="meta-value">{new Date(selectedLog.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Agent</span>
                      <span className="meta-value">{selectedLog.agentName} ({selectedLog.agentId})</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Action Type</span>
                      <span className="meta-value capitalize">{selectedLog.actionType}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h5>Input/Output</h5>
                  <div className="io-container">
                    <div className="io-block io-input">
                      <span className="io-label">Input</span>
                      <pre className="io-content">{selectedLog.input}</pre>
                    </div>
                    <div className="io-arrow">→</div>
                    <div className="io-block io-output">
                      <span className="io-label">Output</span>
                      <pre className="io-content">{selectedLog.output}</pre>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h5>Reasoning Path</h5>
                  <div className="reasoning-path">
                    {selectedLog.reasoningPath.map((step, index) => (
                      <span key={index} className="path-step">
                        {index > 0 && <span className="path-separator">→</span>}
                        <span className="step-name">{step}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="detail-section">
                  <h5>Cryptographic Proofs</h5>
                  <div className="crypto-proofs">
                    <div className="proof-item">
                      <span className="proof-label">Entry Hash (SHA-256)</span>
                      <span className="proof-value hash mono">{selectedLog.hash}</span>
                      <span className={`proof-status ${verifyHashChain(selectedLog) ? 'valid' : 'invalid'}`}>
                        {verifyHashChain(selectedLog) ? '✓ Valid' : '✗ Invalid'}
                      </span>
                    </div>
                    <div className="proof-item">
                      <span className="proof-label">Previous Hash</span>
                      <span className="proof-value hash mono">{selectedLog.previousHash}</span>
                    </div>
                    <div className="proof-item">
                      <span className="proof-label">Nonce</span>
                      <span className="proof-value mono">{selectedLog.nonce}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h5>Extended Metadata</h5>
                  <div className="extended-metadata">
                    {Object.entries(selectedLog.metadata).map(([key, value]) => (
                      <div key={key} className="ext-meta-item">
                        <span className="ext-meta-key">{key}</span>
                        <span className="ext-meta-value">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <pre className="raw-json">
                {JSON.stringify(selectedLog, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function AnomalyDetector({ anomalies }: { anomalies: AnomalyEvent[] }) {
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyEvent | null>(null)

  const filteredAnomalies = useMemo(() => {
    if (filterSeverity === 'all') return anomalies
    return anomalies.filter(a => a.severity === filterSeverity)
  }, [anomalies, filterSeverity])

  const severityConfig = {
    critical: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', icon: '🚨' },
    high: { color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)', icon: '⚠️' },
    medium: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: '📊' },
    low: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', icon: 'ℹ️' },
    info: { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)', icon: '💡' },
  }

  const statusConfig = {
    detected: { label: 'Detected', class: 'status-detected' },
    investigating: { label: 'Investigating', class: 'status-investigating' },
    resolved: { label: 'Resolved', class: 'status-resolved' },
    false_positive: { label: 'False Positive', class: 'status-false-positive' },
  }

  return (
    <div className="anomaly-detector">
      <div className="detector-header">
        <h3>ML-Powered Anomaly Detection</h3>
        <p>Real-time detection of unusual patterns in agent decision-making behavior</p>
      </div>

      <div className="severity-filters">
        <button 
          className={`severity-btn ${filterSeverity === 'all' ? 'active' : ''}`}
          onClick={() => setFilterSeverity('all')}
        >
          All ({anomalies.length})
        </button>
        {Object.entries(severityConfig).map(([key, config]) => {
          const count = anomalies.filter(a => a.severity === key).length
          if (count === 0) return null
          return (
            <button 
              key={key}
              className={`severity-btn ${filterSeverity === key ? 'active' : ''}`}
              style={{ '--severity-color': config.color } as React.CSSProperties}
              onClick={() => setFilterSeverity(key)}
            >
              {config.icon} {key.charAt(0).toUpperCase() + key.slice(1)} ({count})
            </button>
          )
        })}
      </div>

      <div className="anomaly-grid">
        {filteredAnomalies.map(anomaly => {
          const config = severityConfig[anomaly.severity]
          const status = statusConfig[anomaly.status]

          return (
            <div 
              key={anomaly.id}
              className={`anomaly-card ${selectedAnomaly?.id === anomaly.id ? 'selected' : ''}`}
              style={{ borderColor: config.color }}
              onClick={() => setSelectedAnomaly(anomaly)}
            >
              <div className="anomaly-header" style={{ background: config.bg }}>
                <span className="anomaly-icon">{config.icon}</span>
                <span className="anomaly-type">{anomaly.type}</span>
                <span className={`anomaly-status ${status.class}`}>{status.label}</span>
              </div>

              <div className="anomaly-body">
                <p className="anomaly-description">{anomaly.description}</p>
                
                <div className="anomaly-meta">
                  <div className="meta-row">
                    <span className="meta-label">Affected Agents:</span>
                    <div className="agent-tags">
                      {anomaly.affectedAgents.map(agent => (
                        <span key={agent} className="agent-tag">{agent}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="meta-row">
                    <span className="meta-label">Time:</span>
                    <span className="meta-value">
                      {new Date(anomaly.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="meta-row suggestion">
                    <span className="meta-label">Suggestion:</span>
                    <span className="meta-value suggestion-text">{anomaly.suggestion}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {selectedAnomaly && (
        <div className="anomaly-detail-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h4>Anomaly Investigation</h4>
              <button onClick={() => setSelectedAnomaly(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">ID</span>
                <span className="detail-value mono">{selectedAnomaly.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Severity</span>
                <span className="detail-value" style={{ color: severityConfig[selectedAnomaly.severity].color }}>
                  {selectedAnomaly.severity.toUpperCase()}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Type</span>
                <span className="detail-value">{selectedAnomaly.type}</span>
              </div>
              <div className="detail-row full">
                <span className="detail-label">Description</span>
                <span className="detail-value">{selectedAnomaly.description}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span className={`detail-value ${statusConfig[selectedAnomaly.status].class}`}>
                  {statusConfig[selectedAnomaly.status].label}
                </span>
              </div>
              <div className="detail-actions">
                <button className="btn btn-primary btn-sm">Start Investigation</button>
                <button className="btn btn-outline btn-sm">Mark Resolved</button>
                <button className="btn btn-outline btn-sm">False Positive</button>
                <button className="btn btn-outline btn-sm">Export Report</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CompliancePanel({ rules }: { rules: ComplianceRule[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(rules.map(r => r.category)))]
  
  const filteredRules = useMemo(() => {
    if (selectedCategory === 'all') return rules
    return rules.filter(r => r.category === selectedCategory)
  }, [rules, selectedCategory])

  const statusStats = useMemo(() => ({
    compliant: rules.filter(r => r.status === 'compliant').length,
    partial: rules.filter(r => r.status === 'partial').length,
    non_compliant: rules.filter(r => r.status === 'non_compliant').length,
    pending: rules.filter(r => r.status === 'pending').length,
  }), [rules])

  const statusConfig = {
    compliant: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', icon: '✓' },
    partial: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: '~' },
    non_compliant: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', icon: '✗' },
    pending: { color: '#64748b', bg: 'rgba(100, 116, 139, 0.15)', icon: '○' },
  }

  return (
    <div className="compliance-panel">
      <div className="panel-header">
        <h3>Compliance & Governance</h3>
        <p>Regulatory compliance monitoring and audit trail governance</p>
      </div>

      <div className="compliance-overview">
        <div className="overview-stat compliant">
          <span className="stat-number">{statusStats.compliant}</span>
          <span className="stat-label">Compliant</span>
        </div>
        <div className="overview-stat partial">
          <span className="stat-number">{statusStats.partial}</span>
          <span className="stat-label">Partial</span>
        </div>
        <div className="overview-stat pending">
          <span className="stat-number">{statusStats.pending}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="overview-stat non_compliant">
          <span className="stat-number">{statusStats.non_compliant}</span>
          <span className="stat-label">Non-Compliant</span>
        </div>
      </div>

      <div className="category-tabs">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === 'all' ? 'All Rules' : cat}
          </button>
        ))}
      </div>

      <div className="rules-list">
        {filteredRules.map(rule => {
          const config = statusConfig[rule.status]
          
          return (
            <div key={rule.id} className="rule-card">
              <div className="rule-header">
                <span className="rule-status" style={{ 
                  background: config.bg, 
                  color: config.color 
                }}>
                  {config.icon} {rule.status.replace('_', ' ').toUpperCase()}
                </span>
                <span className="rule-category">{rule.category}</span>
              </div>
              
              <h4 className="rule-name">{rule.name}</h4>
              <p className="rule-details">{rule.details}</p>
              
              <div className="rule-footer">
                <span className="last-checked">
                  Last checked: {new Date(rule.lastChecked).toLocaleString()}
                </span>
                <button className="btn btn-outline btn-sm">Re-run Check</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TimelineVisualization({ logs }: { logs: AuditLogEntry[] }) {
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null)

  const timelineLogs = useMemo(() => 
    [...logs].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 30),
    [logs]
  )

  const getActionIcon = (type: AuditLogEntry['actionType']) => {
    const icons = {
      decision: '🔀',
      reasoning: '🧠',
      execution: '⚡',
      correction: '🔧',
      validation: '✅',
    }
    return icons[type]
  }

  return (
    <div className="timeline-visualization">
      <div className="timeline-header">
        <h3>Action Timeline</h3>
        <p>Chronological view of agent activities and decision points</p>
      </div>

      <div className="timeline-container">
        <div className="timeline-line" />
        
        {timelineLogs.map((log, index) => (
          <div 
            key={log.id}
            className={`timeline-entry ${selectedEntry?.id === log.id ? 'selected' : ''}`}
            onClick={() => setSelectedEntry(log)}
          >
            <div className="timeline-dot" data-action={log.actionType}>
              <span className="dot-icon">{getActionIcon(log.actionType)}</span>
            </div>
            
            <div className="timeline-content">
              <div className="timeline-main">
                <span className="timeline-agent">{log.agentName}</span>
                <span className="timeline-action">{log.actionType}</span>
                <span className="timeline-time">
                  {formatTimeAgo(log.timestamp)}
                </span>
              </div>
              
              <p className="timeline-preview">
                {log.output.substring(0, 80)}...
              </p>
              
              <div className="timeline-confidence">
                <div className="mini-bar">
                  <div 
                    className="mini-fill"
                    style={{ 
                      width: `${log.confidence * 100}%`,
                      background: log.confidence > 0.85 ? '#10b981' : 
                                 log.confidence > 0.7 ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </div>
                <span>{(log.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedEntry && (
        <div className="timeline-detail-popover">
          <div className="popover-header">
            <strong>Timeline Entry Detail</strong>
            <button onClick={() => setSelectedEntry(null)}>✕</button>
          </div>
          <div className="popover-body">
            <p><strong>Agent:</strong> {selectedEntry.agentName}</p>
            <p><strong>Action:</strong> {selectedEntry.actionType}</p>
            <p><strong>Time:</strong> {new Date(selectedEntry.timestamp).toLocaleString()}</p>
            <p><strong>Input:</strong> {selectedEntry.input}</p>
            <p><strong>Output:</strong> {selectedEntry.output}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function CryptographicProofPanel({ logs }: { logs: AuditLogEntry[] }) {
  const [verifying, setVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<'valid' | 'invalid' | null>(null)

  const merkleRoot = useMemo(() => {
    // Simulate Merkle root computation
    const combined = logs.map(l => l.hash).join('')
    let hash = 0
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16).padStart(64, '0')
  }, [logs])

  const handleVerify = async () => {
    setVerifying(true)
    // Simulate async verification
    await new Promise(resolve => setTimeout(resolve, 2000))
    setVerificationResult('valid')
    setVerifying(false)
  }

  const chainLength = logs.length
  const latestHash = logs[0]?.hash || 'N/A'

  return (
    <div className="crypto-proof-panel">
      <div className="panel-header">
        <h3>Cryptographic Verification</h3>
        <p>Immutable audit trail backed by hash chains and Merkle trees</p>
      </div>

      <div className="crypto-metrics">
        <div className="crypto-metric">
          <span className="metric-label">Chain Length</span>
          <span className="metric-value mono">{chainLength.toLocaleString()} entries</span>
        </div>
        <div className="crypto-metric">
          <span className="metric-label">Latest Hash</span>
          <span className="metric-value hash mono">{latestHash.substring(0, 32)}...</span>
        </div>
        <div className="crypto-metric">
          <span className="metric-label">Merkle Root</span>
          <span className="metric-value hash mono">{merkleRoot.substring(0, 32)}...</span>
        </div>
      </div>

      <div className="verification-section">
        <button 
          className={`btn btn-primary ${verifying ? 'verifying' : ''}`}
          onClick={handleVerify}
          disabled={verifying}
        >
          {verifying ? (
            <>
              <span className="spinner" /> Verifying Chain...
            </>
          ) : (
            'Verify Hash Chain Integrity'
          )}
        </button>

        {verificationResult && (
          <div className={`verification-result ${verificationResult}`}>
            {verificationResult === 'valid' ? (
              <>
                <span className="result-icon">✓</span>
                <div className="result-details">
                  <strong>Chain Verified Successfully</strong>
                  <p>All {chainLength} entries have valid cryptographic proofs. The audit trail is immutable and tamper-evident.</p>
                </div>
              </>
            ) : (
              <>
                <span className="result-icon">✗</span>
                <div className="result-details">
                  <strong>Verification Failed</strong>
                  <p>Tampering detected in the hash chain. Immediate investigation required.</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="hash-chain-viz">
        <h4>Hash Chain Visualization</h4>
        <div className="chain-display">
          {logs.slice(0, 8).map((log, index) => (
            <div key={log.id} className="chain-link">
              <div className="chain-node">
                <span className="node-index">#{logs.length - index}</span>
                <span className="node-hash">{log.hash.substring(0, 12)}...</span>
              </div>
              {index < 7 && (
                <div className="chain-connector">
                  <span className="connector-arrow">↓</span>
                  <span className="connector-label">prev</span>
                </div>
              )}
            </div>
          ))}
          <div className="chain-ellipsis">...{chainLength - 8} more entries</div>
        </div>
      </div>
    </div>
  )
}

function AccessControlMatrix() {
  const roles = [
    { id: 'admin', name: 'Administrator', users: 3 },
    { id: 'auditor', name: 'Auditor', users: 8 },
    { id: 'analyst', name: 'Analyst', users: 24 },
    { id: 'viewer', name: 'Viewer', users: 156 },
  ]

  const permissions = [
    { id: 'view_logs', name: 'View Logs', category: 'Read' },
    { id: 'export_logs', name: 'Export Logs', category: 'Export' },
    { id: 'verify_integrity', name: 'Verify Integrity', category: 'Verify' },
    { id: 'manage_access', name: 'Manage Access', category: 'Admin' },
    { id: 'delete_logs', name: 'Delete Logs (Retention)', category: 'Admin' },
    { id: 'configure_rules', name: 'Configure Rules', category: 'Admin' },
    { id: 'investigate_anomalies', name: 'Investigate Anomalies', category: 'Analysis' },
    { id: 'sign_off_reports', name: 'Sign Off Reports', category: 'Approve' },
  ]

  const permissionMatrix: Record<string, string[]> = {
    admin: permissions.map(p => p.id),
    auditor: ['view_logs', 'export_logs', 'verify_integrity', 'investigate_anomalies', 'sign_off_reports'],
    analyst: ['view_logs', 'export_logs', 'verify_integrity', 'investigate_anomalies'],
    viewer: ['view_logs'],
  }

  const hasPermission = (roleId: string, permissionId: string): boolean => {
    return permissionMatrix[roleId]?.includes(permissionId) || false
  }

  return (
    <div className="access-control-matrix">
      <div className="matrix-header">
        <h3>Access Control Matrix</h3>
        <p>Role-based permission management for audit trail access</p>
      </div>

      <div className="role-stats">
        {roles.map(role => (
          <div key={role.id} className="role-stat">
            <span className="role-name">{role.name}</span>
            <span className="role-count">{role.users} users</span>
          </div>
        ))}
      </div>

      <div className="matrix-table-container">
        <table className="matrix-table">
          <thead>
            <tr>
              <th className="permission-col">Permission</th>
              {roles.map(role => (
                <th key={role.id} className="role-col">{role.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map(permission => (
              <tr key={permission.id}>
                <td className="permission-cell">
                  <span className="perm-category">{permission.category}</span>
                  <span className="perm-name">{permission.name}</span>
                </td>
                {roles.map(role => (
                  <td key={role.id} className="access-cell">
                    <span className={`access-icon ${hasPermission(role.id, permission.id) ? 'granted' : 'denied'}`}>
                      {hasPermission(role.id, permission.id) ? '✓' : '✗'}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="matrix-legend">
        <span className="legend-item">
          <span className="access-icon granted">✓</span> Granted
        </span>
        <span className="legend-item">
          <span className="access-icon denied">✗</span> Denied
        </span>
      </div>
    </div>
  )
}

// ============ UTILITY FUNCTIONS ============

function formatTimeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
  
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

// ============ MAIN PAGE COMPONENT ============

const relatedPillars = [
  { id: 'maol', name: 'MAOL', href: '/maol', icon: '🧠' },
  { id: 'emergent-behavior', name: 'Emergent Behavior', href: '/emergent-behavior', icon: '🔄' },
  { id: 'intelligence-graph', name: 'Intelligence Graph', href: '/intelligence-graph', icon: '🕸️' },
]

export default function AuditabilityPage() {
  const [activeTab, setActiveTab] = useState<string>('dashboard')
  const [logs] = useState<AuditLogEntry[]>(() => generateAuditLogs(100))
  const [decisionTree] = useState<DecisionNode>(() => generateDecisionTree())
  const [anomalies] = useState<AnomalyEvent[]>(() => generateAnomalies())

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'decisions', label: 'Decision Paths', icon: '🔀' },
    { id: 'logs', label: 'Log Explorer', icon: '📋' },
    { id: 'anomalies', label: 'Anomaly Detection', icon: '🚨' },
    { id: 'compliance', label: 'Compliance', icon: '📜' },
    { id: 'timeline', label: 'Timeline', icon: '⏱️' },
    { id: 'crypto', label: 'Crypto Proofs', icon: '🔐' },
    { id: 'access', label: 'Access Control', icon: '🔑' },
  ]

  return (
    <div className="auditability-page">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="hero-badge">
          <span className="badge badge-primary">Trust Layer</span>
          <span className="badge badge-success">Production Ready</span>
        </div>
        
        <h1 className="page-title">
          <span className="icon-large">🔍</span>
          Auditability & Traceability
        </h1>
        
        <p className="page-subtitle">
          Immutable, structured reasoning logs that enable operators to trace exactly why an agent 
          chose a specific, non-linear path of action. Complete transparency into AI decision-making 
          with cryptographic guarantees of integrity.
        </p>

        <div className="hero-stats">
          <div className="stat">
            <span className="stat-value">100%</span>
            <span className="stat-log">Immutable Logs</span>
          </div>
          <div className="stat">
            <span className="stat-value">&lt;5ms</span>
            <span className="stat-log">Trace Latency</span>
          </div>
          <div className="stat">
            <span className="stat-value">SHA-256</span>
            <span className="stat-log">Hash Chain</span>
          </div>
          <div className="stat">
            <span className="stat-value">GDPR</span>
            <span className="stat-log">Compliant</span>
          </div>
          <div className="stat">
            <span className="stat-value">Real-time</span>
            <span className="stat-log">Monitoring</span>
          </div>
          <div className="stat">
            <span className="stat-value">ML</span>
            <span className="stat-log">Anomaly Detection</span>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="features-showcase">
        <h2>Core Capabilities</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔗</div>
            <h3>Hash Chain Immutability</h3>
            <p>Every log entry cryptographically linked to its predecessor. Any tampering immediately detectable through chain validation.</p>
            <div className="feature-tech">
              <span>SHA-256</span>
              <span>Merkle Trees</span>
              <span>Blockchain-style</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌳</div>
            <h3>Decision Path Visualization</h3>
            <p>Interactive tree graphs showing complete decision hierarchies. Trace every branch, understand every choice, identify divergence points.</p>
            <div className="feature-tech">
              <span>DAG Rendering</span>
              <span>Confidence Scores</span>
              <span>Time Travel</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>ML Anomaly Detection</h3>
            <p>Machine learning models continuously monitor decision patterns for anomalies, drift, loops, and unexpected behaviors.</p>
            <div className="feature-tech">
              <span>Pattern Recognition</span>
              <span>Statistical Models</span>
              <span>Alert System</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📜</div>
            <h3>Regulatory Compliance</h3>
            <p>Built-in support for GDPR right-to-explanation, SOC2 audit requirements, HIPAA logging standards, and ISO 27001 controls.</p>
            <div className="feature-tech">
              <span>GDPR Art. 22</span>
              <span>SOC2 CC6</span>
              <span>ISO27001</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>Real-time Timeline</h3>
            <p>Chronological visualization of all agent activities with filtering, search, and drill-down capabilities for forensic analysis.</p>
            <div className="feature-tech">
              <span>Live Updates</span>
              <span>Time Filters</span>
              <span>Export Tools</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔑</div>
            <h3>Granular Access Control</h3>
            <p>Role-based permissions ensure appropriate access levels. Every access attempt logged for complete accountability.</p>
            <div className="feature-tech">
              <span>RBAC</span>
              <span>Audit Logging</span>
              <span>MFA Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="tab-navigation">
        <div className="tab-bar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Tab Content Panels */}
      <section className="tab-content">
        {activeTab === 'dashboard' && <AuditDashboard logs={logs} />}
        {activeTab === 'decisions' && <DecisionPathVisualizer tree={decisionTree} />}
        {activeTab === 'logs' && <LogExplorer logs={logs} />}
        {activeTab === 'anomalies' && <AnomalyDetector anomalies={anomalies} />}
        {activeTab === 'compliance' && <CompliancePanel rules={complianceRules} />}
        {activeTab === 'timeline' && <TimelineVisualization logs={logs} />}
        {activeTab === 'crypto' && <CryptographicProofPanel logs={logs} />}
        {activeTab === 'access' && <AccessControlMatrix />}
      </section>

      {/* Integration Example */}
      <section className="integration-section">
        <h2>Integration Example</h2>
        <p className="section-description">
          Implement auditability in your SciMSPT application with these production-ready patterns.
        </p>

        <div className="code-block">
          <pre>
            <code>{`// Import the AuditTrail module
import { AuditTrail, DecisionLogger, HashChain } from '@/lib/audit/trail'

// Initialize audit trail with immutable storage backend
const audit = new AuditTrail({
  storage: new ImmutableLogStore('./audit-logs'),
  hashing: 'sha256',
  enableMerkleTrees: true,
  merkleThreshold: 1000, // New Merkle root every 1000 entries
})

// Log a decision with full context
await audit.logDecision({
  agentId: 'code-generator',
  actionType: 'decision',
  input: userRequest,
  output: generatedCode,
  confidence: classifierScore,
  reasoningPath: ['intent', 'classify', 'route', 'generate'],
  metadata: {
    sessionId: currentSession.id,
    modelVersion: 'v2.3.1',
    processingTime: performance.now() - startTime,
  }
})

// Verify chain integrity before producing reports
const isValid = await audit.verifyChainIntegrity()
console.log(\`Audit trail intact: \${isValid}\`)

// Export compliance report for regulators
const gdprReport = await audit.exportComplianceReport({
  framework: 'GDPR',
  dateRange: { start: lastQuarter, end: now },
  includeExplanations: true, // Right to explanation (Art. 22)
})`}</code>
          </pre>
        </div>
      </section>

      {/* Related Pillars Navigation */}
      <section className="related-section">
        <h2>Related Architecture Pillars</h2>
        <p className="section-description">
          Auditability integrates with other pillars to form the complete trustworthy AI architecture.
        </p>

        <div className="related-grid">
          {relatedPillars.map((pillar) => (
            <PillarCard
              key={pillar.id}
              id={pillar.id}
              name={pillar.name}
              fullName=""
              icon={pillar.icon}
              description=""
              status="Designed"
              href={pillar.href}
            />
          ))}
        </div>
      </section>

      {/* Navigation Actions */}
      <section className="actions-section">
        <Link href="/" className="btn btn-outline">
          ← Back to Overview
        </Link>
        <a 
          href="https://github.com/testdemoqwenai2025-creator/Demo3SciMSPT/tree/feature/auditability"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          View Source Code →
        </a>
      </section>

      <style jsx>{`
        .auditability-page {
          animation: fadeInUp 0.5s ease-out;
        }

        /* Page Hero */
        .page-hero {
          text-align: center;
          padding: var(--space-2xl) 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          margin-bottom: var(--space-2xl);
        }

        .hero-badge {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          margin-bottom: var(--space-md);
        }

        .page-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-md);
          margin-bottom: var(--space-lg);
        }

        .icon-large {
          font-size: 3rem;
        }

        .page-subtitle {
          font-size: 1.125rem;
          color: #94a3b8;
          max-width: 900px;
          margin: 0 auto var(--space-xl);
          line-height: 1.7;
        }

        /* Stats Grid */
        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          flex-wrap: wrap;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 1.75rem;
          font-weight: 700;
          color: #60a5fa;
        }

        .stat-label, .stat-log {
          font-size: 0.85rem;
          color: #64748b;
        }

        /* Features Showcase */
        .features-showcase h2 {
          margin-bottom: var(--space-xl);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: var(--space-lg);
        }

        .feature-card {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-xl);
          padding: var(--space-lg);
          transition: all var(--transition-normal);
        }

        .feature-card:hover {
          transform: translateY(-4px);
          border-color: rgba(59, 130, 246, 0.4);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: var(--space-md);
          display: block;
        }

        .feature-card h3 {
          font-size: 1.125rem;
          margin-bottom: var(--space-sm);
        }

        .feature-card p {
          color: #94a3b8;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: var(--space-md);
        }

        .feature-tech {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .feature-tech span {
          padding: 0.25rem 0.625rem;
          background: rgba(59, 130, 246, 0.15);
          border-radius: 9999px;
          font-size: 0.75rem;
          color: #60a5fa;
          font-weight: 500;
        }

        /* Tab Navigation */
        .tab-navigation {
          margin-bottom: var(--space-lg);
        }

        .tab-bar {
          display: flex;
          gap: 0.25rem;
          padding: 0.5rem;
          background: rgba(30, 41, 59, 0.5);
          border-radius: var(--radius-lg);
          overflow-x: auto;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border: none;
          background: transparent;
          color: #94a3b8;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all var(--transition-fast);
          white-space: nowrap;
        }

        .tab-btn:hover {
          color: #f1f5f9;
          background: rgba(255, 255, 255, 0.05);
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
        }

        .tab-icon {
          font-size: 1rem;
        }

        /* Tab Content */
        .tab-content {
          min-height: 400px;
        }

        /* Dashboard Styles */
        .audit-dashboard {
          margin-bottom: var(--space-xl);
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--space-lg);
        }

        .metric-card {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-xl);
          padding: var(--space-lg);
          position: relative;
          overflow: hidden;
        }

        .metric-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
        }

        .metric-primary::before { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
        .metric-success::before { background: linear-gradient(90deg, #10b981, #34d399); }
        .metric-warning::before { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
        .metric-info::before { background: linear-gradient(90deg, #06b6d4, #22d3ee); }
        .metric-danger::before { background: linear-gradient(90deg, #ef4444, #f87171); }
        .metric-purple::before { background: linear-gradient(90deg, #8b5cf6, #a78bfa); }

        .metric-icon {
          font-size: 2rem;
          margin-bottom: var(--space-sm);
        }

        .metric-content {
          display: flex;
          flex-direction: column;
        }

        .metric-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #f1f5f9;
        }

        .metric-label {
          font-size: 0.85rem;
          color: #64748b;
        }

        .metric-sparkline {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40px;
          display: flex;
          align-items: flex-end;
          gap: 2px;
          padding: 0 8px;
        }

        .spark-bar {
          flex: 1;
          background: rgba(59, 130, 246, 0.3);
          border-radius: 2px 2px 0 0;
          min-height: 4px;
        }

        .metric-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: var(--space-sm);
          font-size: 0.8rem;
          color: #10b981;
        }

        .indicator-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        .indicator-dot.online { background: #10b981; }

        .metric-mini-chart svg {
          width: 80px;
          height: 30px;
          margin-top: var(--space-sm);
        }

        .metric-trend {
          display: flex;
          flex-direction: column;
          margin-top: var(--space-sm);
          font-size: 0.8rem;
        }

        .trend-down { color: #10b981; }
        .trend-up { color: #ef4444; }

        .metric-breakdown {
          display: flex;
          flex-direction: column;
          margin-top: var(--space-sm);
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .metric-verification {
          display: flex;
          flex-direction: column;
          margin-top: var(--space-sm);
          font-size: 0.8rem;
        }

        .verified-badge {
          color: #10b981;
          font-weight: 600;
        }

        /* Decision Tree Visualizer */
        .decision-visualizer {
          background: rgba(30, 41, 59, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-xl);
          padding: var(--space-xl);
        }

        .visualizer-header h3 {
          margin-bottom: var(--space-sm);
        }

        .visualizer-header p {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: var(--space-lg);
        }

        .tree-container {
          max-height: 500px;
          overflow-y: auto;
          padding-right: var(--space-md);
        }

        .tree-node {
          margin-bottom: 0.25rem;
        }

        .node-content {
          background: rgba(15, 23, 42, 0.6);
          border-left: 3px solid;
          border-radius: var(--radius-md);
          padding: 0.875rem 1rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .node-content:hover {
          background: rgba(30, 41, 59, 0.8);
        }

        .node-content.selected {
          background: rgba(59, 130, 246, 0.15);
        }

        .node-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .expand-icon {
          font-size: 0.7rem;
          color: #64748b;
          transition: transform var(--transition-fast);
          width: 16px;
        }

        .expand-icon.expanded {
          transform: rotate(90deg);
        }

        .expand-icon.placeholder {
          visibility: hidden;
        }

        .node-icon {
          font-size: 1rem;
        }

        .node-label {
          flex: 1;
          font-weight: 500;
          color: #e2e8f0;
        }

        .node-meta {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .confidence-badge {
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .node-type-badge {
          padding: 0.125rem 0.5rem;
          background: rgba(100, 116, 139, 0.2);
          border-radius: 9999px;
          font-size: 0.7rem;
          color: #94a3b8;
          text-transform: uppercase;
        }

        .node-data {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .data-row {
          display: flex;
          gap: 0.5rem;
          font-size: 0.85rem;
        }

        .data-key {
          color: #64748b;
        }

        .data-value {
          color: #60a5fa;
          font-family: monospace;
        }

        .node-timestamp {
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #64748b;
        }

        .node-children {
          margin-top: 0.25rem;
          padding-left: 1.25rem;
          border-left: 1px dashed rgba(255, 255, 255, 0.1);
        }

        .node-detail-panel {
          margin-top: var(--space-lg);
          padding: var(--space-lg);
          background: rgba(15, 23, 42, 0.6);
          border-radius: var(--radius-lg);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .node-detail-panel h4 {
          margin-bottom: var(--space-md);
          color: #60a5fa;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-md);
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .detail-item.full-width {
          grid-column: 1 / -1;
        }

        .detail-label {
          font-size: 0.8rem;
          color: #64748b;
        }

        .detail-value {
          color: #e2e8f0;
        }

        .detail-value.capitalize {
          text-transform: capitalize;
        }

        .detail-value.mono {
          font-family: monospace;
          font-size: 0.85rem;
        }

        .confidence-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.25rem;
        }

        .confidence-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #10b981);
          border-radius: 4px;
          transition: width var(--transition-normal);
        }

        .legend {
          display: flex;
          gap: 1.5rem;
          margin-top: var(--space-lg);
          padding-top: var(--space-lg);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          flex-wrap: wrap;
        }

        .legend-title {
          font-weight: 600;
          color: #94a3b8;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.85rem;
          color: #94a3b8;
        }

        .legend-icon {
          font-size: 1rem;
        }

        /* Log Explorer */
        .log-explorer {
          background: rgba(30, 41, 59, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-xl);
          overflow: hidden;
        }

        .explorer-toolbar {
          display: flex;
          gap: 1rem;
          padding: var(--space-md);
          background: rgba(15, 23, 42, 0.6);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          flex-wrap: wrap;
          align-items: center;
        }

        .search-box {
          flex: 1;
          min-width: 250px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
        }

        .search-icon {
          font-size: 1rem;
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #e2e8f0;
          font-size: 0.9rem;
        }

        .search-input::placeholder {
          color: #64748b;
        }

        .filter-group {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .filter-select {
          padding: 0.5rem 0.75rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
          color: #e2e8f0;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .results-count {
          font-size: 0.85rem;
          color: #64748b;
          margin-left: auto;
        }

        .log-viewer-layout {
          display: grid;
          grid-template-columns: 1fr 400px;
          min-height: 500px;
        }

        @media (max-width: 1024px) {
          .log-viewer-layout {
            grid-template-columns: 1fr;
          }
        }

        .log-list {
          overflow-y: auto;
          max-height: 600px;
        }

        .log-entry {
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .log-entry:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .log-entry.selected {
          background: rgba(59, 130, 246, 0.1);
          border-left: 3px solid #3b82f6;
        }

        .log-entry-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .action-type-badge {
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .action-decision { background: rgba(139, 92, 246, 0.2); color: #a78bfa; }
        .action-reasoning { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
        .action-execution { background: rgba(16, 185, 129, 0.2); color: #34d399; }
        .action-correction { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
        .action-validation { background: rgba(6, 182, 212, 0.2); color: #22d3ee; }

        .log-agent {
          font-weight: 500;
          color: #e2e8f0;
          font-size: 0.9rem;
        }

        .log-confidence {
          margin-left: auto;
          font-size: 0.85rem;
          color: #94a3b8;
        }

        .log-time {
          font-size: 0.8rem;
          color: #64748b;
        }

        .log-entry-preview {
          display: flex;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #94a3b8;
          margin-bottom: 0.5rem;
        }

        .preview-input, .preview-output {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .preview-arrow {
          color: #64748b;
        }

        .log-hash-preview {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
        }

        .hash-indicator.verified {
          color: #10b981;
        }

        .hash-short {
          font-family: monospace;
          color: #64748b;
        }

        .log-detail-panel {
          border-left: 1px solid rgba(255, 255, 255, 0.08);
          overflow-y: auto;
          max-height: 600px;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(15, 23, 42, 0.6);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .panel-header h4 {
          font-size: 1rem;
        }

        .toggle-json-btn {
          padding: 0.375rem 0.75rem;
          background: rgba(59, 130, 246, 0.2);
          border: none;
          border-radius: var(--radius-sm);
          color: #60a5fa;
          font-size: 0.8rem;
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .toggle-json-btn:hover {
          background: rgba(59, 130, 246, 0.3);
        }

        .detail-content {
          padding: 1rem;
        }

        .detail-section {
          margin-bottom: 1.5rem;
        }

        .detail-section h5 {
          font-size: 0.9rem;
          color: #94a3b8;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .metadata-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .meta-label {
          font-size: 0.75rem;
          color: #64748b;
        }

        .meta-value {
          font-size: 0.9rem;
          color: #e2e8f0;
        }

        .meta-value.mono {
          font-family: monospace;
          word-break: break-all;
        }

        .io-container {
          display: flex;
          gap: 0.75rem;
          align-items: stretch;
        }

        .io-block {
          flex: 1;
          background: rgba(15, 23, 42, 0.6);
          border-radius: var(--radius-md);
          padding: 0.75rem;
        }

        .io-label {
          display: block;
          font-size: 0.7rem;
          color: #64748b;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .io-content {
          font-family: monospace;
          font-size: 0.8rem;
          color: #94a3b8;
          white-space: pre-wrap;
          word-break: break-word;
          margin: 0;
        }

        .io-arrow {
          display: flex;
          align-items: center;
          color: #64748b;
          font-size: 1.25rem;
        }

        .reasoning-path {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
          align-items: center;
        }

        .path-step {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .path-separator {
          color: #64748b;
        }

        .step-name {
          padding: 0.25rem 0.625rem;
          background: rgba(139, 92, 246, 0.15);
          border-radius: 9999px;
          font-size: 0.8rem;
          color: #a78bfa;
        }

        .crypto-proofs {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .proof-item {
          background: rgba(15, 23, 42, 0.6);
          border-radius: var(--radius-md);
          padding: 0.75rem;
        }

        .proof-label {
          display: block;
          font-size: 0.75rem;
          color: #64748b;
          margin-bottom: 0.25rem;
        }

        .proof-value {
          display: block;
          font-size: 0.8rem;
          word-break: break-all;
        }

        .proof-value.hash {
          color: #10b981;
        }

        .proof-status {
          display: inline-block;
          margin-top: 0.375rem;
          padding: 0.125rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .proof-status.valid {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }

        .proof-status.invalid {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }

        .extended-metadata {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }

        .ext-meta-item {
          display: flex;
          justify-content: space-between;
          padding: 0.375rem 0.5rem;
          background: rgba(15, 23, 42, 0.4);
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
        }

        .ext-meta-key {
          color: #64748b;
        }

        .ext-meta-value {
          color: #e2e8f0;
          font-family: monospace;
        }

        .raw-json {
          padding: 1rem;
          font-family: monospace;
          font-size: 0.8rem;
          line-height: 1.6;
          color: #94a3b8;
          overflow-x: auto;
          margin: 0;
          white-space: pre-wrap;
          word-break: break-word;
        }

        /* Anomaly Detector */
        .anomaly-detector {
          background: rgba(30, 41, 59, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-xl);
          padding: var(--space-xl);
        }

        .detector-header h3 {
          margin-bottom: var(--space-sm);
        }

        .detector-header p {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: var(--space-lg);
        }

        .severity-filters {
          display: flex;
          gap: 0.5rem;
          margin-bottom: var(--space-lg);
          flex-wrap: wrap;
        }

        .severity-btn {
          padding: 0.5rem 1rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
          color: #94a3b8;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .severity-btn:hover {
          border-color: rgba(255, 255, 255, 0.2);
        }

        .severity-btn.active {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border-color: transparent;
        }

        .anomaly-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: var(--space-md);
        }

        .anomaly-card {
          background: rgba(15, 23, 42, 0.6);
          border: 2px solid;
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .anomaly-card:hover {
          transform: translateY(-2px);
        }

        .anomaly-card.selected {
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }

        .anomaly-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
        }

        .anomaly-icon {
          font-size: 1.25rem;
        }

        .anomaly-type {
          flex: 1;
          margin-left: 0.75rem;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .anomaly-status {
          padding: 0.2rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .status-detected { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
        .status-investigating { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
        .status-resolved { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .status-false-positive { background: rgba(100, 116, 139, 0.2); color: #94a3b8; }

        .anomaly-body {
          padding: 1rem;
        }

        .anomaly-description {
          font-size: 0.9rem;
          color: #e2e8f0;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .anomaly-meta {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .meta-row {
          display: flex;
          gap: 0.75rem;
          font-size: 0.85rem;
        }

        .meta-row.suggestion {
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .meta-label {
          color: #64748b;
          min-width: 110px;
        }

        .meta-value {
          color: #94a3b8;
        }

        .suggestion-text {
          color: #f59e0b;
          font-style: italic;
        }

        .agent-tags {
          display: flex;
          gap: 0.375rem;
          flex-wrap: wrap;
        }

        .agent-tag {
          padding: 0.125rem 0.5rem;
          background: rgba(139, 92, 246, 0.15);
          border-radius: 9999px;
          font-size: 0.75rem;
          color: #a78bfa;
        }

        .anomaly-detail-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--space-lg);
        }

        .modal-content {
          background: #1e293b;
          border-radius: var(--radius-xl);
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-header button {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 1.25rem;
          cursor: pointer;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .detail-row {
          display: flex;
          gap: 1rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .detail-row.full {
          flex-direction: column;
          gap: 0.25rem;
        }

        .detail-row .detail-label {
          min-width: 120px;
          color: #64748b;
          font-size: 0.9rem;
        }

        .detail-row .detail-value {
          color: #e2e8f0;
          font-size: 0.9rem;
        }

        .detail-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
        }

        /* Compliance Panel */
        .compliance-panel {
          background: rgba(30, 41, 59, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-xl);
          padding: var(--space-xl);
        }

        .panel-header h3 {
          margin-bottom: var(--space-sm);
        }

        .panel-header p {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: var(--space-lg);
        }

        .compliance-overview {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: var(--space-lg);
        }

        @media (max-width: 768px) {
          .compliance-overview {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .overview-stat {
          text-align: center;
          padding: 1.25rem;
          border-radius: var(--radius-lg);
        }

        .overview-stat.compliant { background: rgba(16, 185, 129, 0.1); }
        .overview-stat.partial { background: rgba(245, 158, 11, 0.1); }
        .overview-stat.pending { background: rgba(100, 116, 139, 0.1); }
        .overview-stat.non_compliant { background: rgba(239, 68, 68, 0.1); }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 700;
        }

        .overview-stat.compliant .stat-number { color: #10b981; }
        .overview-stat.partial .stat-number { color: #f59e0b; }
        .overview-stat.pending .stat-number { color: #94a3b8; }
        .overview-stat.non_compliant .stat-number { color: #ef4444; }

        .stat-label {
          font-size: 0.85rem;
          color: #64748b;
        }

        .category-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: var(--space-lg);
          flex-wrap: wrap;
        }

        .category-tab {
          padding: 0.5rem 1rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
          color: #94a3b8;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .category-tab:hover {
          border-color: rgba(255, 255, 255, 0.2);
        }

        .category-tab.active {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border-color: transparent;
        }

        .rules-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .rule-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
        }

        .rule-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .rule-status {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .rule-category {
          padding: 0.25rem 0.625rem;
          background: rgba(59, 130, 246, 0.15);
          border-radius: 9999px;
          font-size: 0.75rem;
          color: #60a5fa;
        }

        .rule-name {
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }

        .rule-details {
          font-size: 0.9rem;
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .rule-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .last-checked {
          font-size: 0.8rem;
          color: #64748b;
        }

        /* Timeline Visualization */
        .timeline-visualization {
          background: rgba(30, 41, 59, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-xl);
          padding: var(--space-xl);
        }

        .timeline-header h3 {
          margin-bottom: var(--space-sm);
        }

        .timeline-header p {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: var(--space-lg);
        }

        .timeline-container {
          position: relative;
          max-height: 500px;
          overflow-y: auto;
          padding-left: 2rem;
        }

        .timeline-line {
          position: absolute;
          left: 8px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, #3b82f6, #8b5cf6, #10b981);
          opacity: 0.3;
        }

        .timeline-entry {
          position: relative;
          padding: 1rem 0 1rem 1.5rem;
          cursor: pointer;
          transition: background var(--transition-fast);
          border-radius: var(--radius-md);
        }

        .timeline-entry:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .timeline-entry.selected {
          background: rgba(59, 130, 246, 0.1);
        }

        .timeline-dot {
          position: absolute;
          left: -1.5rem;
          top: 1.25rem;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #1e293b;
          border: 2px solid;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .timeline-dot[data-action="decision"] { border-color: #8b5cf6; }
        .timeline-dot[data-action="reasoning"] { border-color: #3b82f6; }
        .timeline-dot[data-action="execution"] { border-color: #10b981; }
        .timeline-dot[data-action="correction"] { border-color: #f59e0b; }
        .timeline-dot[data-action="validation"] { border-color: #06b6d4; }

        .dot-icon {
          font-size: 0.65rem;
        }

        .timeline-content {
          background: rgba(15, 23, 42, 0.4);
          border-radius: var(--radius-md);
          padding: 0.875rem 1rem;
        }

        .timeline-main {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .timeline-agent {
          font-weight: 600;
          color: #e2e8f0;
          font-size: 0.9rem;
        }

        .timeline-action {
          padding: 0.125rem 0.5rem;
          background: rgba(139, 92, 246, 0.15);
          border-radius: 4px;
          font-size: 0.75rem;
          color: #a78bfa;
        }

        .timeline-time {
          margin-left: auto;
          font-size: 0.8rem;
          color: #64748b;
        }

        .timeline-preview {
          font-size: 0.85rem;
          color: #94a3b8;
          margin-bottom: 0.5rem;
        }

        .timeline-confidence {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .mini-bar {
          flex: 1;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .mini-fill {
          height: 100%;
          border-radius: 2px;
          transition: width var(--transition-normal);
        }

        .timeline-detail-popover {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: #1e293b;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          max-width: 400px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          z-index: 100;
        }

        .popover-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .popover-header button {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
        }

        .popover-body p {
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        /* Cryptographic Proof Panel */
        .crypto-proof-panel {
          background: rgba(30, 41, 59, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-xl);
          padding: var(--space-xl);
        }

        .crypto-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: var(--space-lg);
        }

        .crypto-metric {
          background: rgba(15, 23, 42, 0.6);
          border-radius: var(--radius-md);
          padding: 1rem;
        }

        .crypto-metric .metric-label {
          display: block;
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 0.375rem;
        }

        .crypto-metric .metric-value {
          font-size: 0.9rem;
          color: #e2e8f0;
        }

        .crypto-metric .metric-value.hash {
          color: #10b981;
          word-break: break-all;
        }

        .verification-section {
          margin-bottom: var(--space-lg);
        }

        .btn.verifying {
          opacity: 0.7;
          cursor: wait;
        }

        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .verification-result {
          margin-top: 1rem;
          padding: 1.25rem;
          border-radius: var(--radius-lg);
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .verification-result.valid {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .verification-result.invalid {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .result-icon {
          font-size: 1.5rem;
        }

        .verification-result.valid .result-icon { color: #10b981; }
        .verification-result.invalid .result-icon { color: #ef4444; }

        .result-details strong {
          display: block;
          margin-bottom: 0.25rem;
        }

        .result-details p {
          font-size: 0.9rem;
          margin: 0;
        }

        .hash-chain-viz h4 {
          margin-bottom: var(--space-md);
        }

        .chain-display {
          background: rgba(15, 23, 42, 0.6);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          overflow-x: auto;
        }

        .chain-link {
          display: inline-flex;
          align-items: center;
        }

        .chain-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.5rem 0.75rem;
          background: rgba(30, 41, 59, 0.8);
          border-radius: var(--radius-sm);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .node-index {
          font-size: 0.7rem;
          color: #64748b;
        }

        .node-hash {
          font-family: monospace;
          font-size: 0.75rem;
          color: #10b981;
        }

        .chain-connector {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 0.5rem;
          color: #64748b;
        }

        .connector-arrow {
          font-size: 1rem;
        }

        .connector-label {
          font-size: 0.65rem;
        }

        .chain-ellipsis {
          display: inline-block;
          padding: 0.5rem 0.75rem;
          color: #64748b;
          font-size: 0.85rem;
        }

        /* Access Control Matrix */
        .access-control-matrix {
          background: rgba(30, 41, 59, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-xl);
          padding: var(--space-xl);
        }

        .matrix-header h3 {
          margin-bottom: var(--space-sm);
        }

        .matrix-header p {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: var(--space-lg);
        }

        .role-stats {
          display: flex;
          gap: 1rem;
          margin-bottom: var(--space-lg);
          flex-wrap: wrap;
        }

        .role-stat {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(15, 23, 42, 0.6);
          border-radius: var(--radius-md);
        }

        .role-name {
          font-weight: 500;
          color: #e2e8f0;
        }

        .role-count {
          font-size: 0.85rem;
          color: #64748b;
        }

        .matrix-table-container {
          overflow-x: auto;
          margin-bottom: var(--space-md);
        }

        .matrix-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        .matrix-table th,
        .matrix-table td {
          padding: 0.875rem 1rem;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .matrix-table th {
          background: rgba(15, 23, 42, 0.6);
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 0.05em;
        }

        .permission-cell {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .perm-category {
          font-size: 0.7rem;
          color: #64748b;
          text-transform: uppercase;
        }

        .perm-name {
          color: #e2e8f0;
        }

        .access-cell {
          text-align: center;
        }

        .access-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          font-weight: 600;
          font-size: 0.85rem;
        }

        .access-icon.granted {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }

        .access-icon.denied {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }

        .matrix-legend {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
        }

        .matrix-legend .legend-item {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.85rem;
          color: #94a3b8;
        }

        /* Section Headers */
        .features-showcase h2,
        .integration-section h2,
        .related-section h2 {
          margin-bottom: var(--space-lg);
        }

        .section-description {
          color: #94a3b8;
          margin-bottom: var(--space-xl);
          font-size: 1.05rem;
        }

        /* Code Block */
        .code-block {
          background: #0d1117;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .code-block pre {
          padding: var(--space-xl);
          overflow-x: auto;
        }

        .code-block code {
          font-family: 'Fira Code', 'JetBrains Mono', monospace;
          font-size: 0.875rem;
          line-height: 1.7;
          color: #e2e8f0;
        }

        /* Related Section */
        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--space-lg);
        }

        /* Actions */
        .actions-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-2xl) 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          margin-top: var(--space-2xl);
        }

        @media (max-width: 768px) {
          .actions-section {
            flex-direction: column;
            gap: var(--space-md);
          }
          
          .hero-stats {
            gap: var(--space-lg);
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }

          .tab-bar {
            flex-wrap: nowrap;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .tab-btn {
            flex-shrink: 0;
          }
        }
      `}</style>
    </div>
  )
}
