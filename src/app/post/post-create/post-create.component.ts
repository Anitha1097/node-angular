import { Component, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormGroup, FormControl, Validators } from "@angular/forms";
// import { from, Observable, throwError } from 'rxjs';
import { Subscription } from 'rxjs';
import { PostService } from '../../post.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from "rxjs";
import { map } from 'rxjs/operators';
import { Post } from "../../post/post.model";
import { mimeType } from "../../mime-type.validator";
import { AuthService } from "../../auth/auth.service";
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']

})
export class PostCreateComponent implements OnInit, OnDestroy{
  constructor(private postService: PostService, private httpClient: HttpClient, private authService: AuthService) { }
  newPost = 'mean-course';
  post2 = "";
  postInput1 = ""; postInput2 = ""; public posts: any[]; 
  isLoading = false;   postForm: FormGroup;
  postsPerPage = 2;
  currentPage = 1;
  post: Post[] = [];    PostInputData = []; imagePreview: string;
  private postsSub: Subscription;
  private postsUpdated = new Subject<Post[]>();
  @Output() inputData = new EventEmitter();
  private authStatusSub: Subscription;
  ngOnInit() {
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    });
    this.postForm = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      password: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {validators: [Validators.required],asyncValidators: [mimeType]})
    });
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.post = postData.posts;
      });
  }

  onAddPost() {
    this.newPost = 'CONTENT';
  }
  onAddPost1(postInput) {
    this.newPost = postInput.value;
  }
  onAddPost2() {
    this.newPost = this.post2;
  }
  onAddPost3() {
    const posts = {
      title: this.postInput1,
      content: this.postInput2
    };
    this.postService.getAllData()
      .subscribe((data: any) => {
        this.posts = data.posts;
        console.log(data.posts);

        this.inputData.emit(data.posts);
      });
  }
  onSubmit() {
    // if (this.postForm.invalid) {
    //   return;
    // }
    // else {
    //   const post = {
    //     email: this.postForm.value.email,
    //     password: this.postForm.value.password,
    //     image: this.postForm.value.image
    //   };

    //   this.postService.postData(post)
    //     .subscribe((responseData: any) => {
    //       const post: Post = {
    //         id: responseData.postId,
    //         email: responseData.email,
    //         password: responseData.password
    //       };
    //         this.PostInputData.push(post);
    //       this.inputData.emit(post);
    //       this.postForm.reset();
    //     });
    // }

    if (this.postForm.invalid) {
      return;
    }
      this.postService.postData(
        this.postForm.value.email,
        this.postForm.value.password,
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
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
