import { TodoDate } from './TodoDate';
import { Injectable } from '@angular/core';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];


@Injectable({
  providedIn: 'root'
})
export class TodoDateService {
  private date: Date;

  constructor(date: string = null) {
    if (date) {
      this.date = new Date(date);
    } else {
      this.date = new Date();
    }
  }

  getDate() {
    const date = String(this.date.getDate());
    const month = months[this.date.getMonth()];
    const year = String(this.date.getFullYear());
    let hour = String(this.date.getHours());
    let meridiem: string;
    let minutes = String(this.date.getMinutes());

    if (Number(minutes) < 10) {
      minutes = `0${minutes}`;
    }

    if (Number(hour) <= 11) {
      if (Number(hour) === 0) {
        hour = '12';
      }

      if (Number(hour) < 10) {
        hour = `0${hour}`;
      }

      meridiem = 'AM';
    } else {
      if (Number(hour) !== 12) {
        hour = String(24 - Number(hour));
      }

      if (Number(hour) < 10) {
        hour = `0${hour}`;
      }
      meridiem = 'PM';
    }

    const todoDate: TodoDate = {
      dateString: `${date} ${month}, ${year}`,
      timeString: `${hour}:${minutes} ${meridiem}`
    };

    return todoDate;
  }

  getUnixTime() {
    return this.date.getTime();
  }
}
