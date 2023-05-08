import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadCsvService {

  constructor(private http:HttpClient) { }

  upload(data:any):Observable<any>{
    let url = "http://localhost:3000/uploadData"
    return this.http.post(url,data)
  } 
}
