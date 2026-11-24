/**
 * COMMANDO BATCH - REST API CLIENT
 * Handles authorization tokens, mock test fetch, CBT submission, and admin actions.
 */

const API = (function () {
  const BASE_URL = window.location.origin;

  function getToken() {
    return localStorage.getItem('commando_token');
  }

  function setToken(token) {
    if (token) {
      localStorage.setItem('commando_token', token);
    } else {
      localStorage.removeItem('commando_token');
    }
  }

  function getUser() {
    try {
      const data = localStorage.getItem('commando_user');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function setUser(user) {
    if (user) {
      localStorage.setItem('commando_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('commando_user');
    }
  }

  async function request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || `HTTP error ${res.status}`);
      }

      return data;
    } catch (err) {
      console.error(`API Error on ${endpoint}:`, err);
      throw err;
    }
  }

  return {
    getToken,
    setToken,
    getUser,
    setUser,

    // Auth
    async login(email, password, requiredRole = null) {
      const payload = { email, password };
      if (requiredRole) payload.requiredRole = requiredRole;
      const res = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setToken(res.token);
      setUser(res.user);
      return res;
    },

    async register(data) {
      const res = await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      setToken(res.token);
      setUser(res.user);
      return res;
    },

    logout() {
      setToken(null);
      setUser(null);
    },

    async getMe() {
      return await request('/api/auth/me');
    },

    async subscribePackage(packageId, targetForce, durationMonths) {
      const res = await request('/api/auth/subscribe-package', {
        method: 'POST',
        body: JSON.stringify({ packageId, targetForce, durationMonths })
      });
      if (res.user) {
        setUser(res.user);
      }
      return res;
    },

    // Tests & CBT
    async getTests(category) {
      const q = category && category !== 'all' ? `?category=${category}` : '';
      return await request(`/api/tests${q}`);
    },

    async getTestById(id) {
      return await request(`/api/tests/${id}`);
    },

    async submitTest(id, answers, timeSpentSeconds, questionStatuses) {
      return await request(`/api/tests/${id}/submit`, {
        method: 'POST',
        body: JSON.stringify({ answers, timeSpentSeconds, questionStatuses })
      });
    },

    // Student Attempts & Scorecards
    async getMyAttempts() {
      return await request('/api/attempts/my');
    },

    async getScorecard(attemptId) {
      return await request(`/api/attempts/${attemptId}`);
    },

    // Admin Panel
    async getAdminStats() {
      return await request('/api/admin/stats');
    },

    async getAdminTests() {
      return await request('/api/admin/tests');
    },

    async createAdminTest(testData) {
      return await request('/api/admin/tests', {
        method: 'POST',
        body: JSON.stringify(testData)
      });
    },

    async updateAdminTest(id, updates) {
      return await request(`/api/admin/tests/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    },

    async addAdminQuestion(id, questionData) {
      return await request(`/api/admin/tests/${id}/questions`, {
        method: 'POST',
        body: JSON.stringify(questionData)
      });
    },

    async deleteAdminTest(id) {
      return await request(`/api/admin/tests/${id}`, {
        method: 'DELETE'
      });
    },

    async getAdminAttempts() {
      return await request('/api/admin/attempts');
    },

    async getAdminUsers() {
      return await request('/api/admin/users');
    },

    async grantAdminCandidatePass(userId, targetForce, days) {
      return await request(`/api/admin/users/${userId}/grant-pass`, {
        method: 'POST',
        body: JSON.stringify({ targetForce, days })
      });
    },

    async revokeAdminCandidatePass(userId) {
      return await request(`/api/admin/users/${userId}/revoke-pass`, {
        method: 'POST'
      });
    },

    async getFirebaseStatus() {
      return await request('/api/admin/firebase/status');
    },

    async syncToFirebase() {
      return await request('/api/admin/firebase/sync', {
        method: 'POST'
      });
    },

    async resetSeedData() {
      return await request('/api/admin/seed-reset', {
        method: 'POST'
      });
    },

    // Candidate Enquiry & Helpdesk
    async submitEnquiry(enquiryData) {
      return await request('/api/enquiries', {
        method: 'POST',
        body: JSON.stringify(enquiryData)
      });
    },

    async getAdminEnquiries() {
      return await request('/api/enquiries/all');
    },

    async updateAdminEnquiry(id, updates) {
      return await request(`/api/enquiries/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
    }
  };
})();
