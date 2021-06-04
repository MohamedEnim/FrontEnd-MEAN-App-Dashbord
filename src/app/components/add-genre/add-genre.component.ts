import { Component, OnInit, ViewChild } from '@angular/core';
import {  NgForm } from '@angular/forms';
import { Genre } from 'src/app/models/genre';
import { GenresMoviesService } from 'src/app/services/genres-movies.service';

@Component({
  selector: 'app-add-genre',
  templateUrl: './add-genre.component.html',
  styleUrls: ['./add-genre.component.css']
})
export class AddGenreComponent implements OnInit {

  @ViewChild('addGenreForm') addGenreForm: NgForm;
  genreId: string;
  genreToUpdate: Genre;
 

  constructor(private genresMoviesSErv: GenresMoviesService) { }

  ngOnInit(): void {
  }


  onSubmit(){
      let genre: Genre = {
        name: this.addGenreForm.value.name,
      }
     this.genresMoviesSErv.addGenre(genre);  
  }
   
    
  canDeactivate(): boolean {
      if(this.addGenreForm.valid === true){
        return false;
      } else{
        return true;
      }
  }
  
}
