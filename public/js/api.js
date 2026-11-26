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

  function getDeviceId() {
    let devId = localStorage.getItem('commando_device_id');
    if (!devId) {
      devId = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? 'dev_' + crypto.randomUUID().replace(/-/g, '').slice(0, 20)
        : 'dev_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem('commando_device_id', devId);
    }
    return devId;
  }

  function getDeviceLabel() {
    const ua = navigator.userAgent || '';
    if (/iPad|Tablet/i.test(ua)) return 'Tablet / iPad';
    if (/iPhone/i.test(ua)) return 'iPhone (iOS)';
    if (/Android/i.test(ua)) return /Mobile/i.test(ua) ? 'Android Phone' : 'Android Tablet';
    if (/Windows/i.test(ua)) return 'Windows PC';
    if (/Macintosh|Mac OS/i.test(ua)) return 'Mac PC';
    if (/Linux/i.test(ua)) return 'Linux PC';
    return 'Web Device';
  }

  async function request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'X-Device-Id': getDeviceId(),
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

      if (res.status === 401 && data && data.code === 'SESSION_REPLACED') {
        setToken(null);
        setUser(null);
        if (typeof App !== 'undefined' && App.handleForcedDeviceLogout) {
          App.handleForcedDeviceLogout(data.error);
        }
      }

      if (!res.ok) {
        const apiErr = new Error(data.error || `HTTP error ${res.status}`);
        apiErr.status = res.status;
        apiErr.data = data;
        throw apiErr;
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
      const payload = {
        email,
        password,
        deviceId: getDeviceId(),
        deviceLabel: getDeviceLabel()
      };
      if (requiredRole) payload.requiredRole = requiredRole;
      const res = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setToken(res.token);
      setUser(res.user);
      return res;
    },

    async checkRegisterEligibility(email, phone) {
      return await request('/api/auth/check-register-eligibility', {
        method: 'POST',
        body: JSON.stringify({ email, phone })
      });
    },

    async sendRegisterOtp(phone) {
      return await request('/api/auth/send-register-otp', {
        method: 'POST',
        body: JSON.stringify({ phone })
      });
    },

    async register(data) {
      const res = await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          deviceId: getDeviceId(),
          deviceLabel: getDeviceLabel()
        })
      });
      setToken(res.token);
      setUser(res.user);
      return res;
    },

    async googleAuth(idToken, targetExam = null, force = null) {
      const res = await request('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify({
          idToken,
          targetExam,
          force,
          deviceId: getDeviceId(),
          deviceLabel: getDeviceLabel()
        })
      });
      setToken(res.token);
      setUser(res.user);
      return res;
    },

    async forgotPassword(email) {
      return await request('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
    },

    async resetPassword(email, verificationValue, newPassword) {
      return await request('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, verificationValue, newPassword })
      });
    },

    logout() {
      const tok = getToken();
      if (tok) {
        fetch(`${BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tok}`,
            'X-Device-Id': getDeviceId()
          }
        }).catch(() => {});
      }
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

    // Cashfree Payments PG
    async getCashfreeStatus() {
      return await request('/api/payments/cashfree/status');
    },

    async createCashfreeOrder(packageId, targetForce, durationMonths) {
      return await request('/api/payments/cashfree/create-order', {
        method: 'POST',
        body: JSON.stringify({ packageId, targetForce, durationMonths })
      });
    },

    async verifyCashfreeOrder(orderId) {
      const res = await request('/api/payments/cashfree/verify-order', {
        method: 'POST',
        body: JSON.stringify({ orderId })
      });
      if (res.user) {
        setUser(res.user);
      }
      return res;
    },

    async getAdminCashfreeConfig() {
      return await request('/api/admin/payments/cashfree-config');
    },

    async saveAdminCashfreeConfig(appId, secretKey, env) {
      return await request('/api/admin/payments/cashfree-config', {
        method: 'POST',
        body: JSON.stringify({ appId, secretKey, env })
      });
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
        method: 'POST',
        body: JSON.stringify({ confirm: 'CONFIRM_RESET' })
      });
    },

    async changePassword(currentPassword, newPassword) {
      return await request('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
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
