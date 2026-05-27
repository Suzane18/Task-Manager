export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

//utils/apiPaths.js
export const API_PATHS = {
    AUTH:{
        REGISTER:"/api/auth/register",
        LOGIN:"/api/auth/login",
        GET_PROFILE:"/api/auth/profile",
    },
    USERS:{
        GET_ALL_USERS:"/api/users",
        GET_USER_BY_ID:(userId) => `/api/users/${userId}`,
        CREATE_USER:"/api/users",
        UPDATE_USER:(userId) => `/api/users/${userId}`,
        DELETE_USER:(userId) => `/api/users/${userId}`,
        UPDATE_PROFILE: "/api/users/profile",
        REMOVE_PROFILE_IMAGE: "/api/users/profile/image",
        DELETE_PROFILE: "/api/users/profile",
    },
 TASKS: {
    GET_DASHBOARD_DATA:
      "/api/tasks/dashboard-data",

    GET_USER_DASHBOARD_DATA:
      "/api/tasks/user-dashboard-data",

    GET_ALL_TASKS: "/api/tasks",

    GET_TASK_BY_ID: (taskId) =>
      `/api/tasks/${taskId}`,

    CREATE_TASK: "/api/tasks",

    UPDATE_TASK: (taskId) =>
      `/api/tasks/${taskId}`,

    DELETE_TASK: (taskId) =>
      `/api/tasks/${taskId}`,

    // UPDATED TASK ROUTES
    UPDATE_TASK_STATUS: (taskId) =>
      `/api/tasks/${taskId}/status`,

    UPDATE_TASK_CHECKLIST: (taskId) =>
      `/api/tasks/${taskId}/todo`,
  },
    REPORTS:{
        EXPORT_TASKS:"/api/reports/export/tasks",
        EXPORT_USERS:"/api/reports/export/users",
    },
    IMAGE:{
        UPLOAD_IMAGE:"/api/auth/upload-image",  
    },
};