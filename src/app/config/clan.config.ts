import { Injectable } from '@angular/core';

enum Platforms {
  XBOX = 1,
  PS4 = 2,
  PC = 4
}

@Injectable({
  providedIn: 'root'
})
export class Clan {
  // BEGIN EDITING
  name: string = `MY_CLAN_NAME`;
  tagline: string = null; // replace "null" with your clan tagline if wanted
  platform: number = Platforms.PC; // options: Platforms.PS4, Platforms.XBOX, Platforms.PC
  clanIds: Array<string> = ['MY_CLAN_ID']; // multiple clans e.g. ['CLAN_ID_1', 'CLAN_ID_2', ...]
  contact: string = `MY_DISCORD_NAME`; // main contact discord name(s)
  apiKey: string = `MY_DEV_API_KEY`; // dev
  // apiKey: string= `MY_PROD_API_KEY`; // prod
  googleKey: string = `YOUR_GOOGLE_KEY`;
  // format your FAQ questions like the examples below
  // make sure to put a comma after the question
  // Use backticks because you won't have to escape characters that way (thanks ES6)
  faq: Array<any> = [
    {
      question: `<YOUR_FIRST_QUESTION_HERE>`, // comma after question
      answer: `<YOUR_FIRST_ANSWER_HERE>`
    }, // comma after each entry
    {
      question: ``,
      answer: ``
    }
  ];
  // default rank names from Bungie - customize as wanted
  ranks = {
    1: `Beginner`,
    2: `Member`,
    3: `Administrator`,
    5: `Founder`
  };
  // END EDITING
}
