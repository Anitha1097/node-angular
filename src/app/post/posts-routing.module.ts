import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostCreateComponent } from "./post-create/post-create.component";
import { PostEditComponent } from "./post-edit/post-edit.component";
import { AuthGuard } from "../auth/auth-guard";
const routes: Routes = [
  { path: 'create', component: PostCreateComponent,  canActivate: [AuthGuard] },
  { path: 'edit/:postId', component: PostEditComponent,  canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class PostsRoutingModule { }