import { HttpClient } from '@angular/common/http'
import { inject, Injectable, signal } from '@angular/core'
import { environment } from '../../environments/environment'
import { defult_paginator, Paginator, UserQueryPagination } from '../_models/pagination'
import { User } from '../_models/user'
import { cacheManager } from '../_helper/cache'
import { parseQuery, parseUserPhoto } from '../_helper/helper'
import { firstValueFrom } from 'rxjs'


type dataCategory = 'members' | 'followers' | 'following'
@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  private url = environment.baseUrl + 'api/' //user
  paginator = signal<Paginator<UserQueryPagination, User>>(defult_paginator)

  private getData(category: dataCategory) {
    const pagination = this.paginator().pagination

    let key = cacheManager.createKey(pagination)
    const cacheData = cacheManager.load(key, category)
    if (cacheData) {
      console.log(`load ${category} from cache !!`)
      this.paginator.set(cacheData)
      return
    }


    const url = this.url + 'user/' + parseQuery(pagination)
    console.log(url)

    this.http.get<Paginator<UserQueryPagination, User>>(url).subscribe({
      next: (response) => {
        key = cacheManager.createKey(pagination)
        cacheManager.save(key, category, response)
        this.paginator.set(response)
      }
    })

  }
  getMember() {
    this.getData('members')
  }

  async getMemberByUsername(username: string): Promise<User | undefined> {
    const member = this.paginator().items.find(obj => obj.username === username)
    if (member) {
      console.log('get member by username from cache !!')
      return member
    } else {
      console.log('get member by username from api !!')
    }
    try {
      const url = this.url + 'user/' + username
      const _member = await firstValueFrom(this.http.get<User>(url))
      return parseUserPhoto(_member)
    } catch (error) {
      console.error('get member by username error:', error)
    }
    return undefined
  }
}
