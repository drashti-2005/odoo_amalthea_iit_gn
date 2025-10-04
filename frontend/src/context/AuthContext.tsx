import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { authApi } from '../api/auth';
import type { User, AuthState, LoginCredentials, SignupData } from '../types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: User };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // For development: Mock login if backend is not available
      if (import.meta.env.DEV) {
        try {
          const response = await authApi.login(credentials);
          if (response.success) {
            const { user, token } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
          } else {
            throw new Error(response.message || 'Login failed');
          }
        } catch (error) {
          // Mock login for development when backend is not available
          console.warn('Backend not available, using mock login');
          
          // Create different mock users based on email for testing
          let mockUser: User;
          
          if (credentials.email === 'user1@gmail.com') {
            mockUser = {
              id: 'employee1',
              name: 'Sarah Johnson',
              email: 'user1@gmail.com',
              role: 'employee',
              isActive: true,
              company: {
                id: 'company1',
                name: 'Tech Solutions Inc',
                baseCurrency: 'USD',
                country: 'US',
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          } else if (credentials.email.includes('employee')) {
            mockUser = {
              id: 'employee2',
              name: 'Employee Demo',
              email: 'employee.demo@test.com',
              role: 'employee',
              isActive: true,
              company: {
                id: 'company1',
                name: 'Test Company',
                baseCurrency: 'USD',
                country: 'US',
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          } else if (credentials.email.includes('manager')) {
            mockUser = {
              id: 'manager1',
              name: 'Manager Demo',
              email: 'manager@test.com',
              role: 'manager',
              isActive: true,
              company: {
                id: 'company1',
                name: 'Test Company',
                baseCurrency: 'USD',
                country: 'US',
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          } else {
            // Default admin user
            mockUser = {
              id: 'admin1',
              name: 'Admin User',
              email: 'admin@example.com',
              role: 'admin',
              isActive: true,
              company: {
                id: 'company1',
                name: 'Test Company',
                baseCurrency: 'USD',
                country: 'US',
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          }
          
          const mockToken = 'mock-jwt-token';
          localStorage.setItem('token', mockToken);
          localStorage.setItem('user', JSON.stringify(mockUser));
          dispatch({ type: 'AUTH_SUCCESS', payload: { user: mockUser, token: mockToken } });
        }
      } else {
        const response = await authApi.login(credentials);
        if (response.success) {
          const { user, token } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
        } else {
          throw new Error(response.message || 'Login failed');
        }
      }
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // For development: Mock signup if backend is not available
      if (import.meta.env.DEV) {
        try {
          console.log('Attempting signup with data:', data);
          const response = await authApi.signup(data);
          console.log('Signup response:', response);
          if (response.success) {
            const { user, token } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
          } else {
            throw new Error(response.message || 'Signup failed');
          }
        } catch (error) {
          console.error('Signup API error:', error);
          // Mock signup for development when backend is not available
          console.warn('Backend not available, using mock signup');
          const mockUser: User = {
            id: '1',
            name: data.name,
            email: data.email,
            role: 'employee',
            isActive: true,
            company: {
              id: '1',
              name: data.name,
              baseCurrency: data.baseCurrency || 'USD',
              country: data.country || 'US'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          const mockToken = 'mock-jwt-token';
          localStorage.setItem('token', mockToken);
          localStorage.setItem('user', JSON.stringify(mockUser));
          dispatch({ type: 'AUTH_SUCCESS', payload: { user: mockUser, token: mockToken } });
        }
      } else {
        const response = await authApi.signup(data);
        if (response.success) {
          const { user, token } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
        } else {
          throw new Error(response.message || 'Signup failed');
        }
      }
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const checkAuth = async () => {
    try {
      dispatch({ type: 'AUTH_START' });
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (!token || !userStr) {
        dispatch({ type: 'AUTH_FAILURE' });
        return;
      }

      // For development: Skip API call if backend is not available
      if (import.meta.env.DEV) {
        try {
          const response = await authApi.getMe();
          if (response.success) {
            const user = response.data;
            localStorage.setItem('user', JSON.stringify(user));
            dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
          } else {
            dispatch({ type: 'AUTH_FAILURE' });
          }
        } catch (error) {
          // If API call fails in development, use stored user data
          console.warn('Backend not available, using stored user data');
          try {
            const user = JSON.parse(userStr);
            dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
          } catch {
            dispatch({ type: 'AUTH_FAILURE' });
          }
        }
      } else {
        // In production, always verify token with backend
        const response = await authApi.getMe();
        if (response.success) {
          const user = response.data;
          localStorage.setItem('user', JSON.stringify(user));
          dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
        } else {
          dispatch({ type: 'AUTH_FAILURE' });
        }
      }
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
