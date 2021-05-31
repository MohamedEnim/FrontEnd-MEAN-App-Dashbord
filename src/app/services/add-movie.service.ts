import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movie } from '../models/movie';
import { map, switchMap } from 'rxjs/operators';
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
    postData.append("duration", movie.duration);
    postData.append("descriptionEN", movie.descriptionEN);
    postData.append("descriptionAR", movie.descriptionAR);
    postData.append("movieTrending", movie.movieTrending.toString());
    postData.append("createAt", movie.createAt);
    postData.append("updateAt", movie.updateAt);
    postData.append("image", movie.moviePoster, movie.movieName);

    return this.http
      .post<Movie>(
        "http://localhost:3000/api/movies",
        postData
      )
     
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
              duration: data.duration,
              descriptionEN: data.descriptionEN,
              descriptionAR: data.descriptionAR,
              movieTrending: data.movieTrending,
              moviePoster: data.moviePoster,
              createAt: data.createAt,
              updateAt: data.updateAt
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
            duration: responseData[0].duration,
            descriptionEN: responseData[0].descriptionEN,
            descriptionAR: responseData[0].descriptionAR,
            movieTrending: responseData[0].movieTrending,
            moviePoster: responseData[0].moviePoster,
            createAt: responseData[0].createAt,
            updateAt: responseData[0].updateAt
          }
          movies.push(movie);
        }else{
          movies = [];
        };
       
        return movies;
      }));
    
  }

  /************Get Trending Movies**************** */
  getTrendingMovies() {

    return this.http
      .get<Movie[]>(
        "http://localhost:3000/api/movies/trending"
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
              duration: data.duration,
              descriptionEN: data.descriptionEN,
              descriptionAR: data.descriptionAR,
              movieTrending: data.movieTrending,
              moviePoster: data.moviePoster,
              createAt: data.createAt,
              updateAt: data.updateAt
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
            duration: responseData[0].duration,
            descriptionEN: responseData[0].descriptionEN,
            descriptionAR: responseData[0].descriptionAR,
            movieTrending: responseData[0].movieTrending,
            moviePoster: responseData[0].moviePoster,
            createAt: responseData[0].createAt,
            updateAt: responseData[0].updateAt
          }
          movies.push(movie);
        }else{
          movies = [];
        };
       
        return movies;
      }));
    
  }



  /********************************************* */
 /* getMoviesByGenre(genreId: string, genreName: string) {
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
              duration: data.duration,
              descriptionEN: data.descriptionEN,
              descriptionAR: data.descriptionAR,
              movieTrending: data.movieTrending,
              moviePoster: data.moviePoster,
              createAt: data.createAt,
              updateAt: data.updateAt
            };
            movies.push(movie);
          }
        } else if(responseData.length == 1){
          const movie: Movie = {
            _id: responseData[0]._id,
            movieName: responseData[0].movieName,
            movieGenres: responseData[0].movieGenres,
            movieLanguage: responseData[0].movieLanguage,
            movieContry: responseData[0].movieContry,
            movieUrl: responseData[0].movieUrl,
            movieReleaseDate: responseData[0].movieReleaseDate,
            duration: responseData[0].duration,
            descriptionEN: responseData[0].descriptionEN,
            descriptionAR: responseData[0].descriptionAR,
            movieTrending: responseData[0].movieTrending,
            moviePoster: responseData[0].moviePoster,
            createAt: responseData[0].createAt,
            updateAt: responseData[0].updateAt
          };
          movies.push(movie);
        }else{
          movies = [];
        }
        return movies;
      }));
  }*/

  getTimeStamp(){
    const now = new Date();
    const date = now.getUTCDate()  + '-' + (now.getUTCMonth() + 1) + '-' + now.getUTCFullYear() ;
    const time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
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
    postData.append("duration", movie.duration);
    postData.append("descriptionEN", movie.descriptionEN);
    postData.append("descriptionAR", movie.descriptionAR);
    postData.append("movieTrending", movie.movieTrending.toString());
    postData.append("createAt", movie.createAt);
    postData.append("updateAt", movie.updateAt);
    postData.append("image", movie.moviePoster, movie.movieName);

     return this.http.put<Movie>( "http://localhost:3000/api/movies/" + movieId, postData);
  }

  updateMovieSamePoster(movieId: string, movie: Movie){
    return this.http.put<Movie>( "http://localhost:3000/api/movies/samePoster/" + movieId, movie);
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
            duration: responseData.duration,
            descriptionEN: responseData.descriptionEN,
            descriptionAR: responseData.descriptionAR,
            movieTrending: responseData.movieTrending,
            moviePoster: responseData.moviePoster,
            createAt: responseData.createAt,
            updateAt: responseData.updateAt
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

onNavigateToAllMovies(){
   this.router.navigate(['/home/allMovies']);
}

}
