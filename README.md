# Destiny 2 Clan Website App
v1.0.0 - Jaunary 17, 2019

This is an open source web application I built to help Destiny 2 players manage their clans. The app is built on Google's Angular framework, so if you're not familiar with web development principles, this process is going to feel quite complex and intimidating.

But fear not! I've provided _very_ specific, step-by-step instructions to set this up. If you follow these instructions verbatim, you should find yourself with a beautiful Destiny 2 Clan Web App in no time.

## Features
* Easy customizations in one central configuration file
* Interactive clan roster. Have a large, multi-clan organization? No problem, the app turns it into one roster.
* Individual player profiles with curated statistics, separated by PvP/PvE, and by character.
* Independent clan application system with email notifications
* Customizable light/dark themes (documentation on that coming soon)
* Runs on Angular 7
* Easy updates if/when I publish them
* $0/month to run. The only recurring cost is the domain name.

## Prerequisites
1. A computer that can run current versions of Node.js and Git Bash
2. A domain name, preferably purchased through [Google Domains](https://google.com/domains) (Optional)
2. Two Bungie API Keys
3. Clan Google/Gmail account
4. Clan Discord
5. One Google Sheets document saved to that account to store clan applications

## Disclaimers
* All the data and copyrights belongs to Bungie.
* Yes, if this is too much, you can [pay me](https://jesserogers.co/contact) to set it up for you. The code is free though (open source).
* Yes, you can ask me questions, but no I cannot guarantee I'll see it or have time to answer you.
* No, I don't offer support for this app. It'll work as long as nothing happens to the Bungie API. It's also open source, so yeah.

## Registering Your App with the Bungie API
The Bungie API is how we get all the data about our clan and its members, but we need to ask Bungie for a key that lets us into the API. We want to register two versions of our app: one that we can mess around with locally on our computer, and one that goes live online.
1. Go to the [Bungie Developer](https://www.bungie.net/developer)
2. Click "Create New App"
3. Under Application Name, enter "{{YOUR_CLAN_NAME}} - Dev"
4. You can enter your domain name where the production version will live under Website
5. You can leave OAuth Client Type and Redirect URL blank
6. Go ahead and check all the boxes under Scope just because
7. Under **Origin Header**, enter `localhost:4200`
8. Check the box to agree to terms and click "Create New App"
9. Repeat steps 1-8, but name it "{{YOUR_CLAN_NAME - Prod}}" and enter your **domain name** under Origin Header

## Setting up our Google Sheets "Database"
This app runs without a formal back end for accessibility and simplicity. Instead of running a more traditional back end, we can use Google Sheets for free!

This part involves a lot of small details, so read thoroughly and follow the steps carefully.

1. Sign into your clan Google account and go to [Google Sheets](https://sheets.google.com).
2. Give your document a name, like "{{YOUR_CLAN_NAME}} Applications"
3. Set up the header row
  * In the first row, enter each field that we expect to receive in the application in its own column:
    * "Gamertag"
    * "Discord"
    * "PvP KD"
    * "PvP KDA"
    * "PvP KAD"
    * "PvP Kills"
    * "PvE KD" (This is an average of their K/D in strikes and Raids)
    * "Raid Clears"
    * "Referred By"
    * "Applied"
  * Spelling and capitalization _do matter_ here.
  * This data set is static - if you wanted to customize what data you received for an application, you'd have to change the source code.
4. Go to File > Publish to the Web and click "Publish"
5. Click the "Share" button in the top right and allow sharing. Make sure it's set to "Anyone with the link can view."
5. Go to Tools > Script Editor
  * Sometimes this lags out and you have to click Script Editor multiple times
6. Change "_Untitled Project_" to "{{YOUR_CLAN_NAME}} Applications"
7. Copy and paste the entire contents of `applications.gs` into the code editor
8. Replace the placeholders in the `config` object:
  * Replace the `MY_SHEET_ID` placeholder with the key found in the URL of the spreadsheet. It should still be open in the other tab.
  * Get the `{{YOUR_SHEET_ID}}` out of `https://docs.google.com/spreadsheets/d/{{YOUR_SHEET_ID}}/edit#gid=0`
  * The sheet name is "Sheet1" by default, so leave that property as is unless you changed it in Google Sheets.
  * Replace `EMAIL_ADDRESS` with your clan email.
9. Go to Run > Run Function > setUp
  * This will bring up a modal asking for authorization. We need to give Google permission to run logic on our account's documents from this project. Click review permissions.
  * Contine to sign in and authenticate with your clan Google account.
  * If you see some error saying "This app isn't verified," click "Advanced" and then "Go to {{project}} (unsafe)"
  * Click Allow
10. Deploy our "back end"
  * Go to Publish > Deploy as Web App
  * Enter a short changelog, doesn't matter what you put there.
  * Execute the app as "Me"
  * Set "Who has access to the app" to "Anyone, Even Anonymous"
11. Save the script ID, as we'll use it as our `googleKey` later on.
  * After deploying, you'll see a text box labeled "Current web app URL"
  * `https://script.google.com/macros/s/{{YOUR_GOOGLE_KEY}}/exec`

When players successfully submit an application, you should receive an email notification with all of the application data, and it will log the data to the spreadsheet.

## Installing the App Locally in Your Machine

### Download this Github Repository as a .zip file
Click "clone or download" and select "Download Zip" and pick a file location you find appropriate. Next, we need to install some dependencies.

### Install Dependencies
1. **Install Node.js**
  * Node.js is server-side JavaScript that our Angular environment will run on. Go to the [Node.js](https://nodejs.org/) website and download the LTS version. Click on the one that says "recommended for most users on it." Run the installer when it downloads and follow the instructions. Default options are fine.
2. **Install Git Bash**
  * We're going to use Git Bash as our terminal of choice. Go to their [website](https://git-scm.com/downloads), download Git for your OS platform, and install it. Default options are fine.
3. **Install Microsoft VS Code**
  * This step is optional if you prefer a different IDE and know how to use the bash terminal, but if you plan to follow this guide step-by-step, installing it will make your life easier. Enable all the options during setup, especially the "open with code" one.

### Configure Your Clan Info
1. Open the project in VS Code
  * Find the github repo you downloaded earlier and unzip it. You'll see a new folder called "clan-app" when it's done. If you want to move the project somewhere else in your file system, now is a pretty good time. Open the folder "clan-app" with VS Code by right clicking on it. Or you can open up code first and find it through "Open Folder."
2. Navigate to `src` > `index.html`
  * Add your clan name where the HTML comment implies, inside the `title` tag
3. Navigate to `src` > `app` > `config` > `clan.config.ts`
4. Replace all placeholder strings in the Clan class:
  * If you followed the prerequisite instructions, it should be pretty self-explanatory as far as what goes where. There are also comments (grayed out text with `//` before it) in the file itself to provide some direction.
  * To find your clan ID, log in to [Bungie.net](https://wwww.bungie.net) and navigate to your clan page. In the URL, there's a query parameter `?groupid=YOUR_CLAN_ID`. Copy and paste the number after the `=` over the placeholder in the `clanIds` array. If you have multiple sub-clans, you can enter them in separated by commas, but still inside quotes.
  * Make sure to enter the Bungie API keys for Dev and Prod respectively.
  * Enter the script ID we got from deploying the Google Sheets Web App earlier, _not_ the sheet ID from the spreadsheet URL.
5. Navigate to `src` > `app` > `config` > `clan-bio` > `clan-bio.component.html`
6. Replace the HTML content of that file with whatever you want your Clan Bio to be.

### Serve the App Locally
1. Open the project in VS Code
2. Configure VS Code Terminal
  * Press `ctrl`/`cmd` + `shift` + `P` and search for "default shell," then select "Git Bash
  * Press `ctrl`/`cmd` + `\`` to bring up the bash terminal
3. Install **npm dependencies**
  * In the terminal, enter `npm i` and hit `enter`
  * This will install all the dependencies that are listed in `package.json`
  * It will likely warn you about vulnerabilities, so run `npm audit fix` next.
4. When running the app locally, make sure the **dev** API key is the one that is **not** commented out, and that the **prod** API key **is** commmented out.
  * You can comment/uncomment lines with the shortcut `cmd`/`ctrl` + `/`
5. Open the bash terminal, make the file path includes the `clan-app` directory, and serve the app with the command: `ng serve`
6. Open a browser (Google Chrome. Just use Google Chrome.) and navigate to `localhost:4200` and voila! There's your clan app, running in dev mode in your local environment.

And there you go! You can now play around with your app on a local dev server. To stop the server, enter the command `ctrl` + `C`.

## Publishing Your Clan App to the Internet!
We're going to host this app out of Google Firebase, which should be a cinch because we're already using Google Services for other things.

### Set up a Firebase Project
1. Sign into your clan Google Account
2. Get to [Google Firebase](https://firebase.google.com), and click **"Go to Console"**.
3. Click **Add Project** to begin setting up your project:
  * Give it whatever name you want. You can't change the **project ID** that gets generated at this stage though, so you may want to call it whatever your clan is called if that's going to bug you later.
  * Check all the boxes in the dialogue that pops up and create your project

### Add an App to Your Project
Sweet, your free firebase project has been set up, but there's nothing in it yet.
1. Under the **Project Overview** page, you should see a large message at the top that says **"Get started by adding Firebase to your app"**. There will be a few icon buttons underneath that list the different project types you can choose. **Choose the _web_ option** that has an icon that looks like this: `</>`
2. Clicking the icon should summon a popup with some code that Google wants you to copy/paste. There should be two `<script></script>` tags, so copy it all to your clipboard.
3. Navigate to `index.html` in the `src` folder of this app, and paste the script tags immediately after the HTML comment that says `<!-- PASTE FIREBASE CONFIG HERE -->`.

### Authenticate Your App Through NPM
Next we're going to install Firebase's NPM package so we can deploy our app directly from the command line. If you're serving the app, go ahead and stop the server before proceeding.
1. Open up the Git Bash terminal for your project (`ctrl`/`cmd` + `~` in VS Code) and type in the command:
  `npm install -g firebase-tools`
2. Once this succeeds, we need to log in to our Google account from the command line. Run the command:
  `firebase login`
  Enter your Google credentials as prompted.

### Deploying Your App
Deploying the app is surprisingly quick, but that doesn't mean it's an action you should take lightly. Test your app thoroughly on your local server before deploying to Firebase, and **always make sure the _prod_ API key is enabled before deploying**.
1. Again, don't forget to disable your **dev** key and enable your **prod** key in `clan.config.ts`! Otherwise your production app will not be able to communicate with Bungie's API.
2. Enter the command:
  `firebase deploy`
3. When this command completes, your project is live!

### Setting Up your Custom Domain Name
This step is technically optional. Since we're using Firebase's free tier, you could totally host this app with their default `*.firebaseapp.com` domain that comes with your project. But that doesn't look that cool, and you _probably_ bought a domain anyway.

It's important to note that you **must deploy your project** at least once before connecting a domain.
1. Navigate to **Develop > Hosting** in the Firebase Console
2. Click **Connect Domain** and enter your domain name into the text field
  * No need to check the redirect box
3. Make sure that Quick Setup is selected. You should see a small table with the columns **Record Type**, **Host**, and **Value**.
4. Copy both of the IP Addresses from the **Value** column and head over to [Google Domains](https://domains.google.com).
5. Find your domain from the list of **My Domains** and click on it. Then head to the **DNS** page under that domain.
6. Toward the bottom, you'll see a section titleed **Custom Resource Records**. Copy the first IP Address from Firebase where it says **"IPv4 address"**. There's a small `+` sign next to that text field. Click that and paste the second IP Address into the new text field that shows up. Click **Add**.
  * You can leave the **"@"**, **"A"**, and **"1H"** alone. All we're doing is adding the IP addresses.
7. At this point, your site should be more or less set up. It's going to take up to a few hours for Google to finish propagating that mapping and setting up your security certificate, but after a short time, you should see the status of the domain change to **"Connected"**.