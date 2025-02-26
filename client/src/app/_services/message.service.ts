import { HttpClient } from '@angular/common/http'
import { inject, Injectable, signal } from '@angular/core'
import { environment } from '../../environments/environment'
import { defult_paginator, Paginator, QueryPagination } from '../_models/pagination'
import { Message } from '../_models/message'
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'
import { delay, firstValueFrom, retry, Subject, timer } from 'rxjs'
import { cacheManager } from '../_helper/cache'
import { parseQuery } from '../_helper/helper'

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl + 'api/messages'
  private wsUrl = environment.wsUrl

  paginator = signal<Paginator<QueryPagination, Message>>(defult_paginator)
  isWSConnected = signal<boolean>(false)

  private socket$!: WebSocketSubject<any>
  private messageSubject = new Subject<Message>()
  message$ = this.messageSubject.asObservable()

  constructor() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    this.wsUrl = environment.production ?
      `${protocol}//${window.location.host}${environment.wsUrl}` : environment.wsUrl
  }

  connect(recipient_id: string, token: string, user_id: string): void {
    const RECONNECT_INTERVAL = 5000
    this.socket$ = webSocket(`${this.wsUrl}?token=${token}&recipient_id=${recipient_id}`)
    this.socket$.pipe(
      retry({
        delay: err => {
          console.error('WebSocket Error ❌❌🚷❗')
          this.isWSConnected.set(false)
          console.log(`Retrying WebSocket in ${RECONNECT_INTERVAL}ms ...📶🛜🌐`)
          console.log(err)

          return timer(RECONNECT_INTERVAL)
        }

      })
    ).subscribe({

      next: msg => {
        this.isWSConnected.set(true)
        const message = msg as Message
        if (message.sender && message.recipient) {
          this.messageSubject.next(message)
        }
      },

      error: err => {
        this.isWSConnected.set(false)
        console.log('WebSocket Error ❗')
        console.log(err)

      },

      complete: () => {
        this.isWSConnected.set(false)
        console.log('WebSocket Disconnected. Reconnecting...🌐🌐🕐🔜')

      }
    })
  }

  sendMessage(message: Message): void {
    this.socket$.next(message)
  }

  close() {
    this.socket$.complete()

  }
  async getMessageHistory(recipient_id: string) {
    const pagination = this.paginator().pagination
    const key = cacheManager.createKey(pagination)

    const paginationCache = cacheManager.load(key, 'chat')
    if (paginationCache) {
      this.paginator.set(paginationCache)
      console.log('Get message history from cache 📦📦📦')
      return
    }
    console.log('Get message history from server 🌐🌐🌐')
    const url = this.baseUrl + `/${recipient_id}` + parseQuery(pagination)

    try {
      const paginator = await firstValueFrom(this.http.get<Paginator<QueryPagination, Message>>(url))
      cacheManager.save(key, 'chat', paginator)
      this.paginator.set(paginator)

    } catch (error) {
      console.error('Error getting message history from server fail 🌐🌐❌❌')
      console.error(error)
    }
  }
}
