import { Component, OnInit, EventEmitter } from '@angular/core';
import { NgForm } from "@angular/forms";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { from, Observable, throwError } from 'rxjs';
import { PostService } from '../../post.service';
import { Subscription } from 'rxjs';
import { Subject } from "rxjs";
import { map } from 'rxjs/operators';
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";


@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  post: Post;
  private mode = "create";
  private postId: string; isLoading = false;
  private postsSub: Subscription;imagePreview: string;postForm: FormGroup;
  form: FormGroup;
  constructor(public postsService: PostService,
    public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = { id: postData._id, email: postData.email, password: postData.password, imagePath: '', creator: null};
          console.log(this.post);
          // this.form.setValue({
          //   email: this.post.email,
          //   password: this.post.password,
          //   imagePath: this.post.imagePath
          // });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });

    this.postForm = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      current_password: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {validators: [Validators.required],asyncValidators: [mimeType]})
    });
  }
  onSavePost()
{
      if (this.postForm.invalid) {
        return;
      }
        this.postsService.updatePost(
          this.postId,
          this.postForm.value.email,
          this.postForm.value.current_password,
          this.postForm.value.image
        );
      this.postForm.reset();
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({image: file});
    this.postForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
