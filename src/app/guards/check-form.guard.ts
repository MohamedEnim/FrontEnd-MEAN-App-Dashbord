import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ComponontCanDeactivate } from '../models/componont-can-deactivate';

@Injectable({
  providedIn: 'root'
})
export class CheckFormGuard implements  CanDeactivate<ComponontCanDeactivate> {
  
  canDeactivate(
    component: ComponontCanDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(component.canDeactivate()){
      console.log(component.canDeactivate())
      return true;
    } else {
      return confirm("Are you sure you want to leave without submit the form");
    }
  }
  
}
