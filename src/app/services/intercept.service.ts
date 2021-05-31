import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()

export class InterceptService implements HttpInterceptor{

  refreshingAccessToken: boolean;

  accessTokenRefreshed: Subject<any> = new Subject();

  constructor(private authSErv: AuthService) { }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
 
  request = this.addAuthHeader(request);

  // call next() and handle the response
  return next.handle(request).pipe(
    catchError((error: HttpErrorResponse) => {
    //  console.log(error);
    //  console.log(error);
      if (error.status === 401) {
        // 400 error so we are unauthorized

        // refresh the access token
        return this.refreshAccessToken()
          .pipe(
            switchMap(() => {
              request = this.addAuthHeader(request);
              return next.handle(request);
            }),
            catchError((err: any) => {
              this.authSErv.logout();
              return  throwError(err);
            })
          )
      }

      return throwError(error);
    })
  )
 
  }

  addAuthHeader(request: HttpRequest<any>) {
    // get the access token
    let token = this.authSErv.getAccessToken();
    if(!token){
      return request;
    }
    token = this.authSErv.getDecryptToken(token);
   
      // append the access token to the request header
     const newReqest = request.clone({
         setHeaders: {
          'x-access-token': JSON.parse(token)
         }
      });
    
    return newReqest;
  }

  refreshAccessToken() {
   // this.refreshingAccessToken = true;
  //  console.log(this.refreshingAccessToken);
    if (this.refreshingAccessToken) {
    return new Observable(observer => {
        this.accessTokenRefreshed.subscribe(() => {
          // this code will run when the access token has been refreshed
          observer.next();
          observer.complete();
        })
      })
    } else {
      this.refreshingAccessToken = true;
      //we want to call a method in the auth service to send a request to refresh the access token
      return this.authSErv.getNewAccessToken().pipe(tap(() => {
        this.refreshingAccessToken = false;
          console.log("Access Token Refreshed!");
         // this.refreshingAccessToken = false;
          this.accessTokenRefreshed.next();
        })
      )
    }
  }
  
}
