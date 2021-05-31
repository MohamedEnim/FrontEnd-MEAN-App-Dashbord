import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TVEpisode } from '../models/tvEpisode';
import { Location } from '@angular/common'

@Injectable({
  providedIn: 'root'
})
export class TvEpisodeService {
 

   sendTVEpisodes = new BehaviorSubject<TVEpisode[]>([]);

  constructor(private http: HttpClient,  private router: Router, private route: ActivatedRoute, private location: Location) { }


  addTVEpisode(tvEpisode: TVEpisode) {

   return this.http
      .post<TVEpisode>(
        "http://localhost:3000/api/tvEpisodes",
         tvEpisode
      );
  }

  addTVEpisodeTable(tvEpisode: TVEpisode, episodesNum: number) {

   return this.http
      .post<TVEpisode>(
        "http://localhost:3000/api/tvEpisodes/add",
         tvEpisode
      );
  }


  getTVEpisodes() {

    return this.http
      .get<TVEpisode[]>(
        "http://localhost:3000/api/tvEpisodes"
      )
      .pipe(map((responseData) => {
        let tvEpisodes: TVEpisode[] = []
        if(responseData.length > 1){
          for(let data of responseData){
            const tvEpisode: TVEpisode = {
              _id: data._id,
              tvShowName: data.tvShowName,
              tvShowId: data.tvShowId,
              tvShowPoster: data.tvShowPoster,
              tvShowSeason: data.tvShowSeason,
              tvShowReleaseDate: data.tvShowReleaseDate,
              tvEpisodeUrl: data.tvEpisodeUrl,
              tvEpisodeNum: data.tvEpisodeNum,
              tvEpisodeLanguage: data.tvEpisodeLanguage,
              tvEpisodeContry: data.tvEpisodeContry,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt
            };
            tvEpisodes.push(tvEpisode);
          }
        } else if(responseData.length == 1){
          const tvEpisode: TVEpisode = {
              _id: responseData[0]._id,
              tvShowName: responseData[0].tvShowName,
              tvShowId: responseData[0].tvShowId,
              tvShowPoster: responseData[0].tvShowPoster,
              tvShowSeason: responseData[0].tvShowSeason,
              tvShowReleaseDate: responseData[0].tvShowReleaseDate,
              tvEpisodeUrl: responseData[0].tvEpisodeUrl,
              tvEpisodeNum: responseData[0].tvEpisodeNum,
              tvEpisodeLanguage: responseData[0].tvEpisodeLanguage,
              tvEpisodeContry: responseData[0].tvEpisodeContry,
              createdAt: responseData[0].createdAt,
              updatedAt: responseData[0].updatedAt
          };
          tvEpisodes.push(tvEpisode);
        }else{
          tvEpisodes = [];
        }
       
        return tvEpisodes;
      }));
      
  }

  getTimeStamp(){
    const now = new Date();
    const date = now.getUTCDate()  + '-' + (now.getUTCMonth() + 1) + '-' + now.getUTCFullYear() ;
    const time = now.getUTCHours() + ':' + now.getUTCMinutes() + ':' + now.getUTCSeconds();
     return (date + '/' + time);
  }
/***/ 
  getTVEpisodesById(tvShowId: string) {
    return this.http.get<TVEpisode[]>("http://localhost:3000/api/tvEpisodes/" + tvShowId);
  }

  /***/ 
  getTVEpisodeById(tvEpisodeId: string) {
    return this.http.get<TVEpisode>("http://localhost:3000/api/tvEpisodes/toUpdate/" + tvEpisodeId);
  }


  updateTVEpisode(tvEpisodeId: string, tvEpisode: TVEpisode){
      return this.http.put<TVEpisode>( "http://localhost:3000/api/tvEpisodes/" + tvEpisodeId, tvEpisode);
  }

  onRemoveTVEpisode(tvEpisodeId: string, tvShowId: string) {
    this.http.delete<TVEpisode>( "http://localhost:3000/api/tvEpisodes/" + tvEpisodeId + "/" + tvShowId)
    .pipe(switchMap((tvEpisode: TVEpisode) => {
      return this.getTVEpisodesById(tvShowId);
    })).subscribe((tvEpisodes: TVEpisode[]) => {
      this.sendTVEpisodes.next(tvEpisodes);   
    });
  }

  onNavigateToAddTVShow(){
    //this.router.navigate(['../'], {relativeTo: this.route});
    this.location.back();
  }

  onNavigateToAddTVEpisode(tvShowId: string){
    this.router.navigate(['/home/addEpisode'], {queryParams: {id: tvShowId, mode: 'add'}});
  }

  onNavigateToTvEpisodes(tvShowId: string) {
    this.router.navigate(['/home/allTVEpisodes'], {queryParams: {id: tvShowId}});
  }

  onNavigateToAddSeason(tvShowId: string){
    this.router.navigate(['/home/addSeason'], {queryParams: {id: tvShowId}});
  }

  onUpdateTVEpisode(tvEpisode: string, tvShowId: string) {
    this.router.navigate(['/home/addEpisode'], {queryParams: {id: tvShowId, episodeId: tvEpisode, mode: 'update'}})
  }
 
}
