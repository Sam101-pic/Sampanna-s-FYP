import api from "./api";

const authService = {
  // ✅ Universal login (default for patient)
  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.data.token) localStorage.setItem("token", res.data.token);
    if (res.data.user?.role) localStorage.setItem("role", res.data.user.role);
    return res.data;
  },

  // ✅ Register patient
  registerPatient: async (name, email, password) =>
    (
      await api.post("/auth/register", {
        name,
        email,
        password,
        role: "patient",
      })
    ).data,

  // ✅ Register therapist
  registerTherapist: async (data) =>
    (
      await api.post("/auth/register", {
        ...data,
        role: "therapist",
      })
    ).data,

  // ✅ Login therapist
  loginTherapist: async (email, password) => {
    const res = await api.post("/auth/login", {
      email,
      password,
      role: "therapist",
    });
    if (res.data.token) localStorage.setItem("token", res.data.token);
    if (res.data.user?.role) localStorage.setItem("role", res.data.user.role);
    return res.data;
  },

  // ✅ Login admin
  loginAdmin: async (email, password) => {
    const res = await api.post("/auth/admin/login", {
      email,
      password,
    });
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "admin");
    }
    return res.data;
  },

  // ✅ Forgot password
  forgotPassword: async (email) =>
    (await api.post("/auth/forgot-password", { email })).data,

  // ✅ Reset password
  resetPassword: async (token, password) =>
    (await api.post("/auth/reset-password", { token, password })).data,

  // ✅ Google login
  googleLogin: async (credential, role = "patient") => {
    const res = await api.post("/auth/google", { credential, role });
    if (res.data.token) localStorage.setItem("token", res.data.token);
    if (res.data.user?.role) localStorage.setItem("role", res.data.user.role);
    return res.data;
  },

  // ✅ Logout
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  },
};

export default authService;
