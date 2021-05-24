import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movie } from '../models/movie';
import { map, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddMovieService {

  movies: Movie[] = [];
  sendMovies = new BehaviorSubject<Movie[]>([]);

  constructor(private http: HttpClient,  private router: Router) { }

  addMovie(movie: Movie) {
    const postData = new FormData();
    postData.append("movieName", movie.movieName);
    for(let genre of movie.movieGenres){
      postData.append("movieGenres", genre)
    }
    postData.append("movieLanguage", movie.movieLanguage);
    postData.append("movieContry", movie.movieContry);
    postData.append("movieUrl", movie.movieUrl);
    postData.append("movieReleaseDate", movie.movieReleaseDate);
    postData.append("movieDuration", movie.movieDuration);
    postData.append("movieDescription", movie.movieDescription);
    postData.append("movieSubmitDate", movie.movieSubmitDate);
    postData.append("movieUpdateDate", movie.movieUpdateDate);
    postData.append("image", movie.moviePoster, movie.movieName);

    this.http
      .post<Movie>(
        "http://localhost:3000/api/movies",
        postData
      )
      .subscribe();
  }

  getMovies() {

    return this.http
      .get<Movie[]>(
        "http://localhost:3000/api/movies"
      )
      .pipe(map((responseData) => {
        let movies: Movie[] = []
        if(responseData.length > 1){
          for(let data of responseData){
            const movie: Movie = {
              _id: data._id,
              movieName: data.movieName,
              movieGenres: data.movieGenres,
              movieLanguage: data.movieLanguage,
              movieContry: data.movieContry,
              movieUrl: data.movieUrl,
              movieReleaseDate: data.movieReleaseDate,
              movieDuration: data.movieDuration,
              movieDescription: data.movieDescription,
              moviePoster: data.moviePoster,
              movieSubmitDate: data.movieSubmitDate,
              movieUpdateDate: data.movieUpdateDate
            };
            movies.push(movie);
          }
        } else if(responseData.length === 1) {
          const movie: Movie = {
            _id: responseData[0]._id,
            movieName: responseData[0].movieName,
            movieGenres: responseData[0].movieGenres,
            movieLanguage: responseData[0].movieLanguage,
            movieContry: responseData[0].movieContry,
            movieUrl: responseData[0].movieUrl,
            movieReleaseDate: responseData[0].movieReleaseDate,
            movieDuration: responseData[0].movieDuration,
            movieDescription: responseData[0].movieDescription,
            moviePoster: responseData[0].moviePoster,
            movieSubmitDate: responseData[0].movieSubmitDate,
            movieUpdateDate: responseData[0].movieUpdateDate
          }
          movies.push(movie);
        }else{
          movies = [];
        };
       
        return movies;
      }));
    
  }

  getMoviesByGenre(genreId: string, genreName: string) {
    console.log(genreName);
    return this.http
      .get<Movie[]>(
        "http://localhost:3000/api/movies/genre/" + genreName
      )
      .pipe(map((responseData) => {
        let movies: Movie[] = []
        if(responseData.length > 1){
          for(let data of responseData){
            const movie: Movie = {
              _id: data._id,
              movieName: data.movieName,
              movieGenres: data.movieGenres,
              movieLanguage: data.movieLanguage,
              movieContry: data.movieContry,
              movieUrl: data.movieUrl,
              movieReleaseDate: data.movieReleaseDate,
              movieDuration: data.movieDuration,
              movieDescription: data.movieDescription,
              moviePoster: data.moviePoster,
              movieSubmitDate: data.movieSubmitDate,
              movieUpdateDate: data.movieUpdateDate
            };
            movies.push(movie);
          }
        } else if(responseData.length == 1){
          console.log(responseData);
          const movie: Movie = {
            _id: responseData[0]._id,
            movieName: responseData[0].movieName,
            movieGenres: responseData[0].movieGenres,
            movieLanguage: responseData[0].movieLanguage,
            movieContry: responseData[0].movieContry,
            movieUrl: responseData[0].movieUrl,
            movieReleaseDate: responseData[0].movieReleaseDate,
            movieDuration: responseData[0].movieDuration,
            movieDescription: responseData[0].movieDescription,
            moviePoster: responseData[0].moviePoster,
            movieSubmitDate: responseData[0].movieSubmitDate,
            movieUpdateDate: responseData[0].movieUpdateDate
          };
          movies.push(movie);
        }else{
          movies = [];
        }
        return movies;
      }));
     /* .subscribe((movies: Movie[]) => {
        this.movies = movies;
        this.sendMovies.next(this.movies);
        this.router.navigate(["/home/movies"], {queryParams: {id: genreId ,genre: genreName}});
        console.log(this.movies);
      });*/
      //this.router.navigate(["/home/movies"], {queryParams: {id: genreId ,genre: genreName}});
  }

  getTimeStamp(){
    const now = new Date();
    const date = now.getUTCDate()  + ',' + (now.getUTCMonth() + 1) + ',' + now.getUTCFullYear() ;
    const time = now.getUTCHours() + ':' + now.getUTCMinutes() + ':' + now.getUTCSeconds();
     return (date + '/' + time);
  }

  onUpdateMovie(movieId: string){
    this.router.navigate(['/home/addMovie'], {queryParams: {id: movieId, mode: 'update'}});
  }

  updateMovie(movieId: string, movie: Movie){
    const postData = new FormData();
    postData.append("movieName", movie.movieName);
    for(let genre of movie.movieGenres){
      postData.append("movieGenres", genre)
    }
    postData.append("movieLanguage", movie.movieLanguage);
    postData.append("movieContry", movie.movieContry);
    postData.append("movieUrl", movie.movieUrl);
    postData.append("movieReleaseDate", movie.movieReleaseDate);
    postData.append("movieDuration", movie.movieDuration);
    postData.append("movieDescription", movie.movieDescription);
    postData.append("movieSubmitDate", movie.movieSubmitDate);
    postData.append("movieUpdateDate", movie.movieUpdateDate);
    postData.append("image", movie.moviePoster, movie.movieName);

     this.http.put<Movie>( "http://localhost:3000/api/movies/" + movieId, postData).subscribe();
  }

  updateMovieSamePoster(movieId: string, movie: Movie){
     this.http.put<Movie>( "http://localhost:3000/api/movies/samePoster/" + movieId, movie).subscribe();
  }

  getMoviesById(movieId: string) {
    return this.http
      .get<Movie>(
        "http://localhost:3000/api/movies/" + movieId
      )
      .pipe(map((responseData) => {
          const movie: Movie = {
            _id: responseData._id,
            movieName: responseData.movieName,
            movieGenres: responseData.movieGenres,
            movieLanguage: responseData.movieLanguage,
            movieContry: responseData.movieContry,
            movieUrl: responseData.movieUrl,
            movieReleaseDate: responseData.movieReleaseDate,
            movieDuration: responseData.movieDuration,
            movieDescription: responseData.movieDescription,
            moviePoster: responseData.moviePoster,
            movieSubmitDate: responseData.movieSubmitDate,
            movieUpdateDate: responseData.movieUpdateDate
          };
         
        return movie;
      }));
    
  }

  onRemoveMovie(movieId: string){
    this.http.delete<Movie>( "http://localhost:3000/api/movies/" + movieId)
    .pipe(switchMap((movie: Movie) => {
      return this.getMovies();
    })).subscribe((movies: Movie[]) => {
      this.sendMovies.next(movies);
      
    });
  }

  onNavigateToAddMovie(){
    this.router.navigate(['home/addMovie'],{queryParams: {mode: 'create'}});
}
}
