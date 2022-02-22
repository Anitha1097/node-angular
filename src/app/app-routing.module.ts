import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostListComponent } from "./post/post-list/post-list.component";

const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: "auth", loadChildren: ()=>import('./auth/auth.module').then(m=>m.AuthModule)},
  { path: "post", loadChildren: ()=>import('./post/posts.module').then(m=>m.PostsModule)}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }