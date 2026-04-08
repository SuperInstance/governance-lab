interface Experiment {
  id: string;
  branch: string;
  rule: string;
  status: 'testing' | 'ready' | 'promoted' | 'failed';
  createdAt: number;
  metrics?: {
    successRate: number;
    latency: number;
    errorCount: number;
  };
}

interface Rule {
  id: string;
  name: string;
  condition: string;
  action: string;
  version: number;
  active: boolean;
}

class GovernanceLab {
  private experiments: Map<string, Experiment>;
  private rules: Map<string, Rule>;
  private productionRules: Rule[];

  constructor() {
    this.experiments = new Map();
    this.rules = new Map();
    this.productionRules = [];
    this.initializeDefaultRules();
  }

  private initializeDefaultRules(): void {
    const defaultRules: Rule[] = [
      {
        id: 'rule-1',
        name: 'Rate Limiter',
        condition: 'request.count > 100',
        action: 'block',
        version: 1,
        active: true
      },
      {
        id: 'rule-2',
        name: 'Bot Detection',
        condition: 'userAgent matches /bot/i',
        action: 'challenge',
        version: 1,
        active: true
      }
    ];

    defaultRules.forEach(rule => this.rules.set(rule.id, rule));
    this.productionRules = [...defaultRules];
  }

  createExperiment(branch: string, rule: string): Experiment {
    const id = `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const experiment: Experiment = {
      id,
      branch,
      rule,
      status: 'testing',
      createdAt: Date.now(),
      metrics: {
        successRate: 0,
        latency: 0,
        errorCount: 0
      }
    };

    this.experiments.set(id, experiment);
    return experiment;
  }

  getExperiments(): Experiment[] {
    return Array.from(this.experiments.values());
  }

  getRules(): Rule[] {
    return Array.from(this.rules.values());
  }

  promoteExperiment(experimentId: string): boolean {
    const experiment = this.experiments.get(experimentId);
    if (!experiment || experiment.status !== 'ready') {
      return false;
    }

    const newRule: Rule = {
      id: `rule-${Date.now()}`,
      name: `Mutated Rule from ${experiment.branch}`,
      condition: experiment.rule,
      action: 'enforce',
      version: 1,
      active: true
    };

    this.rules.set(newRule.id, newRule);
    this.productionRules.push(newRule);
    experiment.status = 'promoted';
    
    return true;
  }

  mutateRule(ruleId: string, mutation: Partial<Rule>): Rule | null {
    const rule = this.rules.get(ruleId);
    if (!rule) return null;

    const mutatedRule: Rule = {
      ...rule,
      ...mutation,
      version: rule.version + 1
    };

    this.rules.set(ruleId, mutatedRule);
    return mutatedRule;
  }
}

const lab = new GovernanceLab();

const htmlResponse = (content: string): Response => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Governance Lab - Empirical OS Evolution</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #0a0a0f;
      color: #e2e8f0;
      line-height: 1.6;
      min-height: 100vh;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    header {
      border-bottom: 1px solid #1e293b;
      padding-bottom: 2rem;
      margin-bottom: 3rem;
    }
    h1 {
      font-size: 2.5rem;
      background: linear-gradient(90deg, #818cf8, #60a5fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      color: #94a3b8;
      font-size: 1.1rem;
    }
    .hero {
      background: linear-gradient(135deg, #1e1b2e 0%, #0f172a 100%);
      border-radius: 1rem;
      padding: 3rem;
      margin-bottom: 3rem;
      border: 1px solid #334155;
    }
    .hero h2 {
      font-size: 1.8rem;
      margin-bottom: 1rem;
      color: #818cf8;
    }
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin: 2rem 0;
    }
    .feature {
      background: #1e293b;
      padding: 1.5rem;
      border-radius: 0.75rem;
      border-left: 4px solid #818cf8;
    }
    .feature h3 {
      color: #818cf8;
      margin-bottom: 0.5rem;
    }
    .endpoints {
      background: #0f172a;
      border-radius: 0.75rem;
      padding: 2rem;
      margin: 2rem 0;
      border: 1px solid #334155;
    }
    .endpoint {
      font-family: 'Monaco', 'Menlo', monospace;
      background: #1e293b;
      padding: 1rem;
      border-radius: 0.5rem;
      margin: 0.5rem 0;
      border-left: 3px solid #10b981;
    }
    footer {
      margin-top: 4rem;
      padding-top: 2rem;
      border-top: 1px solid #1e293b;
      text-align: center;
      color: #64748b;
      font-size: 0.9rem;
    }
    .fleet-footer {
      color: #818cf8;
      font-weight: 600;
      margin-top: 0.5rem;
    }
  </style>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="container">
    <header>
      <h1>Governance Lab</h1>
      <p class="subtitle">Evolve fleet governance through empirical OS evolution</p>
    </header>
    
    <div class="hero">
      <h2>Branch-as-Experiment Platform</h2>
      <p>Test governance rules in isolated branches with automated promotion workflows.</p>
    </div>
    
    <div class="features">
      <div class="feature">
        <h3>Branch-as-Experiment</h3>
        <p>Isolate rule testing in dedicated branches with full traffic simulation.</p>
      </div>
      <div class="feature">
        <h3>Rule Mutation</h3>
        <p>Evolve rules through controlled mutations and A/B testing.</p>
      </div>
      <div class="feature">
        <h3>Isolated Testing</h3>
        <p>Test rules without affecting production fleet performance.</p>
      </div>
      <div class="feature">
        <h3>Auto-Promotion</h3>
        <p>Automatically promote successful experiments to production.</p>
      </div>
    </div>
    
    <div class="endpoints">
      <h3>API Endpoints</h3>
      <div class="endpoint">POST /api/experiment - Create new experiment branch</div>
      <div class="endpoint">GET /api/rules - List all governance rules</div>
      <div class="endpoint">POST /api/promote - Promote experiment to production</div>
      <div class="endpoint">GET /health - Health check endpoint</div>
    </div>
    
    <footer>
      <p>Governance Lab v1.0 - Empirical OS Evolution</p>
      <p class="fleet-footer">Fleet Governance System</p>
    </footer>
  </div>
</body>
</html>
  `;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Content-Security-Policy': "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com;",
      'X-Frame-Options': 'DENY'
    }
  });
};

const jsonResponse = (data: unknown, status = 200): Response => {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-Frame-Options': 'DENY'
    }
  });
};

const handleRequest = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  const path = url.pathname;

  // Set security headers for all responses
  const securityHeaders = {
    'X-Frame-Options': 'DENY',
    'Content-Security-Policy': "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com;"
  };

  // Health check endpoint
  if (path === '/health') {
    return new Response('OK', {
      headers: securityHeaders
    });
  }

  // API endpoints
  if (path === '/api/experiment' && request.method === 'POST') {
    try {
      const body = await request.json() as { branch: string; rule: string };
      if (!body.branch || !body.rule) {
        return jsonResponse({ error: 'Missing branch or rule' }, 400);
      }
      const experiment = lab.createExperiment(body.branch, body.rule);
      return jsonResponse(experiment, 201);
    } catch {
      return jsonResponse({ error: 'Invalid JSON' }, 400);
    }
  }

  if (path === '/api/rules' && request.method === 'GET') {
    const rules = lab.getRules();
    return jsonResponse(rules);
  }

  if (path === '/api/promote' && request.method === 'POST') {
    try {
      const body = await request.json() as { experimentId: string };
      if (!body.experimentId) {
        return jsonResponse({ error: 'Missing experimentId' }, 400);
      }
      const success = lab.promoteExperiment(body.experimentId);
      return jsonResponse({ success });
    } catch {
      return jsonResponse({ error: 'Invalid JSON' }, 400);
    }
  }

  // Serve HTML for root path
  if (path === '/' && request.method === 'GET') {
    return htmlResponse('');
  }

  // 404 for unknown routes
  return new Response('Not Found', {
    status: 404,
    headers: securityHeaders
  });
};

export default {
  async fetch(request: Request): Promise<Response> {
    return handleRequest(request);
  }
};