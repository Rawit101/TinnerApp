import { Component, inject, OnInit, WritableSignal } from '@angular/core'
import { LikeService } from '../_services/like.service'
import { defult_pageSizeOption, defult_paginator, Paginator, UserQueryPagination } from '../_models/pagination'
import { User } from '../_models/user'
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MemberCardComponent } from '../member/member-card/member-card.component'

@Component({
  selector: 'app-following',
  imports: [MatPaginatorModule, MatExpansionModule, FormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule, MatIconModule, MemberCardComponent],
  templateUrl: './following.component.html',
  styleUrl: './following.component.scss'
})
export class FollowingComponent implements OnInit {
  private likeService = inject(LikeService)
  following: WritableSignal<Paginator<UserQueryPagination, User>>
  pageSize = defult_pageSizeOption
  constructor() {
    this.following = this.likeService.following
  }
  ngOnInit(): void {
    this.onSearch()
  }

  async onSearch() {
    this.likeService.getFollowing()
  }

  onResetSearch() {
    this.following.set(defult_paginator)
    this.onSearch()
  }

  onPageChange(event: PageEvent) {
    const copyPaginator = this.following()
    copyPaginator.pagination.currentPage = event.pageIndex + 1
    copyPaginator.pagination.pageSize = event.pageSize
    this.following.set(copyPaginator)

    this.onSearch()
  }



}
