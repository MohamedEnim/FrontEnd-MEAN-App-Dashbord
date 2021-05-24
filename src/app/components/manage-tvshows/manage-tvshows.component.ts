import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TVShow } from 'src/app/models/tvShow';
import { TvShowService } from 'src/app/services/tv-show.service';

@Component({
  selector: 'app-manage-tvshows',
  templateUrl: './manage-tvshows.component.html',
  styleUrls: ['./manage-tvshows.component.css']
})
export class ManageTVShowsComponent implements OnInit {

   
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort; 

  displayedColumns: string[] = ['tvShowName', 'tvShowReleaseDate', 'tvShowGenres', 'episodes', 'createdAt', 'updatedAt', 'update', 'remove'];
  dataSource: MatTableDataSource<TVShow>;
  tvShows: TVShow[] = [];
  sendtvShowsSub: Subscription;
  tvShowId: string;
  tvShowName: string;
  length: number;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100]

  constructor(private tvShowSErv: TvShowService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    
    this.tvShowSErv.getTVShows().subscribe((tvShows: TVShow[]) => { 
      this.tvShows = tvShows;
      this.length = this.tvShows.length;
      this.dataSource = new MatTableDataSource<TVShow>(tvShows);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  });
    this.sendtvShowsSub = this.tvShowSErv.sendTVShows.subscribe((tvShows: TVShow[]) =>{
      this.tvShows = tvShows;
      this.length = this.tvShows.length;
      this.dataSource = new MatTableDataSource<TVShow>(tvShows);
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

  onUpdateTVShow(tvShowId: string){
    this.tvShowSErv.onUpdateTVShow(tvShowId);
  }

  onRemoveTVShow(tvhowId: string){
    this.tvShowSErv.onRemoveTVShow(tvhowId); 
  }

  onNavigateToAddTVShow(){
    this.tvShowSErv. onNavigateToAddTVShow();
}

  ngOnDestroy(){
    this.sendtvShowsSub.unsubscribe();
  }

}
