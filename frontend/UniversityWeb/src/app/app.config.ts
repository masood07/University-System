import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { StudentService } from './_services/student-service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterInterceptor } from './interceptors/auth-inter-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterInterceptor])),
    provideRouter(routes)
  ]
};
