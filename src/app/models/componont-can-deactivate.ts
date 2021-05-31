import { Observable } from "rxjs";

export interface ComponontCanDeactivate {
    canDeactivate: () => boolean | Observable<boolean>
}
