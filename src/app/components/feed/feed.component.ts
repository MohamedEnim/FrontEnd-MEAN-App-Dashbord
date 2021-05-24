import { AfterViewInit, Component,  OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Genre } from 'src/app/models/genre';
import { Movie } from 'src/app/models/movie';
import { AddMovieService } from 'src/app/services/add-movie.service';
import { GenresMoviesService } from 'src/app/services/genres-movies.service';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
  
})
export class FeedComponent implements OnInit, OnDestroy, AfterViewInit{

  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort; 

  displayedColumns: string[] = ['movieName', 'movieReleaseDate', 'movieGenres', 'url',  'movieSubmitDate', 'movieUpdateDate', 'update', 'remove'];
  dataSource: MatTableDataSource<Movie>;
  movies: Movie[] = [];
  sendMoviesSub: Subscription;
  genreId: string;
  genreName: string;
  length: number;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100]

  constructor(private addMovieSErv: AddMovieService, private route: ActivatedRoute,
    private genresMoviesSErv: GenresMoviesService) { }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(switchMap((params: ParamMap) => {
      this.genreId = params.get('id');
      this.genreName = params.get('genre');
      if(this.genreId !== null && this.genreName !== null){
        console.log("genreMov");
        return this.addMovieSErv.getMoviesByGenre(this.genreId, this.genreName);
      }else {
        return this.addMovieSErv.getMovies();
      }
     
  })).subscribe((movies: Movie[]) => {
    console.log(movies);
    this.movies = movies;
    this.length = this.movies.length;
    this.dataSource = new MatTableDataSource<Movie>(movies);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  });
   this.sendMoviesSub = this.addMovieSErv.sendMovies.subscribe((movies: Movie[]) =>{
    this.movies = movies;
    this.dataSource = new MatTableDataSource<Movie>(movies);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit() {
   
  }

  tableToString(genres: [string]){
    let genresSTR: string = '';
    for(let genre of genres){
      genresSTR += genre + ', ';
    }
   let editGenresSTR = genresSTR.slice(0, -2);
    return editGenresSTR;
  }

  onUpdateMovie(movieId: string){
    this.addMovieSErv.onUpdateMovie(movieId);
  }

  onRemoveMovie(movieId: string){
    this.addMovieSErv.onRemoveMovie(movieId);
    
  }

  onNavigateToAddMovie(){
    this.addMovieSErv.onNavigateToAddMovie();
}

  ngOnDestroy(){
    this.sendMoviesSub.unsubscribe();
  }


}
