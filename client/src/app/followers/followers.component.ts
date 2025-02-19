import { Component, inject, OnInit, WritableSignal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatSelectModule } from '@angular/material/select'
import { MemberCardComponent } from '../member/member-card/member-card.component'
import { defult_pageSizeOption, defult_paginator, Paginator, UserQueryPagination } from '../_models/pagination'
import { LikeService } from '../_services/like.service'
import { User } from '../_models/user'

@Component({
  selector: 'app-followers',
  imports: [MatPaginatorModule, MatExpansionModule, FormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule, MatIconModule, MemberCardComponent],
  templateUrl: './followers.component.html',
  styleUrl: './followers.component.scss'
})
export class FollowersComponent implements OnInit {

  private likeService = inject(LikeService)
  followers: WritableSignal<Paginator<UserQueryPagination, User>>
  pageSize = defult_pageSizeOption

  constructor() {
    this.followers = this.likeService.followers
  }
  ngOnInit(): void {
    this.onSearch()
  }

  async onSearch() {
    this.likeService.getFollwers()
  }

  onResetSearch() {
    this.followers.set(defult_paginator)
    this.onSearch()
  }

  onPageChange(event: PageEvent) {
    const copyPaginator = this.followers()
    copyPaginator.pagination.currentPage = event.pageIndex + 1
    copyPaginator.pagination.pageSize = event.pageSize
    this.followers.set(copyPaginator)

    this.onSearch()
  }



}

