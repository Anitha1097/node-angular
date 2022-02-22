import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from "../post.model";
import { PostService } from '../../post.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from "rxjs";
import { PageEvent } from "@angular/material/paginator";
import { AuthService } from "../../auth/auth.service";
import { environment } from "../../../environments/environment";
const BACKEND_URL = environment.apiUrl + "/posts/";
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  totalPosts = 0;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  currentPage = 1;  userId: string;
  constructor(private postService: PostService, private httpClient: HttpClient, private authService: AuthService) { }
  post: Post[] = [];
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  @Input() posts: any[];
  private postsUpdated = new Subject<Post[]>(); isLoading = false;
  url = 'http://localhost:9000/api/posts/';
  ngOnInit() {
    this.isLoading = true;  
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.post = postData.posts;
      });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
          this.userId = this.authService.getUserId();
        });
  }

  posts1 = [
    { title: 'First post', content: "This is firt post's content" },
    { title: 'Second post', content: "This is second post's content " },
    { title: 'Third post', content: "This is third post's content" },
  ];
  postList = [];

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }
  deletePost(postId: string) {
    this.httpClient.delete(BACKEND_URL + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

}