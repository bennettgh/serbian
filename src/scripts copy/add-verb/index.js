const inquirer = require('inquirer');
const fs = require('fs')

async function init() {
  fs.copyFileSync("../../data/verbs.json", `../../data/backups/${new Date().getTime()}-verbs.json`);



  const {
    infinitive,
    translation,
    ptStem,
    normality,
    enPresent1PSingular,
    enPresent2PSingular,
    enPresent3PSingular,
    enPast1PSingular,
    enPast2PSingular,
    ja,
    ti,
    on,
    mi,
    vi,
    oni,
    tags
  } = await inquirer.prompt([
    {
      type: 'input',
      message: 'Infinitive of verb?',
      name: 'infinitive',
    },
    {
      type: 'input',
      message: 'Translation of verb (eg: to "work"):',
      name: 'translation',
    },
    {
      type: 'confirm',
      message: 'Is this a normal verb?',
      name: 'normality',
      default: true
    },
    {
      type: 'input',
      message: 'Present first-person singular of verb in English? I... ___',
      name: 'enPresent1PSingular',
    },
    {
      type: 'input',
      message: 'Present second-person singular of verb in English? You... ___',
      name: 'enPresent2PSingular',
    },
    {
      type: 'input',
      message: 'Present third-person singular of verb in English? He... ___:',
      name: 'enPresent3PSingular',
    },
    {
      type: 'input',
      message: 'Past first-person singular of verb in English? I ___',
      name: 'enPast1PSingular',
    },
    {
      type: 'input',
      message: 'Past second-person singular of verb in English? You... ___',
      name: 'enPast2PSingular',
    },
    // conjugations
    {
      type: 'input',
      message: 'Ja...',
      name: 'ja',
      when: (answers) => answers.normality
    },
    {
      type: 'input',
      message: 'Ti...',
      name: 'ti',
      when: (answers) => answers.normality
    },
    {
      type: 'input',
      message: 'On...',
      name: 'on',
      when: (answers) => answers.normality
    },
    {
      type: 'input',
      message: 'Mi...',
      name: 'mi',
      when: (answers) => answers.normality
    },
    {
      type: 'input',
      message: 'Vi...',
      name: 'vi',
      when: (answers) => answers.normality
    },
    {
      type: 'input',
      message: 'Oni...',
      name: 'oni',
      when: (answers) => answers.normality
    },
    {
      type: 'input',
      message: 'Stem for past tense of verb (eg: "radi"):',
      name: 'ptStem',
      when: (answers) => answers.normality
    },
    {
      type: 'input',
      message: 'Tags (eg: "modal","important"):',
      name: 'tags',
    },
  ])

  let data;

  if (!normality) {
    data = `
    "${infinitive}": {
      "translation": "to ${translation}",
      "tags": [${tags}],
      "present": {
        "i ${enPresent1PSingular}": "ja ",
        "you ${enPresent2PSingular} (singular)": "ti ",
        "he ${enPresent3PSingular}": "on ",
        "she ${enPresent3PSingular}": "ona ",
        "they ${enPresent2PSingular} (singular)": "ono ",
        "we ${enPresent2PSingular}": "mi ",
        "you ${enPresent2PSingular} (plural)": "vi ",
        "they ${enPresent2PSingular} (plural masc)": "oni ",
        "they ${enPresent2PSingular} (plural fem)": "one ",
        "they ${enPresent2PSingular} (plural neutral)": "ona "
      },
      "past": {
        "i ${enPast1PSingular}": "ja sam ",
        "you ${enPast2PSingular} (singular masc)": "ti si ",
        "you ${enPast2PSingular} (singular fem)": "ti si ",
        "he ${enPast1PSingular}": "on je ",
        "she ${enPast1PSingular}": "ona je ",
        "they ${enPast2PSingular} (singular)": "ono je ",
        "we ${enPast2PSingular}": "mi smo ",
        "you ${enPast2PSingular} (plural masc)": "vi ste ",
        "you ${enPast2PSingular} (plural fem)": "vi ste ",
        "they ${enPast2PSingular} (plural masc)": "oni su ",
        "they ${enPast2PSingular} (plural fem)": "one su ",
        "they ${enPast2PSingular} (plural neutral)": "ona su "
      },
      "future": {
        "i will ${translation}": "ja ću ${infinitive}",
        "you will ${translation} (singular)": "ti ćeš ${infinitive}",
        "he will ${translation}": "on će ${infinitive}",
        "she will ${translation}": "ona će ${infinitive}",
        "they will ${translation} (singular)": "ono će ${infinitive}",
        "we will ${translation}": "mi ćemo ${infinitive}",
        "you will ${translation} (plural)": "vi ćete ${infinitive}",
        "they will ${translation} (plural masc)": "oni će ${infinitive}",
        "they will ${translation} (plural fem)": "one će ${infinitive}",
        "they will ${translation} (plural neutral)": "ona će ${infinitive}"
      }
    }
  }
]
  `
  } else {
    data = `
    "${infinitive}": {
      "translation": "to ${translation}",
      "tags": [${tags}],
      "present": {
        "i ${enPresent1PSingular}": "ja ${ja}",
        "you ${enPresent2PSingular} (singular)": "ti ${ti}",
        "he ${enPresent3PSingular}": "on ${on}",
        "she ${enPresent3PSingular}": "ona ${on}",
        "they ${enPresent2PSingular} (singular)": "ono ${on}",
        "we ${enPresent2PSingular}": "mi ${mi}",
        "you ${enPresent2PSingular} (plural)": "vi ${vi}",
        "they ${enPresent2PSingular} (plural masc)": "oni ${oni}",
        "they ${enPresent2PSingular} (plural fem)": "one ${oni}",
        "they ${enPresent2PSingular} (plural neutral)": "ona ${oni}"
      },
      "past": {
        "i ${enPast1PSingular}": "ja sam ${ptStem}o",
        "you ${enPast2PSingular} (singular masc)": "ti si ${ptStem}o",
        "you ${enPast2PSingular} (singular fem)": "ti si ${ptStem}la",
        "he ${enPast1PSingular}": "on je ${ptStem}o",
        "she ${enPast1PSingular}": "ona je ${ptStem}la",
        "they ${enPast2PSingular} (singular)": "ono je ${ptStem}lo",
        "we ${enPast2PSingular}": "mi smo ${ptStem}li",
        "you ${enPast2PSingular} (plural masc)": "vi ste ${ptStem}li",
        "you ${enPast2PSingular} (plural fem)": "vi ste ${ptStem}le",
        "they ${enPast2PSingular} (plural masc)": "oni su ${ptStem}li",
        "they ${enPast2PSingular} (plural fem)": "one su ${ptStem}le",
        "they ${enPast2PSingular} (plural neutral)": "ona su ${ptStem}la"
      },
      "future": {
        "i will ${translation}": "ja ću ${infinitive}",
        "you will ${translation} (singular)": "ti ćeš ${infinitive}",
        "he will ${translation}": "on će ${infinitive}",
        "she will ${translation}": "ona će ${infinitive}",
        "they will ${translation} (singular)": "ono će ${infinitive}",
        "we will ${translation}": "mi ćemo ${infinitive}",
        "you will ${translation} (plural)": "vi ćete ${infinitive}",
        "they will ${translation} (plural masc)": "oni će ${infinitive}",
        "they will ${translation} (plural fem)": "one će ${infinitive}",
        "they will ${translation} (plural neutral)": "ona će ${infinitive}"
      }
    }
  }
]
  `
  }


  const originalVerbs = fs.readFileSync('../../data/verbs.json', 'utf-8')
  const originalWithoutCloseBrackets = originalVerbs.split('\n').slice(0, -2).join("\n") + ','
  const res = originalWithoutCloseBrackets + data 
  fs.writeFileSync('../../data/verbs.json', res);
}

init().then(() => console.log("done"));
