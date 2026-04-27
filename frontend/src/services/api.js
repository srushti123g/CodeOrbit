import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        "Content-Type": "application/json"
    }
});

// Request interceptor to attach token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        console.log("API Interceptor: Attaching token?", !!token, token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401s
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("API 401 Unauthorized - redirecting to login");
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            window.location.assign("/login");
        }
        return Promise.reject(error);
    }
);

const api = {
    auth: {
        login: async (email, password) => {
            const response = await apiClient.post("/login", { email, password });
            return response;
        },
        signup: async (username, email, password) => {
            const response = await apiClient.post("/signup", { username, email, password });
            return response;
        }
    },
    repo: {
        create: (data) => apiClient.post("/repo/create", data),
        getAll: () => apiClient.get("/repo/all"),
        getById: (id) => apiClient.get(`/repo/${id}`),
        getByUser: (userId) => apiClient.get(`/repo/user/${userId}`),
        toggleVisibility: (id) => apiClient.patch(`/repo/toggle-visibility/${id}`),
        update: (id, data) => apiClient.put(`/repo/update/${id}`, data),
        delete: (id) => apiClient.delete(`/repo/delete/${id}`),
        star: (id) => apiClient.put(`/repo/toggle-star/${id}`),
        // Collaborators
        addCollaborator: (repoId, username, role) => apiClient.post(`/repo/${repoId}/collaborators`, { username, role }),
        removeCollaborator: (repoId, userId) => apiClient.delete(`/repo/${repoId}/collaborators/${userId}`),
        getCollaborators: (repoId) => apiClient.get(`/repo/${repoId}/collaborators`),
    },
    pr: {
        create: (repoId, data) => apiClient.post(`/pr/${repoId}`, data),
        getAll: (repoId, status) => apiClient.get(`/pr/${repoId}`, { params: { status } }),
        getById: (id) => apiClient.get(`/pr/details/${id}`),
        update: (id, data) => apiClient.put(`/pr/${id}`, data),
    },
    commit: {
        getByRepo: (repoId) => apiClient.get(`/commit/repo/${repoId}`),
        getActivity: (repoId) => apiClient.get(`/commit/activity/${repoId}`), // New
        getFile: (commitId, filePath) => apiClient.get(`/commit/file/${commitId}`, { params: { path: filePath } }),
        deleteFile: (data) => apiClient.post("/commit/delete", data),
    },
    user: {
        getProfile: (id) => apiClient.get(`/userProfile/${id}`),
        getHeatmap: (id) => apiClient.get(`/userProfile/${id}/heatmap`),
        updateProfile: (id, data) => apiClient.put(`/updateProfile/${id}`, data),
        deleteProfile: (id) => apiClient.delete(`/deleteProfile/${id}`),
    },
    activity: {
        getAll: () => apiClient.get("/activity/all"),
    },
    issue: {
        create: (repoId, data) => apiClient.post(`/issue/create/${repoId}`, data),
        getAll: () => apiClient.get("/issue/all"),
        getFromRepo: (repoId) => apiClient.get(`/issue/repo/${repoId}`),
        getById: (id) => apiClient.get(`/issue/${id}`),
        update: (id, data) => apiClient.put(`/issue/update/${id}`, data),
        delete: (id) => apiClient.delete(`/issue/delete/${id}`),
        addComment: (id, data) => apiClient.post(`/issue/${id}/comments`, data),
        getComments: (id) => apiClient.get(`/issue/${id}/comments`),
        toggleStatus: (id, status) => apiClient.put(`/issue/${id}/status`, { status }),
    },
    notification: {
        getAll: () => apiClient.get("/notification"),
        markAsRead: (id) => apiClient.put(`/notification/${id}/read`),
    },
    wiki: {
        create: (repoId, data) => apiClient.post(`/wiki/${repoId}`, data),
        getAll: (repoId) => apiClient.get(`/wiki/${repoId}`),
        getBySlug: (repoId, slug) => apiClient.get(`/wiki/${repoId}/${slug}`),
        update: (repoId, slug, data) => apiClient.put(`/wiki/${repoId}/${slug}`, data),
        delete: (repoId, slug) => apiClient.delete(`/wiki/${repoId}/${slug}`),
    }
};

export default api;
