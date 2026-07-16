import { Pipe, PipeTransform } from '@angular/core';
import { PhraseSetLanguage } from '../types/phrase-set.type';

@Pipe({
  name: 'tmLanguage',
})
export class TmLanguagePipe implements PipeTransform {
  transform(value: PhraseSetLanguage): string {
    return value == 'nahuatl_to_spanish' ? 'Nahuatl a Español' : 'Español a Nahuatl';
  }
}
