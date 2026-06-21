// src/app/dynamo-storage.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

/**
 * Service for interacting with a DynamoDB-backed storage API.
 * Handles both direct API calls and legacy localStorage migration.
 */
@Injectable({
  providedIn: 'root',
})
export class DynamoStorageService {
  private endpoint = 'https://storage.puppeteerstudio.com';
  private auth_key = 'anon-api-startpoint'; // Consider moving this to environment variables or a config service

  constructor(private http: HttpClient) {}

  /**
   * Private helper to handle HTTP errors consistently.
   * @param error The HTTP error response.
   * @returns An observable that emits an error.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('DynamoStorageService error:', error);
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error(`Something bad happened; please try again later. Details: ${error.message}`)
    );
  }

  /**
   * Reads all items for a given auth_key from the dynamo table.
   * @param authKey - identifier for the current user
   * @returns Observable of an array of items
   */
  private _getAllItems(authKey: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.endpoint}/${authKey}`).pipe(catchError(this.handleError));
  }

  /**
   * Reads an item from the dynamo table.
   *
   * Note: The original implementation expected a base64 encoded string directly
   * as the response body after `response.json()`. HttpClient's `.json()` method
   * will parse the entire response as JSON. If the backend truly sends a simple
   * base64 string *as the whole response body* (not inside a JSON object),
   * you might need `responseType: 'text'` and then manually parse.
   *
   * Assuming `value` property inside a JSON response contains the base64 string,
   * or the response *is* the base64 string directly if `responseType: 'text'` is used.
   * For simplicity here, we'll assume the original logic meant the `response.json()`
   * *result* was the base64 string itself.
   *
   * @param authKey - identifier for the current user
   * @param dataKey - identifying key for the selected value
   * @returns Observable of the item value as a string, or null if not found/error.
   */
  private _getItemFromDynamo(authKey: string, dataKey: string): Observable<string | null> {
    return this.http.get<string>(`${this.endpoint}/${authKey}/${dataKey}`).pipe(
      map((value) => {
        // The original code uses `atob` on the direct JSON response.
        // If the backend sends a plain string (base64 encoded) and not JSON,
        // `responseType: 'text'` is appropriate.
        if (value) {
          try {
            return atob(value);
          } catch (e) {
            console.error('Error decoding base64 value from Dynamo:', e, { value });
            return null;
          }
        }
        return null;
      }),
      catchError((error: HttpErrorResponse) => {
        // For individual getItem, 404 might mean not found, not necessarily an error
        if (error.status === 404) {
          return of(null); // Return null for not found
        }
        this.handleError(error);
        return of(null);
      })
    );
  }

  /**
   * Adds an item to the dynamo table.
   * @param authKey - identifier for the current user
   * @param dataKey - identifying key for the selected value
   * @param dataValue - value to assign to this key
   * @returns Observable with success message
   */
  private _setItemToDynamo(authKey: string, dataKey: string, dataValue: any): Observable<any> {
    const requestOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    const body = {
      auth_key: authKey,
      data_key: dataKey,
      data_value: btoa(dataValue), // Encode value to Base64
    };
    return this.http
      .post<any>(this.endpoint, body, requestOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Deletes an item from the dynamo table.
   * @param authKey - identifier for the current user
   * @param dataKey - identifying key for the selected value
   * @returns Observable with success message
   */
  private _removeItemFromDynamo(authKey: string, dataKey: string): Observable<any> {
    return this.http
      .delete<any>(`${this.endpoint}/${authKey}/${dataKey}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Deletes all items from the dynamo table for the current user.
   * @param authKey - identifier for the current user
   * @returns Observable with success message
   */
  private _removeUserItemsFromDynamo(authKey: string): Observable<any> {
    return this.http.delete<any>(`${this.endpoint}/${authKey}`).pipe(catchError(this.handleError));
  }

  // --- Public methods for client consumption (with legacy migration logic) ---

  /**
   * Retrieves an item, prioritizing DynamoDB and migrating from localStorage if found there.
   * @param name The key of the item to retrieve.
   * @returns Observable of the item's value as a string, or null if not found.
   */
  getItem(name: string): Observable<string | null> {
    return this._getItemFromDynamo(this.auth_key, name).pipe(
      switchMap((dynamoDatum) => {
        if (dynamoDatum !== null) {
          // If found in Dynamo, return it
          return of(dynamoDatum);
        }

        // If not in Dynamo, check localStorage
        const legacyDatum = localStorage.getItem(name);
        if (legacyDatum) {
          // If present in local storage, add to Dynamo and remove locally
          return this._setItemToDynamo(this.auth_key, name, legacyDatum).pipe(
            map(() => {
              localStorage.removeItem(name);
              return legacyDatum;
            }),
            catchError((err) => {
              // If migration to Dynamo fails, still return the legacy data but log the error
              console.warn(
                `Failed to migrate item '${name}' from localStorage to DynamoDB, but returning local data.`,
                err
              );
              return of(legacyDatum);
            })
          );
        }

        // If not in Dynamo and not in localStorage
        return of(null);
      })
    );
  }

  async getItemAsync(name: string): Promise<string | null> {
    return new Promise<string | null>((resolve) => {
      this.getItem(name).subscribe(resolve);
    });
  }

  async setItemAsync(name: string, value: any): Promise<any> {
    return new Promise<any>((resolve) => {
      this.setItem(name, value).subscribe(resolve);
    });
  }

  /**
   * Sets an item in DynamoDB.
   * @param name The key of the item.
   * @param value The value to store.
   * @returns Observable with success message.
   */
  setItem(name: string, value: any): Observable<any> {
    return this._setItemToDynamo(this.auth_key, name, value);
  }

  /**
   * Deletes a specific item from DynamoDB.
   * @param name The key of the item to delete.
   * @returns Observable with success message.
   */
  removeItem(name: string): Observable<any> {
    return this._removeItemFromDynamo(this.auth_key, name);
  }

  /**
   * Deletes all items for the current user from DynamoDB.
   * @returns Observable with success message.
   */
  removeAllUserItems(): Observable<any> {
    return this._removeUserItemsFromDynamo(this.auth_key);
  }

  /**
   * Retrieves all items for the current user from DynamoDB.
   * @returns Observable of an array of all items.
   */
  getAllItems(): Observable<any[]> {
    return this._getAllItems(this.auth_key);
  }
}
