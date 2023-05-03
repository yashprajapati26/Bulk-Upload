import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadCsvService {

  constructor(private http:HttpClient) { }

  upload(data:object):Observable<any>{
    let url = "http://localhost:3000/uploadCsv"
    return this.http.post(url,data)
  } 
}
