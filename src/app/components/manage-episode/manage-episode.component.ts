import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TVEpisode } from 'src/app/models/tvEpisode';
import { TvEpisodeService } from 'src/app/services/tv-episode.service';
import { TvEpisodesComponent } from '../tv-episodes/tv-episodes.component';


@Component({
  selector: 'app-manage-episode',
  templateUrl: './manage-episode.component.html',
  styleUrls: ['./manage-episode.component.css']
})
export class ManageEpisodeComponent implements OnInit {

   
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort; 

  displayedColumns: string[] = ['tvShowName', 'tvShowReleaseDate', 'tvEpisodeNum', 'tvEpisodeUrl',  'createdAt', 'updatedAt', 'update', 'remove'];
  dataSource: MatTableDataSource<TVEpisode>;
  tvEpisodes: TVEpisode[] = [];
  sendTVEpisodesSub: Subscription;
  genreId: string;
  genreName: string;
  length: number;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  tvEpisodeId: string = null;

  constructor(private tvEpisodeSErv: TvEpisodeService, private route: ActivatedRoute, public dialog: MatDialog) { }

  ngOnInit(): void {
    
    this.route.queryParamMap.pipe(switchMap((params: ParamMap) => {
      this.tvEpisodeId = params.get('id');
     
      if(this.tvEpisodeId !== null){
        return this.tvEpisodeSErv.getTVEpisodeById(this.tvEpisodeId);   //TO DO  
      }else {
       
        return this.tvEpisodeSErv.getTVEpisodes();
      }
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

  ngAfterViewInit() {
   
  }

 /* tableToString(genres: [string]){
    let genresSTR: string = '';
    for(let genre of genres){
      genresSTR += genre + ', ';
    }
   let editGenresSTR = genresSTR.slice(0, -2);
    return editGenresSTR;
  }*/

  onUpdateTVEpisode(tvEpisode: TVEpisode){
   // this.tvEpisodeSErv.onUpdateTVEpisode(tvEpisodeId); //TO DO
   let dialogRef = this.dialog.open(TvEpisodesComponent, {
    height: '400px',
    width: '600px',
    data: {
      tvEpisode: tvEpisode, 
      mode: 'create'
    }
  });

  }

  onRemoveTVEpisode(tvEpisodeId: string){
    this.tvEpisodeSErv.onRemoveTVEpisode(tvEpisodeId);  //TO DO
  }

  onNavigateToAddTVEpisode(){
   // this.tvEpisodeSErv.onNavigateToAddTVEpisode(); //TO DO
  /* let dialogRef = this.dialog.open(TvEpisodesComponent, {
    height: '400px',
    width: '600px',
    data: {
      tvEpisode: , 
      mode: 'create'
    }
  });  */
}

  ngOnDestroy(){
    this.sendTVEpisodesSub.unsubscribe();
  }

}
