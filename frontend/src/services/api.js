const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Generic fetch wrapper with error handling and fallback reporting
 */
async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(errorData.detail || `HTTP Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`[API Service Error] ${endpoint}:`, error);
    throw error;
  }
}

export const apiService = {
  /**
   * Fetch backend system health status
   */
  async getHealth() {
    return fetchApi('/health');
  },

  /**
   * Fetch 10-agent network listing and live statuses
   */
  async getAgents() {
    return fetchApi('/agents');
  },

  /**
   * Execute full multi-agent IPsec assessment workflow
   * @param {Object} payload { question, traffic, configuration, run_simulation, simulation_scenario }
   */
  async runAssessment(payload) {
    return fetchApi('/assess', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Ask security query to RAG + Qwen3-14B Reasoning Agent
   * @param {string} question
   * @param {Object} configuration
   */
  async askQuestion(question, configuration = {}) {
    return fetchApi('/ask', {
      method: 'POST',
      body: JSON.stringify({ question, configuration }),
    });
  },

  /**
   * Perform safe configuration what-if simulation
   * @param {Object} configuration
   * @param {string} scenarioName
   * @param {Object} modifications
   */
  async runSimulation(configuration, scenarioName = 'disable_pfs', modifications = null) {
    return fetchApi('/simulate', {
      method: 'POST',
      body: JSON.stringify({
        configuration,
        scenario_name: scenarioName,
        modifications,
      }),
    });
  },
};
