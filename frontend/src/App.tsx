import { type ReactNode, useCallback, useEffect, useState } from 'react'
import './App.css'

type DashboardSummary = {
  totalServices: number
  activeServices: number
  deployments: number
  failedDeployments: number
  systemHealth: string
  uptime: string
}

type CloudService = {
  id: number
  name: string
  status: string
  environment: string
}

type Deployment = {
  id: number
  application: string
  status: string
  environment: string
}

type ApiStatus = {
  application: string
  status: string
  backend: string
  version: string
  message: string
}

const navigation = [
  { name: 'Overview', icon: '◫' },
  { name: 'Infrastructure', icon: '▦' },
  { name: 'Deployments', icon: '⇧' },
  { name: 'Monitoring', icon: '◉' },
  { name: 'Security & IAM', icon: '⬡' },
  { name: 'Storage', icon: '▤' },
  { name: 'Serverless', icon: 'ϟ' },
  { name: 'Data & ML', icon: '⌘' },
]

const instances = [
  { id: 'i-0c9ef6acc8f2851c4', ip: '172.31.14.19', type: 't3.micro', state: 'Running' },
  { id: 'i-0b92e8ee4bb49dee2', ip: '10.0.1.106', type: 't3.micro', state: 'Running' },
  { id: 'i-07433261770bc69c7', ip: '10.0.2.53', type: 't3.micro', state: 'Running' },
  { id: 'i-04bde80b3aaabc615', ip: '10.0.1.167', type: 't3.micro', state: 'Running' },
]

const buckets = [
  'aws-nginx-website-backup-parth-727',
  'parth-iam-microproject-3',
]

const descriptions: Record<string, string> = {
  Overview: 'Your cloud environment at a glance.',
  Infrastructure: 'Review compute resources and network inventory.',
  Deployments: 'Track application releases recorded by the platform.',
  Monitoring: 'Check application connectivity and platform health.',
  'Security & IAM': 'Review the security controls documented for this environment.',
  Storage: 'Review object storage inventory and backup resources.',
  Serverless: 'Explore the serverless workload area and its integration status.',
  'Data & ML': 'Review platform data and machine-learning readiness.',
}

async function fetchApi<T>(path: string): Promise<T> {
  const response = await fetch(path, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`${path} returned HTTP ${response.status}`)
  }

  return response.json() as Promise<T>
}

function Status({ value }: { value: string }) {
  const normalized = value.toLowerCase()
  const className =
    normalized === 'running' || normalized === 'successful' || normalized === 'up'
      ? 'record-status good'
      : normalized === 'failed' || normalized === 'offline'
        ? 'record-status bad'
        : 'record-status pending'

  return <span className={className}>{value}</span>
}

function Metric({
  label,
  value,
  detail,
  icon,
}: {
  label: string
  value: string | number
  detail: string
  icon: string
}) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className="stat-icon blue">{icon}</span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-foot">{detail}</div>
    </article>
  )
}

function Panel({
  title,
  subtitle,
  tag,
  children,
}: {
  title: string
  subtitle?: string
  tag?: string
  children: ReactNode
}) {
  return (
    <article className="panel">
      <div className="panel-heading">
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {tag && <span className="small-tag">{tag}</span>}
      </div>
      {children}
    </article>
  )
}

function App() {
  const [active, setActive] = useState('Overview')
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [services, setServices] = useState<CloudService[]>([])
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [statusData, summaryData, serviceData, deploymentData] =
        await Promise.all([
          fetchApi<ApiStatus>('/api/status'),
          fetchApi<DashboardSummary>('/api/dashboard/summary'),
          fetchApi<CloudService[]>('/api/services'),
          fetchApi<Deployment[]>('/api/deployments'),
        ])

      setApiStatus(statusData)
      setSummary(summaryData)
      setServices(serviceData)
      setDeployments(deploymentData)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to connect to the CloudOps backend.',
      )
      setApiStatus(null)
      setSummary(null)
      setServices([])
      setDeployments([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadDashboard()
  }, [loadDashboard])

  const activeInstances = instances.filter(
    (instance) => instance.state.toLowerCase() === 'running',
  ).length

  const successfulDeployments = deployments.filter(
    (deployment) => deployment.status.toLowerCase() === 'successful',
  ).length

  const backendUp = apiStatus?.status === 'UP'

  const renderOverview = () => (
    <>
      <div className="notice">
        <span className="notice-icon">i</span>
        <div>
          <strong>{backendUp ? 'Live backend connection established' : 'Backend connection status'}</strong>
          <p>
            {loading
              ? 'Loading dashboard data from Spring Boot and PostgreSQL...'
              : error
                ? `API connection error: ${error}`
                : 'Services, deployments and summary are loaded from your backend API. AWS inventory remains a recorded snapshot.'}
          </p>
        </div>
        <span className="snapshot-date">{loading ? 'LOADING' : error ? 'API ERROR' : 'API CONNECTED'}</span>
      </div>

      <section className="stats-grid">
        <Metric label="EC2 INSTANCES" value={String(activeInstances).padStart(2, '0')} detail={`${activeInstances} recorded running · Snapshot`} icon="▦" />
        <Metric label="VIRTUAL NETWORKS" value="02" detail="1 default · 1 custom VPC · Snapshot" icon="⌘" />
        <Metric label="S3 BUCKETS" value="02" detail="Recorded storage inventory" icon="▤" />
        <Metric label="DEPLOYMENTS" value={loading ? '—' : summary?.deployments ?? '—'} detail={`${successfulDeployments} successful · PostgreSQL`} icon="⇧" />
      </section>

      <section className="content-grid">
        <Panel title="Compute infrastructure" subtitle="Recorded EC2 inventory in ap-south-1" tag="AWS SNAPSHOT">
          <div className="table-wrap">
            <table>
              <thead><tr><th>INSTANCE ID</th><th>PRIVATE IP</th><th>TYPE</th><th>STATUS</th></tr></thead>
              <tbody>
                {instances.map((instance) => (
                  <tr key={instance.id}>
                    <td className="mono">{instance.id}</td>
                    <td className="mono">{instance.ip}</td>
                    <td>{instance.type}</td>
                    <td><Status value={instance.state} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="panel-footer">
            <span>{instances.length} recorded instances</span>
            <button onClick={() => setActive('Infrastructure')}>View infrastructure →</button>
          </div>
        </Panel>

        <Panel title="Platform readiness" subtitle="Application component status" tag="LIVE CHECK">
          <div className="readiness-list">
            {[
              ['React + TypeScript', 'Frontend initialized', true],
              ['Docker Engine', 'Container runtime configured', true],
              ['Terraform', 'Infrastructure applied', true],
              ['Spring Boot API', apiStatus?.message ?? 'Waiting for API response', backendUp],
              ['PostgreSQL database', summary ? 'Database-backed API responding' : 'Waiting for database-backed API', Boolean(summary)],
            ].map(([name, detail, ready]) => (
              <div key={String(name)}>
                <span className={`readiness-icon ${ready ? 'done' : 'pending'}`}>{ready ? '✓' : '○'}</span>
                <div><strong>{name}</strong><small>{detail}</small></div>
                <b className={ready ? 'green-text' : 'pending-text'}>{loading ? 'Checking' : ready ? 'Ready' : 'Unknown'}</b>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="bottom-grid">
        <Panel title="Cloud services" subtitle="Live records from PostgreSQL" tag="DATABASE">
          {loading ? <p className="data-state">Loading services...</p> : services.length === 0 ? <p className="data-state">No service records available.</p> : (
            <div className="live-record-list">
              {services.map((service) => (
                <div className="live-record" key={service.id}>
                  <div><strong>{service.name}</strong><small>{service.environment}</small></div>
                  <Status value={service.status} />
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Recent deployments" subtitle="Live records from PostgreSQL" tag="DATABASE">
          {loading ? <p className="data-state">Loading deployments...</p> : deployments.length === 0 ? <p className="data-state">No deployment records available.</p> : (
            <div className="live-record-list">
              {deployments.map((deployment) => (
                <div className="live-record" key={deployment.id}>
                  <div><strong>{deployment.application}</strong><small>{deployment.environment}</small></div>
                  <Status value={deployment.status} />
                </div>
              ))}
            </div>
          )}
          <div className="panel-footer">
            <span>{summary?.failedDeployments ?? 0} failed deployments</span>
            <button onClick={() => setActive('Deployments')}>View deployments →</button>
          </div>
        </Panel>
      </section>
    </>
  )

  const renderInfrastructure = () => (
    <>
      <div className="notice"><span className="notice-icon">i</span><div><strong>AWS inventory snapshot</strong><p>These instance and network details are recorded project inventory, not a live AWS discovery query.</p></div><span className="snapshot-date">SNAPSHOT</span></div>
      <section className="stats-grid">
        <Metric label="EC2 INSTANCES" value={instances.length} detail={`${activeInstances} recorded as running`} icon="▦" />
        <Metric label="INSTANCE TYPE" value="t3.micro" detail="Recorded instance type" icon="◈" />
        <Metric label="VPC NETWORKS" value="02" detail="Default and custom VPC records" icon="⌘" />
        <Metric label="AWS REGION" value="Mumbai" detail="ap-south-1" icon="◎" />
      </section>
      <Panel title="Compute instances" subtitle="Recorded instance inventory" tag="AWS SNAPSHOT">
        <div className="table-wrap"><table>
          <thead><tr><th>INSTANCE ID</th><th>PRIVATE IP</th><th>TYPE</th><th>STATE</th></tr></thead>
          <tbody>{instances.map((item) => <tr key={item.id}><td className="mono">{item.id}</td><td className="mono">{item.ip}</td><td>{item.type}</td><td><Status value={item.state} /></td></tr>)}</tbody>
        </table></div>
      </Panel>
      <section className="detail-grid">
        <Panel title="Network architecture" subtitle="Recorded project network components">
          <div className="info-list">
            <div><strong>VPC</strong><span>Default VPC and custom VPC recorded</span></div>
            <div><strong>Public subnet</strong><span>10.0.1.0/24 · Recorded project network</span></div>
            <div><strong>Private subnet</strong><span>10.0.2.0/24 · Recorded project network</span></div>
            <div><strong>Region</strong><span>ap-south-1 · Mumbai</span></div>
          </div>
        </Panel>
        <Panel title="Platform components" subtitle="Deployment architecture">
          <div className="info-list">
            <div><strong>Frontend</strong><span>React + TypeScript served by Nginx</span></div>
            <div><strong>Backend</strong><span>Spring Boot API · Internal container port 8080</span></div>
            <div><strong>Database</strong><span>PostgreSQL · Internal Docker network</span></div>
            <div><strong>Container network</strong><span>cloudops-net</span></div>
          </div>
        </Panel>
      </section>
    </>
  )

  const renderDeployments = () => (
    <>
      <div className="stats-grid">
        <Metric label="TOTAL DEPLOYMENTS" value={deployments.length} detail="Live records from PostgreSQL" icon="⇧" />
        <Metric label="SUCCESSFUL" value={successfulDeployments} detail="Successful deployment records" icon="✓" />
        <Metric label="FAILED" value={summary?.failedDeployments ?? '—'} detail="Reported by dashboard API" icon="!" />
        <Metric label="PLATFORM STATUS" value={backendUp ? 'UP' : '—'} detail="Spring Boot API connection" icon="◉" />
      </div>
      <Panel title="Deployment history" subtitle="Deployment records returned by the backend" tag="LIVE API">
        {loading ? <p className="data-state">Loading deployment records...</p> : error ? <p className="data-state">Unable to load deployment records: {error}</p> : deployments.length === 0 ? <p className="data-state">No deployment records found.</p> : (
          <div className="table-wrap"><table>
            <thead><tr><th>ID</th><th>APPLICATION</th><th>ENVIRONMENT</th><th>STATUS</th></tr></thead>
            <tbody>{deployments.map((item) => <tr key={item.id}><td>{item.id}</td><td>{item.application}</td><td>{item.environment}</td><td><Status value={item.status} /></td></tr>)}</tbody>
          </table></div>
        )}
      </Panel>
      <section className="detail-grid">
        <Panel title="Release pipeline" subtitle="Current implementation status">
          <div className="info-list">
            <div><strong>Source checkout</strong><Status value="Configured in Jenkinsfile" /></div>
            <div><strong>Frontend build</strong><Status value="Configured in Jenkinsfile" /></div>
            <div><strong>Backend build</strong><Status value="Configured in Jenkinsfile" /></div>
            <div><strong>Automated deployment</strong><Status value="Not yet configured" /></div>
          </div>
        </Panel>
        <Panel title="Deployment summary" subtitle="Backend-provided metrics">
          <div className="big-number">{summary?.deployments ?? '—'}</div>
          <p className="muted-copy">Total deployment records currently reported by the dashboard API.</p>
          <div className="info-list">
            <div><strong>System health</strong><span>{summary?.systemHealth ?? 'Unknown'}</span></div>
            <div><strong>Uptime</strong><span>{summary?.uptime ?? '—'}</span></div>
          </div>
        </Panel>
      </section>
    </>
  )

  const renderMonitoring = () => (
    <>
      <div className="notice"><span className="notice-icon">i</span><div><strong>Application health check</strong><p>The status below is based on the live Spring Boot API and database-backed endpoints. Host-level and Prometheus metrics are not connected to this page yet.</p></div><span className="snapshot-date">LIVE API</span></div>
      <section className="stats-grid">
        <Metric label="BACKEND API" value={backendUp ? 'UP' : 'OFFLINE'} detail={apiStatus?.backend ?? 'No API response'} icon="◉" />
        <Metric label="SYSTEM HEALTH" value={summary?.systemHealth ?? 'Unknown'} detail="Dashboard API response" icon="♡" />
        <Metric label="REPORTED UPTIME" value={summary?.uptime ?? '—'} detail="Backend summary value" icon="◷" />
        <Metric label="ACTIVE SERVICES" value={summary?.activeServices ?? '—'} detail={`Out of ${summary?.totalServices ?? '—'} reported services`} icon="▦" />
      </section>
      <Panel title="Service health" subtitle="Current service records from PostgreSQL" tag="LIVE API">
        {loading ? <p className="data-state">Checking services...</p> : services.length === 0 ? <p className="data-state">No service data available.</p> : <div className="live-record-list">{services.map((service) => <div className="live-record" key={service.id}><div><strong>{service.name}</strong><small>{service.environment}</small></div><Status value={service.status} /></div>)}</div>}
      </Panel>
      <Panel title="Monitoring integration" subtitle="Monitoring capabilities and current status">
        <div className="info-list">
          <div><strong>Spring Boot health endpoint</strong><Status value={backendUp ? 'Connected' : 'Unavailable'} /></div>
          <div><strong>PostgreSQL-backed API</strong><Status value={summary ? 'Responding' : 'Unverified'} /></div>
          <div><strong>Prometheus metrics</strong><Status value="Not connected to deployed UI" /></div>
          <div><strong>Grafana dashboard</strong><Status value="Not connected to deployed UI" /></div>
        </div>
      </Panel>
    </>
  )

  const renderSecurity = () => (
    <>
      <div className="notice"><span className="notice-icon">i</span><div><strong>Security overview</strong><p>This page documents the intended access design. It does not query AWS IAM or security groups live and does not perform security changes.</p></div><span className="snapshot-date">DOCUMENTATION</span></div>
      <section className="stats-grid">
        <Metric label="PUBLIC WEB ENTRY" value="HTTP :80" detail="Nginx web entry point" icon="↗" />
        <Metric label="BACKEND PORT" value="8080" detail="Internal Docker service" icon="⌘" />
        <Metric label="DATABASE PORT" value="5432" detail="Internal Docker service" icon="▤" />
        <Metric label="INSTANCE ACCESS" value="SSM" detail="Systems Manager session access" icon="⬡" />
      </section>
      <section className="detail-grid">
        <Panel title="Application network boundaries" subtitle="Container-level deployment design">
          <div className="info-list">
            <div><strong>Nginx</strong><span>Public HTTP entry on port 80</span></div>
            <div><strong>Spring Boot</strong><span>Reachable through the private Docker network</span></div>
            <div><strong>PostgreSQL</strong><span>Reachable through the private Docker network</span></div>
            <div><strong>Docker network</strong><span>cloudops-net</span></div>
          </div>
        </Panel>
        <Panel title="Security checklist" subtitle="Items to verify in AWS">
          <div className="check-list">
            <div><span>✓</span> Restrict public ingress to required ports</div>
            <div><span>✓</span> Keep database credentials outside source code</div>
            <div><span>✓</span> Keep database and backend ports off public ingress</div>
            <div><span>○</span> Review IAM permissions and MFA regularly</div>
            <div><span>○</span> Review security group and NACL rules</div>
          </div>
        </Panel>
      </section>
    </>
  )

  const renderStorage = () => (
    <>
      <div className="notice"><span className="notice-icon">i</span><div><strong>Object storage inventory</strong><p>These bucket names are recorded project inventory. Bucket contents, permissions and usage are not being fetched live by this page.</p></div><span className="snapshot-date">S3 SNAPSHOT</span></div>
      <section className="stats-grid">
        <Metric label="RECORDED BUCKETS" value={buckets.length} detail="Project inventory" icon="▤" />
        <Metric label="AWS REGION" value="ap-south-1" detail="Configured project region" icon="◎" />
        <Metric label="BACKUP STORAGE" value="S3" detail="Object storage service" icon="◫" />
        <Metric label="LIVE BUCKET QUERY" value="Not connected" detail="No S3 inventory API configured" icon="↗" />
      </section>
      <Panel title="S3 bucket inventory" subtitle="Recorded bucket names">
        <div className="bucket-list">{buckets.map((bucket) => <div className="bucket-row" key={bucket}><span className="bucket-icon">▤</span><span className="mono">{bucket}</span><span className="bucket-check">✓</span></div>)}</div>
      </Panel>
      <Panel title="Storage integration" subtitle="Current application integration status">
        <div className="info-list">
          <div><strong>Bucket listing</strong><Status value="Snapshot only" /></div>
          <div><strong>Object upload from dashboard</strong><Status value="Not implemented" /></div>
          <div><strong>Backup automation</strong><Status value="Not verified" /></div>
        </div>
      </Panel>
    </>
  )

  const renderServerless = () => (
    <>
      <div className="notice"><span className="notice-icon">i</span><div><strong>Serverless workspace</strong><p>This section is ready for future AWS Lambda integration. No Lambda functions are currently connected to the CloudOps backend.</p></div><span className="snapshot-date">PLANNED</span></div>
      <section className="stats-grid">
        <Metric label="LAMBDA FUNCTIONS" value="—" detail="No live AWS integration" icon="ϟ" />
        <Metric label="EVENT SOURCES" value="—" detail="Not configured" icon="⇢" />
        <Metric label="SCHEDULED TASKS" value="—" detail="Not configured" icon="◷" />
        <Metric label="INTEGRATION STATUS" value="Planned" detail="Future implementation" icon="⌘" />
      </section>
      <section className="detail-grid">
        <Panel title="Planned capabilities" subtitle="Potential serverless modules">
          <div className="info-list">
            <div><strong>Function inventory</strong><span>List and describe Lambda functions</span></div>
            <div><strong>Invocation monitoring</strong><span>Display invocation and error metrics</span></div>
            <div><strong>Event integrations</strong><span>Review configured event sources</span></div>
            <div><strong>Scheduled automation</strong><span>Display EventBridge schedules</span></div>
          </div>
        </Panel>
        <Panel title="Integration requirements" subtitle="Before enabling this section">
          <div className="check-list">
            <div><span>○</span> Configure a least-privilege AWS access role</div>
            <div><span>○</span> Add backend endpoints for Lambda inventory</div>
            <div><span>○</span> Connect metrics and invocation history</div>
            <div><span>○</span> Add safe read-only views before action controls</div>
          </div>
        </Panel>
      </section>
    </>
  )

  const renderDataMl = () => (
    <>
      <div className="notice"><span className="notice-icon">i</span><div><strong>Data and ML workspace</strong><p>This page uses the CloudOps service and deployment records already returned by the backend. No external ML service is currently connected.</p></div><span className="snapshot-date">PLATFORM DATA</span></div>
      <section className="stats-grid">
        <Metric label="SERVICE RECORDS" value={services.length} detail="PostgreSQL API records" icon="▤" />
        <Metric label="DEPLOYMENT RECORDS" value={deployments.length} detail="PostgreSQL API records" icon="⇧" />
        <Metric label="ACTIVE SERVICES" value={summary?.activeServices ?? '—'} detail="Backend summary" icon="◉" />
        <Metric label="FAILED DEPLOYMENTS" value={summary?.failedDeployments ?? '—'} detail="Backend summary" icon="!" />
      </section>
      <section className="detail-grid">
        <Panel title="Platform data sources" subtitle="Currently available application data">
          <div className="info-list">
            <div><strong>Cloud services</strong><span>/api/services</span></div>
            <div><strong>Deployment history</strong><span>/api/deployments</span></div>
            <div><strong>Dashboard summary</strong><span>/api/dashboard/summary</span></div>
            <div><strong>API status</strong><span>/api/status</span></div>
          </div>
        </Panel>
        <Panel title="Future analytics capabilities" subtitle="Not yet connected">
          <div className="info-list">
            <div><strong>Deployment trends</strong><span>Historical release analytics</span></div>
            <div><strong>Service reliability</strong><span>Availability and incident trends</span></div>
            <div><strong>Cost analytics</strong><span>AWS billing data integration</span></div>
            <div><strong>ML insights</strong><span>Model and prediction integration</span></div>
          </div>
        </Panel>
      </section>
    </>
  )

  const renderPage = () => {
    switch (active) {
      case 'Infrastructure': return renderInfrastructure()
      case 'Deployments': return renderDeployments()
      case 'Monitoring': return renderMonitoring()
      case 'Security & IAM': return renderSecurity()
      case 'Storage': return renderStorage()
      case 'Serverless': return renderServerless()
      case 'Data & ML': return renderDataMl()
      default: return renderOverview()
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">C</div>
          <div><h2>CloudOps<span>.</span></h2><small>ENTERPRISE PLATFORM</small></div>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <div className="workspace">
          <div className="workspace-avatar">P</div>
          <div><strong>Parth's Workspace</strong><small>Administrator</small></div>
          <span className="workspace-arrow">⌄</span>
        </div>

        <div className="nav-label">PLATFORM</div>
        <nav aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              key={item.name}
              type="button"
              aria-current={active === item.name ? 'page' : undefined}
              className={`nav-item ${active === item.name ? 'active' : ''}`}
              onClick={() => setActive(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.name}</span>
              {item.name === 'Overview' && <span className="nav-dot" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="cloud-status">
            <span className="status-pulse" />
            <div><strong>{backendUp ? 'Backend connected' : 'Backend unavailable'}</strong><small>AWS inventory · ap-south-1</small></div>
          </div>
          <div className="profile">
            <div className="profile-avatar">PC</div>
            <div><strong>Project Admin</strong><small>Cloud Engineer</small></div>
            <span className="profile-menu">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><b>/</b><strong>{active}</strong></div>
          <div className="topbar-actions">
            <span className="region-pill"><span className="region-dot" /> AWS Mumbai</span>
            <div className="top-avatar">PC</div>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">CLOUD OPERATIONS / COMMAND CENTER</div>
              <h1>{active === 'Overview' ? 'Infrastructure Overview' : active}</h1>
              <p className="page-subtitle">{descriptions[active]}</p>
            </div>
            <div className="header-buttons">
              <button className="secondary-button" type="button" onClick={() => void loadDashboard()}>
                ↻ {loading ? 'Refreshing...' : 'Refresh data'}
              </button>
              <button className="primary-button" type="button" onClick={() => setActive('Deployments')}>
                ＋ View deployments
              </button>
            </div>
          </section>

          {error && (
            <div className="api-error" role="alert">
              <strong>Could not load live dashboard data.</strong>
              <span>{error}</span>
              <button type="button" onClick={() => void loadDashboard()}>Try again</button>
            </div>
          )}

          {renderPage()}

          <footer className="footer">
            <span>CloudOps Enterprise Platform <b>·</b> Development build</span>
            <span>API: {apiStatus?.status ?? 'Not connected'} · Region: ap-south-1 · {apiStatus?.version ?? '—'}</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
