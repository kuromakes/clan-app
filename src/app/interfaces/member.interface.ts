import { Injectable } from '@angular/core';

Injectable({
  providedIn: 'root'
})
export interface Member {
    name: string;
    icon: string;
    bungieId: string;
    destinyId: string;
    memberType: string;
    joinDate: string;
    status: string;
  }