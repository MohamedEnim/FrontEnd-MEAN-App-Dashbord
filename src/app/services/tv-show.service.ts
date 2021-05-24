import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TVShow } from '../models/tvShow';

@Injectable({
  providedIn: 'root'
})
export class TvShowService {

  updateTVShow(_id: string, tvShow: TVShow) {
    throw new Error('Method not implemented.');
  }
  updateTVShowSamePoster(_id: string, tvShow: TVShow) {
    throw new Error('Method not implemented.');
  }
  
  sendTVShows = new BehaviorSubject<TVShow[]>([]);

  constructor(private http: HttpClient,  private router: Router) { }

  addTVShow(tvShow: TVShow) {
    const postData = new FormData();
    postData.append("tvShowName",tvShow.tvShowName);
    for(let genre of tvShow.tvShowGenres){
      postData.append("tvShowGenres", genre)
    }
    postData.append("tvShowLanguage", tvShow.tvShowLanguage);
    postData.append("tvShowContry", tvShow.tvShowContry);
    postData.append("tvShowSeason", tvShow.tvShowSeason.toString());
    postData.append("tvShowReleaseDate", tvShow.tvShowReleaseDate.toString());
    postData.append("tvShowEpisodes", tvShow.tvShowEpisodes.toString());
    postData.append("tvShowDescription", tvShow.tvShowDescription);
    postData.append("image", tvShow.tvShowPoster, tvShow.tvShowName);
    postData.append("createdAt", tvShow.createdAt);
    postData.append("updatedAt", tvShow.updatedAt);

    console.log(postData.getAll('tvShowGenres'));
    console.log(postData.get('tvShowName'))
    console.log(postData.get('image'))
    
    console.log(postData.get('tvShowSeason'))

   return this.http
      .post<TVShow>(
        "http://localhost:3000/api/tvShows",
        postData
      ).pipe(map((responseData) => {
        let tvShow: TVShow = {
          _id: responseData._id,
          tvShowName: responseData.tvShowName,
          tvShowGenres: responseData.tvShowGenres,
          tvShowLanguage: responseData.tvShowLanguage,
          tvShowContry: responseData.tvShowContry,
          tvShowSeason: responseData.tvShowSeason,
          tvShowReleaseDate: responseData.tvShowReleaseDate,
          tvShowEpisodes: responseData.tvShowEpisodes,
          tvShowDescription: responseData.tvShowDescription,
          tvShowPoster: responseData.tvShowPoster,
          createdAt: responseData.createdAt,
          updatedAt: responseData.updatedAt
        }   
       
      return tvShow;
    }));;
      
  }

  getTVShows() {

    return this.http
      .get<TVShow[]>(
        "http://localhost:3000/api/tvShows"
      )
      .pipe(map((responseData) => {
        let tvShows: TVShow[] = []
        if(responseData.length > 1){
          for(let data of responseData){
            const tvShow: TVShow = {
              _id: data._id,
              tvShowName: data.tvShowName,
              tvShowGenres: data.tvShowGenres,
              tvShowLanguage: data.tvShowLanguage,
              tvShowContry: data.tvShowContry,
              tvShowSeason: data.tvShowSeason,
              tvShowReleaseDate: data.tvShowReleaseDate,
              tvShowEpisodes: data.tvShowEpisodes,
              tvShowDescription: data.tvShowDescription,
              tvShowPoster: data.tvShowPoster,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt
            };
            tvShows.push(tvShow);
          }
        } else if(responseData.length == 1){
          const tvShow: TVShow = {
              _id: responseData[0]._id,
              tvShowName: responseData[0].tvShowName,
              tvShowGenres: responseData[0].tvShowGenres,
              tvShowLanguage: responseData[0].tvShowLanguage,
              tvShowContry: responseData[0].tvShowContry,
              tvShowSeason: responseData[0].tvShowSeason,
              tvShowReleaseDate: responseData[0].tvShowReleaseDate,
              tvShowEpisodes: responseData[0].tvShowEpisodes,
              tvShowDescription: responseData[0].tvShowDescription,
              tvShowPoster: responseData[0].tvShowPoster,
              createdAt: responseData[0].createdAt,
              updatedAt: responseData[0].updatedAt
          };
          tvShows.push(tvShow);
        }else{
          tvShows = [];
        }
       
        return tvShows;
      }));
      
  }

  getTimeStamp(){
    const now = new Date();
    const date = now.getUTCDate()  + ',' + (now.getUTCMonth() + 1) + ',' + now.getUTCFullYear() ;
    const time = now.getUTCHours() + ':' + now.getUTCMinutes() + ':' + now.getUTCSeconds();
     return (date + '/' + time);
  }

  onNavigateToAddTVShow() {
    this.router.navigate(['home/addTVShow'],{queryParams: {mode: 'create'}});
  }

  onUpdateTVShow(tvShowId: string) {
    this.router.navigate(['/home/addTVShow'], {queryParams: {id: tvShowId, mode: 'update'}});
  }

  onRemoveTVShow(tvShowId: string) {
    this.http.delete<TVShow>( "http://localhost:3000/api/movies/" + tvShowId)
    .pipe(switchMap((tvShow: TVShow) => {
      return this.getTVShows();
    })).subscribe((tvShows: TVShow[]) => {
      this.sendTVShows.next(tvShows);
      
    });
  }

  getTVShowById(tvShowId: string): any {
    return this.http
    .get<TVShow>(
      "http://localhost:3000/api/tvShows/" + tvShowId
    )
    .pipe(map((responseData) => {
        const tvShow: TVShow = {
            _id: responseData._id,
            tvShowName: responseData.tvShowName,
            tvShowGenres: responseData.tvShowGenres,
            tvShowLanguage: responseData.tvShowLanguage,
            tvShowContry: responseData.tvShowContry,
            tvShowSeason: responseData.tvShowSeason,
            tvShowReleaseDate: responseData.tvShowReleaseDate,
            tvShowEpisodes: responseData.tvShowEpisodes,
            tvShowDescription: responseData.tvShowDescription,
            tvShowPoster: responseData.tvShowPoster,
            createdAt: responseData.createdAt,
            updatedAt: responseData.updatedAt
        };
      return tvShow;
    }));
  }
}
