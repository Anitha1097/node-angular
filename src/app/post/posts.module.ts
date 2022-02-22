import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { PostCreateComponent } from "./post-create/post-create.component";
import { PostListComponent } from "./post-list/post-list.component";
import { PostEditComponent } from './post-edit/post-edit.component';
import { AngularMaterialModule } from "../angular-material.module";
import { PostsRoutingModule } from "./posts-routing.module";

@NgModule({
  declarations: [PostCreateComponent, PostListComponent, PostEditComponent],
  imports: [
    CommonModule,FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule, PostsRoutingModule
  ]
})
export class PostsModule {}