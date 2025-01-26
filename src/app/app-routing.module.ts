import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./bookmarks/bookmarks.module').then(m => m.BookmarksModule)
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
