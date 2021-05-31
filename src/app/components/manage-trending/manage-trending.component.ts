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
  selector: 'app-manage-trending',
  templateUrl: './manage-trending.component.html',
  styleUrls: ['./manage-trending.component.css']
})
export class ManageTrendingComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort; 

  displayedColumns: string[] = ['movieName', 'movieReleaseDate', 'movieGenres', 'movieUrl',  'createAt', 'updateAt', 'actions'];
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
     /* if(this.genreId !== null && this.genreName !== null){
        return this.addMovieSErv.getMoviesByGenre(this.genreId, this.genreName);
      }else {*/
        return this.addMovieSErv.getTrendingMovies();
     // }
     
  })).subscribe((movies: Movie[]) => {
   
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

getYear(date: string){
  return date.split('/')[2];
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

  ngOnDestroy(){
    this.sendMoviesSub.unsubscribe();
  }

}
