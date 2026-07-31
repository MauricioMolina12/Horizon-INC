import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 200, fullText: boolean = false): string {
    if (!value) return '';
    return fullText || value.length <= limit ? value : value.substring(0, limit) + '...';
  }
}

@Pipe({
  name: 'truncateUsername',
  standalone: true
})
export class TruncateUsername implements PipeTransform {
  transform(value: string, limit: number = 2): string {
    if (!value?.trim()) {
      return 'Bienvenido';
    }

    return value
      .trim()
      .split(/\s+/)
      .slice(0, limit)
      .join(' ');
  }
}