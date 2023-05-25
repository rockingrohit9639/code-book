import CodeMirror from '@uiw/react-codemirror'

/** Importing Themes Start */
import {
  abcdef,
  androidstudio,
  atomone,
  aura,
  bbedit,
  bespin,
  darcula,
  dracula,
  duotoneDark,
  duotoneLight,
  eclipse,
  githubDark,
  githubLight,
  gruvboxDark,
  gruvboxLight,
  materialDark,
  materialLight,
  noctisLilac,
  nord,
  okaidia,
  solarizedDark,
  solarizedLight,
  sublime,
  tokyoNight,
  tokyoNightDay,
  tokyoNightStorm,
  vscodeDark,
  xcodeDark,
  xcodeLight,
} from '@uiw/codemirror-themes-all'
/** Importing Themes End */

/** Importing Languages Start */
import { cpp } from '@codemirror/lang-cpp'
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { javascript } from '@codemirror/lang-javascript'
import { LanguageSupport } from '@codemirror/language'
import { java } from '@codemirror/lang-java'
import { json } from '@codemirror/lang-json'
import { lezer } from '@codemirror/lang-lezer'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { php } from '@codemirror/lang-php'
import { python } from '@codemirror/lang-python'
import { rust } from '@codemirror/lang-rust'
import { sql } from '@codemirror/lang-sql'
import { xml } from '@codemirror/lang-xml'
import { wast } from '@codemirror/lang-wast'
import { languages } from '@codemirror/language-data'
/** Importing Languages End */

type Extension = React.ComponentProps<typeof CodeMirror>['theme']

export const CODEMIRROR_THEMES: Record<string, Extension> = {
  Abcdef: abcdef,
  'Android Studio': androidstudio,
  Atomone: atomone,
  Aura: aura,
  Bbedit: bbedit,
  Bespin: bespin,
  Dracula: dracula,
  Darcula: darcula,
  'Duotone Light': duotoneLight,
  'Duotone Dark': duotoneDark,
  Eclipse: eclipse,
  'Github Light': githubLight,
  'Github Dark': githubDark,
  'Gruvbox Light': gruvboxLight,
  'Gruvbox Dark': gruvboxDark,
  'Material Light': materialLight,
  'Material Dark': materialDark,
  'Noctis Lilac': noctisLilac,
  Nord: nord,
  Okaidia: okaidia,
  'Solarized Light': solarizedLight,
  'Solarized Dark': solarizedDark,
  Sublime: sublime,
  'Tokyo Night': tokyoNight,
  'Tokyo Night Day': tokyoNightDay,
  'Tokyo Night Storm': tokyoNightStorm,
  'VS Code Dark': vscodeDark,
  'Xcode Light': xcodeLight,
  'Xcode Dark': xcodeDark,
}

export const CODEMIRROR_LANGUAGES: Record<string, () => LanguageSupport> = {
  HTML: html,
  CSS: css,
  JavaScript: () => javascript({ jsx: true }),
  Java: java,
  'C/C++': cpp,
  JSON: json,
  Lezer: lezer,
  Markdown: () => markdown({ base: markdownLanguage, codeLanguages: languages }),
  PHP: php,
  Python: python,
  Rust: rust,
  SQL: sql,
  XML: xml,
  WAST: wast,
}

export const DEFAULT_THEMES: { image: string; bgColor: string; themeName: string }[] = [
  {
    image: '/themes/1.png',
    bgColor: '#ABB8C3',
    themeName: 'Tokyo Night',
  },
  {
    image: '/themes/2.png',
    bgColor: '#4A90E2',
    themeName: 'Atomone',
  },
  {
    image: '/themes/3.png',
    bgColor: '#F8E71C',
    themeName: 'Tokyo Night',
  },
  {
    image: '/themes/4.png',
    bgColor: '#EF282C',
    themeName: 'Duotone Light',
  },
  {
    image: '/themes/5.png',
    bgColor: '#7948B9',
    themeName: 'Tokyo Night',
  },
]

/** Setting name and its default value */
export const EDITOR_SETTINGS: Record<string, boolean> = {
  lineNumbers: false,
  highlightActiveLineGutter: false,
  highlightSpecialChars: false,
  history: true,
  foldGutter: true,
  drawSelection: false,
  dropCursor: false,
  allowMultipleSelections: false,
  indentOnInput: false,
  syntaxHighlighting: true,
  bracketMatching: true,
  closeBrackets: true,
  autocompletion: true,
  rectangularSelection: false,
  crosshairCursor: false,
  highlightActiveLine: false,
  highlightSelectionMatches: true,
  closeBracketsKeymap: true,
  defaultKeymap: false,
  searchKeymap: false,
  historyKeymap: false,
  foldKeymap: false,
  completionKeymap: false,
  lintKeymap: false,
}

export const EDITOR_DEFAULT_CODES: Record<string, string> = {
  HTML: `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Form in HTML</title>
</head>
<body>
<form>
  <label for="fname">First name:</label><br>
  <input type="text" id="fname" name="fname"><br>
  <label for="lname">Last name:</label><br>
  <input type="text" id="lname" name="lname">
</form>
</body>
</html>`,
  CSS: `/* Changing background color  */
body {
  background-color: #f0f0f0;
}
`,
  JavaScript: `// generating  a random number
const a = Math.random();
console.log(a);
`,
  Java: `class Simple{  
  public static void main(String args[]){  
   System.out.println("Hello Java");  
  }  
}
`,
  'C/C++': `
// Your First C++ Program
#include <iostream>

int main() {
    std::cout << "Hello World!";
    return 0;
}`,
  JSON: `
{
    "employees":[
      { "firstName":"John", "lastName":"Doe" },
      {"firstName":"Anna", "lastName":"Smith" },
      {"firstName":"Peter", "lastName":"Jones" }
    ]
}
`,
  Lezer: `
// generating  a random number
const a = Math.random();
console.log(a);
`,
  Markdown: `
# This is an H1 #

## This is an H2 ##
  
### This is an H3 ###
`,
  PHP: `
<?php
  $name = "Codebook";
  echo "Hey! This is " . $name . "<br>";
?>
`,
  Python: `
print("Hello World!")
`,
  Rust: `
fn main() {
  println!("Hello World!");
}
`,
  SQL: `-- creating a table
CREATE TABLE STATION
(ID INTEGER PRIMARY KEY,
CITY CHAR(20),
STATE CHAR(2),
LAT_N REAL,
LONG_W REAL);
`,
  XML: `<?xml version="1.0" encoding="UTF-8"?>
- <note>
  <to>Tove</to>
  <from>Jani</from>
  <heading>Reminder</heading>
  <body>Don't forget me this weekend!</body>
</note>
`,
  WAST: `[package]
name = "hello-world"
version = "0.1.0"
authors = ["Your Name <your@name.com>"]
edition = "2018"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
`,
}
