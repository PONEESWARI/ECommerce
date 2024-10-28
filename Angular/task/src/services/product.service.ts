// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductService {
//   private apiUrl = 'http://localhost:3000/api/products'; // API endpoint

//   constructor(private http: HttpClient) {}

//   getProducts(): Observable<any[]> {
//     return this.http.get<any[]>(this.apiUrl); // Change the return type to any[]
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:3000/api/cart'; 
  private jsonUrl = 'assets/products.json'; // Path to the JSON file

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any> {
    return this.http.get(this.jsonUrl);
  }

  createOrder(orderSummary: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, orderSummary);
  }
  
}