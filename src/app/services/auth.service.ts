import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs/operators';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cryptoSErv: CryptoService, private http: HttpClient, private router: Router) { }

  login(email: string, password: string){

    let user = {
      email: email,
      password: password
    }
    return this.http.post<any>('http://localhost:3000/api/auth/login', user, {
       observe: 'response'
    }).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        // the auth tokens will be in the header of this response
        this.setSession(this.cryptoSErv.encryptUsingAES256(res.body), 
        this.cryptoSErv.encryptUsingAES256(res.headers.get('x-access-token')),
        this.cryptoSErv.encryptUsingAES256(res.headers.get('x-refresh-token'))) ;
      })
    )

  }

  logout() {
    this.http.delete('http://localhost:3000/api/auth/logout/' +  this.getDecryptToken(this.getUserId()) , {
      headers: {
        'x-refresh-token': JSON.parse(this.getDecryptToken(this.getRefreshToken())) ,
      },
      observe: 'response'
    }).subscribe((data) =>{
      this.removeSession();
      this.router.navigate(['/login']);
    })
  }

  onNavigateToAllMovies(){
    this.router.navigate(['/home/allMovies']);
  }

  getAccessToken() {
    return localStorage.getItem('x-access-token');
  }

  getRefreshToken() {
    return localStorage.getItem('x-refresh-token');
  }

  getDecryptToken(token: string){
    return this.cryptoSErv.decryptUsingAES256(token);
  }

  encryptToken(token: string){
    return this.cryptoSErv.encryptUsingAES256(token);
  }

  getUserId() {
    return localStorage.getItem('user-id');
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem('x-access-token', accessToken)
  }

  private setSession(userId: string, accessToken: string, refreshToken: string) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('x-access-token', accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);
  }

  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }

  getNewAccessToken() {
    return this.http.post('http://localhost:3000/api/auth/token', JSON.parse(this.getDecryptToken(this.getUserId())),{
      headers: {
        'x-refresh-token': JSON.parse(this.getDecryptToken(this.getRefreshToken())) ,
      },
      observe: 'response'
    }).pipe(
      tap((res: HttpResponse<any>) => {
        this.setAccessToken(this.encryptToken(res.headers.get('x-access-token')));
      })
    )
  }
}
