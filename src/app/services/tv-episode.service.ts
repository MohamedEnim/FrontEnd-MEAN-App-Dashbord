import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { TVEpisode } from '../models/tvEpisode';

@Injectable({
  providedIn: 'root'
})
export class TvEpisodeService {
 
 
  onRemoveTVEpisode(tvEpisodeId: string) {
    throw new Error('Method not implemented.');
  }
  onUpdateTVEpisode(tvEpisodeId: string) {
    throw new Error('Method not implemented.');
  }

  sendTVEpisodes = new BehaviorSubject<TVEpisode[]>([]);

  constructor(private http: HttpClient,  private router: Router) { }

  addTVEpisode(tvEpisode: TVEpisode, episodesNum: number) {
    console.log(tvEpisode);

   return this.http
      .post<TVEpisode>(
        "http://localhost:3000/api/tvEpisodes",
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
    const date = now.getUTCDate()  + ',' + (now.getUTCMonth() + 1) + ',' + now.getUTCFullYear() ;
    const time = now.getUTCHours() + ':' + now.getUTCMinutes() + ':' + now.getUTCSeconds();
     return (date + '/' + time);
  }

  getTVEpisodeById(tvEpisodeId: string) {
    return this.http.get<TVEpisode>("http://localhost:3000/api/tvEpisodes/" + tvEpisodeId);
  }

  updateTVEpisode(tvEpisodeId: string, tvEpisode: TVEpisode){

  }

  onNavigateToAddTVEpisode() {
    throw new Error('Method not implemented.');
  }
}
