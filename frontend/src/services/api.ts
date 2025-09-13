import axios, { AxiosInstance } from 'axios';
import { 
  AuthResponse, 
  LoginRequest, 
  SignupRequest, 
  Trip, 
  TripCreateRequest,
  Activity,
  ActivityCreateRequest,
  CostBreakdown
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post('/auth/signin', credentials);
    return response.data;
  }

  async signup(data: SignupRequest): Promise<{ message: string }> {
    const response = await this.client.post('/auth/signup', data);
    return response.data;
  }

  // Trip endpoints
  async getTrips(page = 0, size = 10): Promise<{ content: Trip[]; totalElements: number }> {
    const response = await this.client.get(`/trips?page=${page}&size=${size}`);
    return response.data;
  }

  async getTripById(id: string): Promise<Trip> {
    const response = await this.client.get(`/trips/${id}`);
    return response.data;
  }

  async createTrip(data: TripCreateRequest): Promise<Trip> {
    const response = await this.client.post('/trips', data);
    return response.data;
  }

  async updateTrip(id: string, data: TripCreateRequest): Promise<Trip> {
    const response = await this.client.put(`/trips/${id}`, data);
    return response.data;
  }

  async deleteTrip(id: string): Promise<void> {
    await this.client.delete(`/trips/${id}`);
  }

  // Activity endpoints
  async getActivitiesByDayPlan(dayPlanId: string): Promise<Activity[]> {
    const response = await this.client.get(`/dayplans/${dayPlanId}/activities`);
    return response.data;
  }

  async createActivity(dayPlanId: string, data: ActivityCreateRequest): Promise<Activity> {
    const response = await this.client.post(`/dayplans/${dayPlanId}/activities`, data);
    return response.data;
  }

  async updateActivity(id: string, data: ActivityCreateRequest): Promise<Activity> {
    const response = await this.client.put(`/activities/${id}`, data);
    return response.data;
  }

  async deleteActivity(id: string): Promise<void> {
    await this.client.delete(`/activities/${id}`);
  }

  async toggleActivityCompletion(id: string): Promise<Activity> {
    const response = await this.client.patch(`/activities/${id}/toggle-completion`);
    return response.data;
  }

  // Analytics endpoints
  async getTripCostBreakdown(tripId: string): Promise<CostBreakdown> {
    const response = await this.client.get(`/analytics/trips/${tripId}/cost-breakdown`);
    return response.data;
  }
}

const apiClient = new ApiClient();

export const authApi = {
  login: apiClient.login.bind(apiClient),
  signup: apiClient.signup.bind(apiClient),
};

export const tripApi = {
  getTrips: apiClient.getTrips.bind(apiClient),
  getTripById: apiClient.getTripById.bind(apiClient),
  createTrip: apiClient.createTrip.bind(apiClient),
  updateTrip: apiClient.updateTrip.bind(apiClient),
  deleteTrip: apiClient.deleteTrip.bind(apiClient),
};

export const activityApi = {
  getActivitiesByDayPlan: apiClient.getActivitiesByDayPlan.bind(apiClient),
  createActivity: apiClient.createActivity.bind(apiClient),
  updateActivity: apiClient.updateActivity.bind(apiClient),
  deleteActivity: apiClient.deleteActivity.bind(apiClient),
  toggleActivityCompletion: apiClient.toggleActivityCompletion.bind(apiClient),
};

export const analyticsApi = {
  getTripCostBreakdown: apiClient.getTripCostBreakdown.bind(apiClient),
};

export default apiClient;
