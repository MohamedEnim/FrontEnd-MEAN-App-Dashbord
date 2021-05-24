import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Genre } from 'src/app/models/genre';
import { AddMovieService } from 'src/app/services/add-movie.service';
import { GenresMoviesService } from 'src/app/services/genres-movies.service';

@Component({
  selector: 'app-add-genre',
  templateUrl: './add-genre.component.html',
  styleUrls: ['./add-genre.component.css']
})
export class AddGenreComponent implements OnInit {

  addGenreForm: FormGroup;
  genreId: string;
  private mode = "create";
  genreToUpdate: Genre;
 

  constructor(private genresMoviesSErv: GenresMoviesService, private addMovieSErv: AddMovieService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.addGenreForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      });

    this.route.queryParamMap.pipe(switchMap((params: ParamMap) => {
      this.genreId = params.get('id');
      this.mode = params.get('mode');
      if(this.genreId !== null && this.mode !== null){
        this.mode = 'update';
        return this.genresMoviesSErv.getGenreByID(this.genreId);    
      }else {
        this.mode = 'create';
        return of(null);
      }
    })).subscribe((data: any) => {
      if(this.mode === 'update'){
        this.genreToUpdate = data;
        this.addGenreForm .setValue({
          name: this.genreToUpdate.name,
        });
      }else{
        this.addGenreForm.reset();
    }
    });
  }



  onSubmit(){
    if (this.mode === "create") {
      let genre: Genre = {
        name: this.addGenreForm.value.name,
      }
     this.genresMoviesSErv.addGenre(genre);
    } else {
     let genre: Genre = {
       _id: this.genreToUpdate._id,
       name: this.addGenreForm.value.name,
      }
      this.genresMoviesSErv.updateGenre(this.genreToUpdate._id, genre);
      
     
    }
    this.resetFormAddGenre(this.addGenreForm);
    
  }
  
  private resetFormAddGenre(formGroup: FormGroup) {
    this.addGenreForm.reset();  
    this.addGenreForm.get('name').clearValidators();
    this.addGenreForm.get('name').updateValueAndValidity();
  }


}
