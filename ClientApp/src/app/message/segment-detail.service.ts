import { Inject, Injectable } from '@angular/core';
import { ISegmentDetails } from './message-models/HL7SegementDetails';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { subscribe } from 'diagnostics_channel';

@Injectable({
  providedIn: 'root',
})
export class SegmentDetailService {
  private SegmentDictionary: ISegmentDetails[] = [];
  apiBaseUrl: string;
  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private http: HttpClient,
  ) {
    this.apiBaseUrl = this.baseUrl + '../api/';
  }

  getSegmentDetails(segmentNames: string[]): Observable<ISegmentDetails> {
    return new Observable<ISegmentDetails>((subscriber) => {
      var need: string[] = [];
      segmentNames.forEach((name) => {
        var detail = this.SegmentDictionary.find((s) => s.SegmentType == name);
        if (detail) {
          subscriber.next(detail);
        } else {
          need.push(name);
        }
      });
      if (need.length > 0) {
        need.forEach((name) => {
          this.http
            .get<ISegmentDetails>(this.apiBaseUrl + `segmentdetials/${name}`)
            .subscribe((result) => {
              if (result) {
                this.SegmentDictionary.push(result);
              }
              subscriber.next(result);
            });
        });
      }
    });
  }
}
