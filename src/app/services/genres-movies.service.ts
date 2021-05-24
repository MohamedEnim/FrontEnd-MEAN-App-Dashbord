import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Genre } from '../models/genre';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GenresMoviesService {
  
  sendGenres = new BehaviorSubject<Genre[]>([]);

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  getGenres() : Observable<Genre[]>{
    return this.http.get<Genre[]>('http://localhost:3000/api/genres');
  }

  getGenreByID(genreId: string){
    return this.http.get<Genre>('http://localhost:3000/api/genres/' + genreId);
  }

  onNavigateToAddGenre() {
    this.router.navigate(["/home/addGenre"]);
  }
  onRemoveGenre(genreId: string) {
    this.http.delete<Genre>( "http://localhost:3000/api/genres/" + genreId)
    .pipe(switchMap((genre: Genre) => {
      return this.getGenres();
    })).subscribe((genres: Genre[]) => {
      this.sendGenres.next(genres);
      
    });
  }
  onUpdateGenre(genreId: string) {
    this.router.navigate(['/home/addGenre'], {queryParams: {id: genreId, mode: 'update'}});
  }

  updateGenre(genreId: string, genre: Genre){}

  addGenre(genre: Genre) {
    this.http.post<Genre>('http://localhost:3000/api/genres', genre).subscribe();
  }
}
