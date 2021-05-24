import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Genre } from 'src/app/models/genre';
import { AddMovieService } from 'src/app/services/add-movie.service';
import { GenresMoviesService } from 'src/app/services/genres-movies.service';

@Component({
  selector: 'app-manage-genre',
  templateUrl: './manage-genre.component.html',
  styleUrls: ['./manage-genre.component.css']
})
export class ManageGenreComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort; 

  displayedColumns: string[] = ['name', 'update', 'remove'];
  dataSource: MatTableDataSource<Genre>;
  genres: Genre[] = [];
  sendGenresSub: Subscription;
  length: number;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100]

  constructor(private addMovieSErv: AddMovieService, private route: ActivatedRoute,
    private genresMoviesSErv: GenresMoviesService) { }

  ngOnInit(): void {

      this.genresMoviesSErv.getGenres().subscribe((genres: Genre[]) => {
        this.genres = genres;
        this.length = this.genres.length;
        this.dataSource = new MatTableDataSource<Genre>(genres);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
      this.sendGenresSub = this.genresMoviesSErv.sendGenres.subscribe((genres: Genre[]) =>{
        this.genres = genres;
        this.dataSource = new MatTableDataSource<Genre>(genres);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        });
  }

  onUpdateGenre(genreId: string){
    this.genresMoviesSErv.onUpdateGenre(genreId);
  }

  onRemoveGenre(genreId: string){
    this.genresMoviesSErv.onRemoveGenre(genreId);
    
  }

  onNavigateToAddGenre(){
    this.genresMoviesSErv.onNavigateToAddGenre();
}

ngOnDestroy(){
  this.sendGenresSub.unsubscribe();
}

}
