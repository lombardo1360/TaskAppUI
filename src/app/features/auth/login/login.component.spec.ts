import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let store: MockStore;

    const initialState = {
        auth: {
            user: null,
            token: null,
            loading: false,
            error: null
        }
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoginComponent, ReactiveFormsModule],
            providers: [
                provideMockStore({ initialState })
            ]
        }).compileComponents();

        store = TestBed.inject(MockStore);
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize login form with empty values', () => {
        expect(component.loginForm.get('username')?.value).toBe('');
        expect(component.loginForm.get('password')?.value).toBe('');
    });

    it('should validate required fields', () => {
        const usernameControl = component.loginForm.get('username');
        const passwordControl = component.loginForm.get('password');

        expect(usernameControl?.valid).toBeFalsy();
        expect(passwordControl?.valid).toBeFalsy();

        usernameControl?.setValue('testuser');
        passwordControl?.setValue('password123');

        expect(usernameControl?.valid).toBeTruthy();
        expect(passwordControl?.valid).toBeTruthy();
    });

    it('should toggle between login and register mode', () => {
        expect(component.isRegisterMode).toBeFalsy();
        
        component.toggleMode();
        
        expect(component.isRegisterMode).toBeTruthy();
        expect(component.loginForm.get('email')).toBeTruthy();
    });

    it('should dispatch login action on submit', () => {
        const dispatchSpy = vi.spyOn(store, 'dispatch');
        
        component.loginForm.patchValue({
            username: 'testuser',
            password: 'password123'
        });

        component.onSubmit();

        expect(dispatchSpy).toHaveBeenCalled();
    });
});

