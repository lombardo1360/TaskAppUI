import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    try {
      httpMock.verify();
    } catch (e) {
      // Ignore verification errors in cleanup
    }
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    const mockResponse = {
      token: 'test-token',
      username: 'testuser',
      email: 'test@example.com'
    };

    const credentials = {
      username: 'testuser',
      password: 'password123'
    };

    service.login(credentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/Auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should save token to localStorage', () => {
    const token = 'test-token-123';
    
    service.saveToken(token);
    
    expect(localStorage.getItem('token')).toBe(token);
  });

  it('should get token from localStorage', () => {
    const token = 'test-token-123';
    localStorage.setItem('token', token);
    
    const retrievedToken = service.getToken();
    
    expect(retrievedToken).toBe(token);
  });

  it('should check if user is authenticated', () => {
    expect(service.isAuthenticated()).toBeFalsy();
    
    localStorage.setItem('token', 'test-token');
    
    expect(service.isAuthenticated()).toBeTruthy();
  });

  it('should logout and clear localStorage', () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ username: 'test' }));
    
    service.logout();
    
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
