const inquirer = require('inquirer');
const { VERBS_TABLE_NAME } = require('../../database/constants')
const {
  insertValueSafely,
  backupTable
} = require('../../database/api')

async function run() {

  const {
    infinitive,
    translation,
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
      message: 'Tags (eg: "modal","important"):',
      name: 'tags',
    },
  ])

  let data;

  if (!normality) {
    data = {
      "translation": `to ${translation}`,
      "tags": [tags],
      "present": {
        [`i ${enPresent1PSingular}`]: "ja ",
        [`you ${enPresent2PSingular} (singular)`]: "ti ",
        [`he ${enPresent3PSingular}`]: "on ",
        [`she ${enPresent3PSingular}`]: "ona ",
        [`they ${enPresent2PSingular} (singular)`]: "ono ",
        [`we ${enPresent2PSingular}`]: "mi ",
        [`you ${enPresent2PSingular} (plural)`]: "vi ",
        [`they ${enPresent2PSingular} (plural masc)`]: "oni ",
        [`they ${enPresent2PSingular} (plural fem)`]: "one ",
        [`they ${enPresent2PSingular} (plural neutral)`]: "ona "
      },
      "past": {
        [`i ${enPast1PSingular}`]: "ja sam ",
        [`you ${enPast2PSingular} (singular masc)`]: "ti si ",
        [`you ${enPast2PSingular} (singular fem)`]: "ti si ",
        [`he ${enPast1PSingular}`]: "on je ",
        [`she ${enPast1PSingular}`]: "ona je ",
        [`they ${enPast2PSingular} (singular)`]: "ono je ",
        [`we ${enPast2PSingular}`]: "mi smo ",
        [`you ${enPast2PSingular} (plural masc)`]: "vi ste ",
        [`you ${enPast2PSingular} (plural fem)`]: "vi ste ",
        [`they ${enPast2PSingular} (plural masc)`]: "oni su ",
        [`they ${enPast2PSingular} (plural fem)`]: "one su ",
        [`they ${enPast2PSingular} (plural neutral)`]: "ona su "
      },
      "future": {
        [`i will ${translation}`]: `ja ću ${infinitive}`,
        [`you will ${translation} (singular)`]: `ti ćeš ${infinitive}`,
        [`he will ${translation}`]: `on će ${infinitive}`,
        [`she will ${translation}`]: `ona će ${infinitive}`,
        [`they will ${translation} (singular)`]: `ono će ${infinitive}`,
        [`we will ${translation}`]: `mi ćemo ${infinitive}`,
        [`you will ${translation} (plural)`]: `vi ćete ${infinitive}`,
        [`they will ${translation} (plural masc)`]: `oni će ${infinitive}`,
        [`they will ${translation} (plural fem)`]: `one će ${infinitive}`,
        [`they will ${translation} (plural neutral)`]: `ona će ${infinitive}`
      }
    }
  } else {
    const stem = getStemFromInfinitive(infinitive)

    data = {
      "translation": `to ${translation}`,
      "tags": [tags],
      "present": {
        [`i ${enPresent1PSingular}`]: `ja ${ja}`,
        [`you ${enPresent2PSingular} (singular)`]: `ti ${ti}`,
        [`he ${enPresent3PSingular}`]: `on ${on}`,
        [`she ${enPresent3PSingular}`]: `ona ${on}`,
        [`they ${enPresent2PSingular} (singular)`]: `ono ${on}`,
        [`we ${enPresent2PSingular}`]: `mi ${mi}`,
        [`you ${enPresent2PSingular} (plural)`]: `vi ${vi}`,
        [`they ${enPresent2PSingular} (plural masc)`]: `oni ${oni}`,
        [`they ${enPresent2PSingular} (plural fem)`]: `one ${oni}`,
        [`they ${enPresent2PSingular} (plural neutral)`]: `ona ${oni}`
      },
      "past": {
        [`i ${enPast1PSingular}`]: `ja sam ${stem}o`,
        [`you ${enPast2PSingular} (singular masc)`]: `ti si ${stem}o`,
        [`you ${enPast2PSingular} (singular fem)`]: `ti si ${stem}la`,
        [`he ${enPast1PSingular}`]: `on je ${stem}o`,
        [`she ${enPast1PSingular}`]: `ona je ${stem}la`,
        [`they ${enPast2PSingular} (singular)`]: `ono je ${stem}lo`,
        [`we ${enPast2PSingular}`]: `mi smo ${stem}li`,
        [`you ${enPast2PSingular} (plural masc)`]: `vi ste ${stem}li`,
        [`you ${enPast2PSingular} (plural fem)`]: `vi ste ${stem}le`,
        [`they ${enPast2PSingular} (plural masc)`]: `oni su ${stem}li`,
        [`they ${enPast2PSingular} (plural fem)`]: `one su ${stem}le`,
        [`they ${enPast2PSingular} (plural neutral)`]: `ona su ${stem}la`
      },
      "future": {
        [`i will ${translation}`]: `ja ću ${infinitive}`,
        [`you will ${translation} (singular)`]: `ti ćeš ${infinitive}`,
        [`he will ${translation}`]: `on će ${infinitive}`,
        [`she will ${translation}`]: `ona će ${infinitive}`,
        [`they will ${translation} (singular)`]: `ono će ${infinitive}`,
        [`we will ${translation}`]: `mi ćemo ${infinitive}`,
        [`you will ${translation} (plural)`]: `vi ćete ${infinitive}`,
        [`they will ${translation} (plural masc)`]: `oni će ${infinitive}`,
        [`they will ${translation} (plural fem)`]: `one će ${infinitive}`,
        [`they will ${translation} (plural neutral)`]: `ona će ${infinitive}`
      }
    }
  }

  backupTable(VERBS_TABLE_NAME)
  insertValueSafely(VERBS_TABLE_NAME, infinitive, data)
  console.log("done")
}

run()


function getStemFromInfinitive(inf) {
  if (inf.endsWith('sti')) {
    return inf.substring(0, inf.length - 3)
  } else if (inf.endsWith('ti')) {
    return inf.substring(0, inf.length - 2)
  } else {
    return ''
  }
}