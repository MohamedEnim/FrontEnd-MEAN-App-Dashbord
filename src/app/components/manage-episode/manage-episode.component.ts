import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TVEpisode } from 'src/app/models/tvEpisode';
import { TVShow } from 'src/app/models/tvShow';
import { TvEpisodeService } from 'src/app/services/tv-episode.service';
import { TvShowService } from 'src/app/services/tv-show.service';
import { TvEpisodesComponent } from '../tv-episodes/tv-episodes.component';


@Component({
  selector: 'app-manage-episode',
  templateUrl: './manage-episode.component.html',
  styleUrls: ['./manage-episode.component.css']
})
export class ManageEpisodeComponent implements OnInit {

   
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort; 

  displayedColumns: string[] = ['tvEpisodeNum', 'tvEpisodeUrl',  'createdAt', 'updatedAt', 'actions'];
  dataSource: MatTableDataSource<TVEpisode>;
  tvEpisodes: TVEpisode[] = [];
  sendTVEpisodesSub: Subscription;
  genreId: string;
  genreName: string;
  length: number;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  tvShowId: string = null;
  tvShowName: string;
  tvShowSeason: string
  tvShow: TVShow;
  tvShowEpsNum: string;
  epsArray: number[];

  constructor(private tvEpisodeSErv: TvEpisodeService, private route: ActivatedRoute, public dialog: MatDialog,
    private tvShowSErv: TvShowService) { }

  ngOnInit(): void {
    
    this.route.queryParamMap.pipe(switchMap((params: ParamMap) => {
      this.tvShowId = params.get('id');
        return this.tvShowSErv.getTVShowById(this.tvShowId);
      
    }), switchMap((tvShow: TVShow) => {
        this.tvShow = tvShow;
        this.tvShowName = this.tvShow.tvShowName;
        this.tvShowSeason= this.tvShow.tvShowSeason;
        this.tvShowEpsNum = this.tvShow.tvShowEpisodes;
        this.epsArray = this.getEpisodesArray(this.tvShowEpsNum);
        return this.tvEpisodeSErv.getTVEpisodesById(this.tvShowId);       

    })).subscribe((tvEpisodes: TVEpisode[]) => {
   
    this.tvEpisodes = tvEpisodes;
    this.length = this.tvEpisodes.length;
    this.dataSource = new MatTableDataSource<TVEpisode>(tvEpisodes);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  });
   this.sendTVEpisodesSub = this.tvEpisodeSErv.sendTVEpisodes.subscribe((tvEpisodes: TVEpisode[]) =>{
    this.tvEpisodes = tvEpisodes;
    this.length = this.tvEpisodes.length;
    this.dataSource = new MatTableDataSource<TVEpisode>(tvEpisodes);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    });
  }


  onUpdateTVEpisode(tvEpisode: string){
    this.tvEpisodeSErv.onUpdateTVEpisode(tvEpisode, this.tvShowId);
  }

  onRemoveTVEpisode(tvEpisodeId: string){
    this.tvEpisodeSErv.onRemoveTVEpisode(tvEpisodeId, this.tvShowId);  //TO DO
  }

  onNavigateToAddTVEpisode(){
    this.tvEpisodeSErv.onNavigateToAddTVEpisode(this.tvShowId);
  }

private getEpisodesArray(epsNumStr: string){
  const epsNumInt: number = parseInt(epsNumStr);
  let epsArray: number[] = [];
  for(let i=1; i<= epsNumInt; i++){
    epsArray.push(i);
  }
  return epsArray;
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

onNavigateToAddSeason(){
  this.tvEpisodeSErv.onNavigateToAddSeason(this.tvShowId);
}

  ngOnDestroy(){
    this.sendTVEpisodesSub.unsubscribe();
  }

}
